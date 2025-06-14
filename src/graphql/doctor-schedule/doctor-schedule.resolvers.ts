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
import moment from "moment";

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
      orderBy: {
        day: "asc",
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

    await prisma.doctorSchedule.createMany({
      data,
    });

    const schedules = await prisma.doctorSchedule.findMany({
      where: {
        doctorId,
      },
      orderBy: {
        day: "asc",
      },
    });

    return schedules;
  },

  getDoctorScheduleByDate: async (
    _: any,
    args: { doctorId: string; date: string },
    { prisma }: TContext
  ) => {
    if (!args.date) {
      throw new AppError(status.BAD_REQUEST, "Date is required");
    }

    const date = moment(args.date, "ddd MMM DD YYYY");

    if (!date.isValid()) {
      throw new AppError(status.BAD_REQUEST, "Invalid Date.");
    }

    const weekName = date.format("dddd").toUpperCase();

    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId: args.doctorId,
        day: weekName as DAY,
      },
    });

    if (schedule) {
      return schedule;
    } else {
      return null;
    }
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

    const parsedData = await DoctorSchedule.validations.update.parseAsync(
      args.input
    );

    const schedules = await prisma.doctorSchedule.findMany({
      where: {
        id: {
          in: parsedData.ids,
        },
      },
      select: {
        id: true,
      },
    });

    if (!schedules.length) {
      throw new AppError(status.NOT_FOUND, "Schedule not found.");
    }

    const schedulesToUpdate: string[] = schedules.map((item) => item.id);

    await prisma.doctorSchedule.updateMany({
      where: { id: { in: schedulesToUpdate } },
      data: parsedData.data,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
