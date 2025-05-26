import {
  MedicalReport as TMedicalReport,
  Prisma,
  REPORT_TYPE,
  ROLE,
} from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TMedicalReportCreateInput } from "./medical-report.type";
import { MedicalReport } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllReports: async (
    _: any,
    queries: TFilters,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser);

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const andConditions: Prisma.Enumerable<Prisma.MedicalReportWhereInput> = [];

    andConditions.push({
      reportType: {
        not: REPORT_TYPE.PRESCRIPTION,
      },
    });

    if (queries?.searchTerm) {
      andConditions.push({
        OR: [
          ...["title", "notes"].map((field) => ({
            [field]: {
              contains: queries?.searchTerm,
              mode: "insensitive",
            },
          })),
          {
            appointment: {
              service: {
                name: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            patient: {
              user: {
                email: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            patient: {
              user: {
                phoneNumber: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      });
    }

    if (queries?.reportType) {
      andConditions.push({ reportType: queries?.reportType });
    }

    if (currentUser?.role === ROLE.PATIENT) {
      andConditions.push({ patient: { user: { id: currentUser.id } } });
    }

    if (queries?.patientId) {
      andConditions.push({ patient: { id: queries?.patientId } });
    }

    const reports = await prisma.medicalReport.findMany({
      where: {
        AND: andConditions,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.medicalReport.count({
      where: { AND: andConditions },
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { reports, meta };
  },
};

const relationalQuery = {
  MedicalReport: {
    patient: async (parent: TMedicalReport, _: any, { prisma }: TContext) => {
      return await prisma.patient.findUnique({
        where: { id: parent.patientId },
      });
    },

    appointment: async (
      parent: TMedicalReport,
      _: any,
      { prisma }: TContext,
    ) => {
      return await prisma.appointment.findUnique({
        where: { id: parent.appointmentId as string },
      });
    },
  },
};

const mutations = {
  createMedicalReport: async (
    _: any,
    args: TMedicalReportCreateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [
      ROLE.DOCTOR,
      ROLE.ADMIN,
      ROLE.SUPER_ADMIN,
    ]);

    const parsedData = await MedicalReport.validations.create.parseAsync(args);

    const isPatientExist = await prisma.patient.findUnique({
      where: { id: parsedData.patientId },
      select: { id: true },
    });

    if (!isPatientExist) {
      throw new AppError(status.NOT_FOUND, "Patient not found");
    }

    if (
      [REPORT_TYPE.PRESCRIPTION, REPORT_TYPE.LAB_REPORT].findIndex(
        (type) => type === parsedData?.reportType,
      ) !== -1 &&
      !parsedData?.appointmentId
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        "Appointment id is required for" +
          " " +
          parsedData.reportType.toLowerCase().split(_).join(" ") +
          ".",
      );
    }

    if (parsedData?.appointmentId) {
      const isAppointmentExist = await prisma.appointment.findUnique({
        where: { id: parsedData.appointmentId },
        select: { id: true, patientId: true, report: { select: { id: true } } },
      });

      if (!isAppointmentExist) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
      }

      if (parsedData?.patientId !== isAppointmentExist.patientId) {
        throw new AppError(
          status.BAD_REQUEST,
          "Patient and appointment patient are not same",
        );
      }

      if (isAppointmentExist?.report?.id) {
        await prisma.medicalReport.update({
          where: { id: isAppointmentExist.report.id },
          data: parsedData,
        });

        return { success: true };
      }
    }

    await prisma.medicalReport.create({
      data: parsedData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, relationalQuery, mutations };
