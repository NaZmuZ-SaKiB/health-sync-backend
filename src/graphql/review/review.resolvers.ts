import { Prisma, Review as TReview, ROLE } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TReviewCreateInput } from "./review.type";
import { Review } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllReviews: async (
    _: any,
    queries: TFilters,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [
      ROLE.DOCTOR,
      ROLE.ADMIN,
      ROLE.SUPER_ADMIN,
    ]);

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const andConditions: Prisma.Enumerable<Prisma.ReviewWhereInput> = [];

    if (currentUser?.role === ROLE.DOCTOR) {
      andConditions.push({
        doctor: {
          userId: currentUser?.id,
        },
      });
    }

    if (queries?.searchTerm) {
      andConditions.push({
        OR: [
          {
            doctor: {
              user: {
                email: {
                  contains: queries.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            service: {
              name: {
                contains: queries.searchTerm,
                mode: "insensitive",
              },
            },
          },
          {
            comment: {
              contains: queries.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (queries?.type && queries?.type === "doctor") {
      andConditions.push({
        doctorId: {
          not: null,
        },
        serviceId: null,
      });
    }

    if (queries?.type && queries?.type === "service") {
      andConditions.push({
        serviceId: {
          not: null,
        },
        doctorId: null,
      });
    }

    if (queries?.serviceId) {
      andConditions.push({
        serviceId: queries.serviceId,
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        AND: andConditions,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.review.count({
      where: { AND: andConditions },
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { reviews, meta };
  },
};

const relationalQuery = {
  Review: {
    patient: async (parent: TReview, _: any, { prisma }: TContext) => {
      return await prisma.patient.findUnique({
        where: { id: parent.patientId },
      });
    },

    doctor: async (parent: TReview, _: any, { prisma }: TContext) => {
      if (!parent.doctorId) return null;

      return await prisma.doctor.findUnique({
        where: { id: parent.doctorId },
      });
    },

    service: async (parent: TReview, _: any, { prisma }: TContext) => {
      if (!parent.serviceId) return null;

      return await prisma.service.findUnique({
        where: { id: parent.serviceId },
      });
    },

    appointment: async (parent: TReview, _: any, { prisma }: TContext) => {
      return await prisma.appointment.findUnique({
        where: { id: parent.appointmentId },
      });
    },
  },
};

const mutations = {
  createReview: async (
    _: any,
    args: TReviewCreateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.PATIENT]);

    const parsedData = await Review.validations.create.parseAsync(args);

    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
      select: {
        id: true,
        patient: {
          select: {
            id: true,
          },
        },
      },
    });

    const isAppointmentExists = await prisma.appointment.findFirst({
      where: {
        id: parsedData.appointmentId,
        patientId: user?.patient?.id,
      },
      select: { id: true, doctorId: true, serviceId: true },
    });

    if (!isAppointmentExists) {
      throw new AppError(status.NOT_FOUND, "Appointment not found.");
    }

    const isReviewExists = await prisma.review.findFirst({
      where: {
        appointmentId: parsedData.appointmentId,
      },
    });

    if (isReviewExists) {
      throw new AppError(status.BAD_REQUEST, "Review already exists.");
    }

    await prisma.review.create({
      data: {
        patientId: user?.patient?.id as string,
        doctorId: isAppointmentExists?.doctorId || null,
        serviceId: isAppointmentExists?.serviceId || null,
        appointmentId: parsedData.appointmentId,
        rating: parsedData.rating,
        comment: parsedData.comment,
      },
    });

    return { success: true };
  },
};

export const resolvers = { queries, relationalQuery, mutations };
