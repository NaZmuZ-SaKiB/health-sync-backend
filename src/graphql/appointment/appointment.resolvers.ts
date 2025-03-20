import { Prisma, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TAppointmentCreateInput } from "./appointment.type";
import { Appointment } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import moment from "moment";

const queries = {};

const mutations = {
  createAppointment: async (
    _: any,
    args: TAppointmentCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.PATIENT]);

    const parsedData = await Appointment.validations.create.parseAsync(
      args.input
    );

    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
      select: { id: true, patient: { select: { id: true } } },
    });

    if (!user?.patient?.id) {
      throw new AppError(status.BAD_REQUEST, "Patient ID is required.");
    }

    const schedule = await prisma.doctorSchedule.findUnique({
      where: { id: parsedData.scheduleId },
      select: {
        id: true,
        doctorId: true,
        day: true,
        startTime: true,
        endTime: true,
        isAvailable: true,
      },
    });

    if (!schedule) {
      throw new AppError(status.NOT_FOUND, "Schedule not found.");
    }

    if (!schedule.isAvailable) {
      throw new AppError(status.BAD_REQUEST, "Schedule is not available.");
    }

    const timeFormat = "HH:mm";

    const appointmentStartTime = moment(
      parsedData.timeSlot.startTime,
      timeFormat
    );
    const appointmentEndTime = moment(parsedData.timeSlot.endTime, timeFormat);

    const scheduleStartTime = moment(schedule.startTime, timeFormat);
    const scheduleEndTime = moment(schedule.endTime, timeFormat);

    if (
      appointmentStartTime.isBefore(scheduleStartTime) ||
      appointmentEndTime.isAfter(scheduleEndTime)
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        `Appointment time must be within ${scheduleStartTime.format(
          "hh:mm A"
        )} and ${scheduleEndTime.format("hh:mm A")}.`
      );
    }

    const isAppointmentExist = await prisma.appointment.findFirst({
      where: {
        doctorId: schedule.doctorId,
        timeSlot: {
          slotDate: parsedData.timeSlot.slotDate,
          startTime: parsedData.timeSlot.startTime,
          endTime: parsedData.timeSlot.endTime,
        },
      },
    });

    if (isAppointmentExist) {
      throw new AppError(
        status.BAD_REQUEST,
        "Appointment already exists for this time slot."
      );
    }

    const { timeSlot, scheduleId, ...appointmentData } = parsedData;

    await prisma.$transaction(async (tx) => {
      const newTimeSlot = await tx.timeSlot.create({
        data: {
          ...parsedData.timeSlot,
          doctorId: schedule.doctorId,
          day: schedule.day,
          isBooked: true,
        },
        select: {
          id: true,
        },
      });

      await tx.appointment.create({
        data: {
          doctorId: schedule.doctorId,
          patientId: user?.patient?.id as string,
          slotId: newTimeSlot.id,
          ...appointmentData,
        },
      });
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
