import { REPORT_TYPE, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TMedicalReportCreateInput } from "./medical-report.type";
import { MedicalReport } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {};

const mutations = {
  createMedicalReport: async (
    _: any,
    args: TMedicalReportCreateInput,
    { prisma, currentUser }: TContext
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
      parsedData.reportType === REPORT_TYPE.PRESCRIPTION &&
      !parsedData.appointmentId
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        "Appointment id is required for prescription"
      );
    }

    if (parsedData.appointmentId) {
      const isAppointmentExist = await prisma.appointment.findUnique({
        where: { id: parsedData.appointmentId },
        select: { id: true, patientId: true, report: { select: { id: true } } },
      });

      if (!isAppointmentExist) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
      }

      if (parsedData.patientId !== isAppointmentExist.patientId) {
        throw new AppError(
          status.BAD_REQUEST,
          "Patient and appointment patient are not same"
        );
      }

      if (isAppointmentExist?.report?.id) {
        throw new AppError(
          status.BAD_REQUEST,
          "Report already exist for this appointment"
        );
      }
    }

    await prisma.medicalReport.create({
      data: parsedData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
