import status from "http-status";
import AppError from "../../errors/AppError";
import { TContext } from "../../types";
import moment from "moment";

const queries = {
  getTimeSlotsByDate: async (
    _: any,
    args: {
      doctorId?: string;
      serviceId?: string;
      locationId?: string;
      date: string;
    },
    { prisma }: TContext,
  ) => {
    if (!args.date) {
      throw new AppError(status.BAD_REQUEST, "Date is required");
    }

    const isValidDate = moment(args.date, "DD-MM-YYYY").isValid();
    if (!isValidDate) {
      throw new AppError(
        status.BAD_REQUEST,
        "Date Format should be DD-MM-YYYY.",
      );
    }

    console.log("args", args);

    const slots = await prisma.timeSlot.findMany({
      where: {
        slotDate: args.date,
        OR: [
          {
            doctorId: args.doctorId,
          },
          {
            serviceId: args.serviceId,
            locationId: args.locationId,
          },
        ],
      },
    });

    return slots;
  },
};

const mutations = {};

export const resolvers = { queries, mutations };
