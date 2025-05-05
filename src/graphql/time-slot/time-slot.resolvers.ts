import status from "http-status";
import AppError from "../../errors/AppError";
import { TContext } from "../../types";
import moment from "moment";

const queries = {
  getTimeSlotsByDate: async (
    _: any,
    args: { doctorId: string; date: string },
    { prisma }: TContext
  ) => {
    if (!args.date) {
      throw new AppError(status.BAD_REQUEST, "Date is required");
    }

    const isValidDate = moment(args.date, "DD-MM-YYYY").isValid();
    if (!isValidDate) {
      throw new AppError(
        status.BAD_REQUEST,
        "Date Format should be DD-MM-YYYY."
      );
    }

    const slots = await prisma.timeSlot.findMany({
      where: {
        doctorId: args.doctorId,
        slotDate: args.date,
      },
    });

    return slots;
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
