import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import {
  TDoctorScheduleCreateInput,
  TDoctorScheduleUpdateInput,
} from "./doctor-schedule.type";
import { DoctorSchedule } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {};

const mutations = {
  createDoctorSchedule: async (
    _: any,
    args: TDoctorScheduleCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.DOCTOR]);

    const parsedData = await DoctorSchedule.validations.create.parseAsync(args);

    const isDoctorExist = await prisma.doctor.findUnique({
      where: { id: parsedData.doctorId },
    });

    if (!isDoctorExist) {
      throw new AppError(status.NOT_FOUND, "Doctor not found.");
    }

    const isScheduleExist = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId: parsedData.doctorId,
        day: parsedData.day,
      },
    });

    if (isScheduleExist) {
      throw new AppError(
        status.BAD_REQUEST,
        "Doctor schedule already exists for this day. Please update it."
      );
    }

    await prisma.doctorSchedule.create({
      data: parsedData,
    });

    return { success: true };
  },

  updateDoctorSchedule: async (
    _: any,
    args: TDoctorScheduleUpdateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.DOCTOR]);

    const parsedData = await DoctorSchedule.validations.update.parseAsync(args);

    const isScheduleExist = await prisma.doctorSchedule.findUnique({
      where: { id: parsedData.scheduleId },
    });

    if (!isScheduleExist) {
      throw new AppError(status.NOT_FOUND, "Schedule not found.");
    }

    const { scheduleId, ...updateData } = parsedData;

    await prisma.doctorSchedule.update({
      where: { id: parsedData.scheduleId },
      data: updateData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
