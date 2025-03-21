import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TReviewCreateInput } from "./review.type";
import { Review } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {};

const mutations = {
  createReview: async (
    _: any,
    args: TReviewCreateInput,
    { prisma, currentUser }: TContext
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
      select: { id: true, doctorId: true },
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
        doctorId: isAppointmentExists.doctorId,
        appointmentId: parsedData.appointmentId,
        rating: parsedData.rating,
        comment: parsedData.comment,
      },
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
