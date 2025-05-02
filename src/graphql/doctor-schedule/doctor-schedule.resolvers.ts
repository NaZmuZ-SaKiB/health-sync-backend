import { DAY, Prisma, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import {
  TDoctorScheduleCreateInput,
  TDoctorScheduleUpdateInput,
} from "./doctor-schedule.type";
import { DoctorSchedule } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {
  doctorSchedules: async (
    _: any,
    args: { doctorId: string },
    { prisma }: TContext
  ) => {
    const isSchedules = await prisma.doctorSchedule.findMany({
      where: {
        OR: [
          {
            doctorId: args.doctorId,
          },
          {
            doctor: {
              userId: args.doctorId,
            },
          },
        ],
      },
    });

    if (isSchedules.length === 7) return isSchedules;

    let doctorId = args.doctorId;

    const isDoctorId = await prisma.doctor.findUnique({
      where: { id: args.doctorId },
    });

    if (!isDoctorId) {
      const isUserId = await prisma.user.findUnique({
        where: { id: args.doctorId, role: ROLE.DOCTOR },
        select: {
          doctor: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!isUserId) {
        throw new AppError(status.BAD_REQUEST, "Invalid Data Provided.");
      }

      doctorId = isUserId.doctor?.id as string;
    }

    let days = Object.values(DAY);

    if (isSchedules.length > 0) {
      isSchedules.forEach((schedule) => {
        days = days.filter((day) => day !== schedule.day);
      });
    }

    const data: Prisma.DoctorScheduleCreateManyInput[] = days.map((day) => ({
      doctorId: doctorId,
      day,
    }));

    const newSchedules = await prisma.doctorSchedule.createManyAndReturn({
      data,
    });

    return [...isSchedules, ...newSchedules];
  },
};

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
