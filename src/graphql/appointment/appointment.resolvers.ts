import {
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  Prisma,
  ROLE,
  TimeSlot,
} from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import {
  TAppointmentCreateInput,
  TAppointmentUpdateInput,
} from "./appointment.type";
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
    //* Step 1: Check if the user is authenticated and has the required role
    //* Step 2: Validate the input data
    //* Step 3: Check if the schedule is available
    //* Step 4: Check if the appointment time is within the schedule time
    //* Step 5: Check if the time slot is already booked
    //* Step 6: Create appointment

    await auth(prisma, currentUser, [ROLE.PATIENT]);

    const parsedData = await Appointment.validations.create.parseAsync(
      args.input
    );

    // Get the patientId of the current user
    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
      select: { id: true, patient: { select: { id: true } } },
    });

    // Check if the schedule is available
    const schedule = await prisma.doctorSchedule.findUnique({
      where: { id: parsedData.scheduleId },
      select: {
        id: true,
        doctorId: true,
        day: true,
        startTime: true,
        endTime: true,
        isAvailable: true,
        doctor: {
          select: {
            fee: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new AppError(status.NOT_FOUND, "Schedule not found.");
    }

    if (!schedule.isAvailable) {
      throw new AppError(status.BAD_REQUEST, "Schedule is not available.");
    }

    // Check if the appointment time is within the schedule time
    const timeFormat = "HH:mm";

    const appointmentStartTime = moment(
      parsedData?.timeSlot?.startTime,
      timeFormat
    );
    const appointmentEndTime = moment(
      parsedData?.timeSlot?.endTime,
      timeFormat
    );

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

    // Check if the time slot is already booked
    const isTimeSlotExist = await prisma.timeSlot.findFirst({
      where: {
        doctorId: schedule.doctorId,
        slotDate: parsedData.timeSlot.slotDate,
        startTime: parsedData.timeSlot.startTime,
      },
      select: {
        id: true,
        isBooked: true,
      },
    });

    if (isTimeSlotExist && isTimeSlotExist.isBooked) {
      throw new AppError(status.BAD_REQUEST, "Time slot is already booked.");
    }

    const { timeSlot, scheduleId, ...appointmentData } = parsedData;

    // Create appointment
    await prisma.$transaction(async (tx) => {
      let newTimeSlot: Partial<TimeSlot> | null = null;

      // Create new time slot if it doesn't exist
      if (!isTimeSlotExist) {
        newTimeSlot = await tx.timeSlot.create({
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
      } else {
        await tx.timeSlot.update({
          where: { id: isTimeSlotExist.id },
          data: { isBooked: true },
        });
      }

      await tx.appointment.create({
        data: {
          doctorId: schedule.doctorId,
          patientId: user?.patient?.id as string,
          slotId: isTimeSlotExist
            ? isTimeSlotExist?.id
            : (newTimeSlot?.id as string),
          ...appointmentData,
          payment: {
            create: {
              amount: schedule.doctor.fee as number,
              status:
                schedule.doctor.fee === 0
                  ? PAYMENT_STATUS.COMPLETED
                  : PAYMENT_STATUS.PENDING,
            },
          },
        },
      });
    });

    return { success: true };
  },

  updateAppointment: async (
    _: any,
    args: TAppointmentUpdateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [
      ROLE.DOCTOR,
      ROLE.ADMIN,
      ROLE.SUPER_ADMIN,
    ]);

    const parsedData = await Appointment.validations.update.parseAsync(args);

    // Check if the appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: parsedData.appointmentId },
      select: {
        id: true,
        doctorId: true,
        slotId: true,
        status: true,
        timeSlot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            slotDate: true,
          },
        },
        doctor: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new AppError(status.NOT_FOUND, "Appointment not found.");
    }

    // Check if the current user is the doctor of the appointment
    if (
      currentUser?.role === ROLE.DOCTOR &&
      currentUser?.id !== appointment.doctor.userId
    ) {
      throw new AppError(
        status.FORBIDDEN,
        "You are not authorized to update this appointment."
      );
    }

    // If status is completed or no show, current time should be after the appointment time
    if (
      parsedData.status === APPOINTMENT_STATUS.COMPLETED ||
      parsedData.status === APPOINTMENT_STATUS.NO_SHOW
    ) {
      const appointmentDateTime = moment(
        `${appointment.timeSlot.slotDate} ${appointment.timeSlot.startTime}`,
        "DD-MM-YYYY HH:mm"
      );
      const currentDateTime = moment();

      if (currentDateTime.isBefore(appointmentDateTime)) {
        throw new AppError(
          status.BAD_REQUEST,
          "You can't update appointment status before appointment time."
        );
      }
    }

    const { appointmentId, ...updateData } = parsedData;

    await prisma.$transaction(async (tx) => {
      // Make time slot available if the appointment is cancelled
      if (parsedData.status === APPOINTMENT_STATUS.CANCELLED) {
        await tx.timeSlot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        });
      }

      await tx.appointment.update({
        where: { id: parsedData.appointmentId },
        data: updateData,
      });
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
