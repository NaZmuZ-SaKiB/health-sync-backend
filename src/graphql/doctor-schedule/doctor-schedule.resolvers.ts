import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TDoctorScheduleCreateInput } from "./doctor-schedule.type";
import { DoctorSchedule } from ".";

const queries = {};

const mutations = {
  createDoctorSchedule: async (
    _: any,
    args: TDoctorScheduleCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.DOCTOR]);

    const parsedData = await DoctorSchedule.validations.create.parseAsync(args);

    await prisma.doctorSchedule.create({
      data: parsedData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
