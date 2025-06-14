import bcrypt from "bcrypt";
import {
  Appointment as TAppointment,
  APPOINTMENT_STATUS,
  DAY,
  PAYMENT_STATUS,
  Prisma,
  ROLE,
  TimeSlot,
  DoctorSchedule as TDoctorSchedule,
  ServiceSettings as TServiceSettings,
  Doctor as TDoctor,
} from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import {
  TAppointmentCreateInput,
  TAppointmentUpdateInput,
} from "./appointment.type";
import { Appointment } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import moment, { Moment } from "moment";
import config from "../../config";
import { jwtHelpers } from "../../utils/jwtHelper";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllAppointments: async (
    _: any,
    queries: TFilters,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser);

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const andConditions: Prisma.Enumerable<Prisma.AppointmentWhereInput> = [];

    // retrun service appointmetns if current user is admin
    if (!queries?.all) {
      if (
        currentUser?.role === ROLE.ADMIN ||
        currentUser?.role === ROLE.SUPER_ADMIN
      ) {
        andConditions.push({
          serviceId: {
            not: null,
          },
        });
        andConditions.push({
          doctorId: null,
        });
      }
    }

    if (currentUser?.role === ROLE.DOCTOR) {
      andConditions.push({ doctor: { user: { id: currentUser.id } } });
    }

    if (currentUser?.role === ROLE.PATIENT) {
      andConditions.push({ patient: { user: { id: currentUser.id } } });
    }

    if (queries?.searchTerm) {
      andConditions.push({
        OR: [
          {
            id: queries?.searchTerm,
          },
          {
            doctorId: queries?.searchTerm,
          },
          {
            doctor: {
              user: {
                firstName: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            doctor: {
              user: {
                lastName: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            doctor: {
              user: {
                phoneNumber: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            patientId: queries?.searchTerm,
          },
          {
            patient: {
              user: {
                firstName: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            patient: {
              user: {
                lastName: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            patient: {
              user: {
                phoneNumber: {
                  contains: queries?.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            service: {
              name: {
                contains: queries?.searchTerm,
                mode: "insensitive",
              },
            },
          },
          {
            reason: {
              contains: queries?.searchTerm,
              mode: "insensitive",
            },
          },
          {
            notes: {
              contains: queries?.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (queries?.status) {
      andConditions.push({ status: queries?.status });
    }

    if (queries?.date) {
      andConditions.push({ timeSlot: { slotDate: queries?.date } });
    }

    if (queries?.locationId) {
      andConditions.push({ locationId: queries?.locationId });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        AND: andConditions,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.appointment.count({
      where: { AND: andConditions },
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { appointments, meta };
  },

  appointment: async (
    _: any,
    args: { id: string },
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [
      ROLE.DOCTOR,
      ROLE.ADMIN,
      ROLE.SUPER_ADMIN,
    ]);

    if (!args.id) {
      throw new AppError(status.BAD_REQUEST, "Appointment ID is required.");
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: args.id },
      include: {
        doctor: true,
      },
    });

    if (
      appointment?.doctorId &&
      appointment?.doctor?.userId !== currentUser?.id
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        "You are not authorized to view this appointment.",
      );
    }

    return appointment;
  },
};

const relationalQuery = {
  Appointment: {
    patient: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.patient.findUnique({
        where: { id: parent.patientId },
      });
    },

    doctor: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.doctor.findUnique({
        where: { id: parent?.doctorId || "" },
      });
    },

    service: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.service.findUnique({
        where: { id: parent?.serviceId || "" },
      });
    },

    location: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.location.findUnique({
        where: { id: parent?.locationId || "" },
      });
    },

    timeSlot: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.timeSlot.findUnique({
        where: { id: (parent.slotId || parent.canceledSlotId) as string },
      });
    },

    payment: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.payment.findUnique({
        where: { appointmentId: parent.id },
      });
    },

    report: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.medicalReport.findUnique({
        where: { appointmentId: parent.id },
      });
    },

    review: async (parent: TAppointment, _: any, { prisma }: TContext) => {
      return await prisma.review.findUnique({
        where: { appointmentId: parent.id },
      });
    },
  },
};

const mutations = {
  createAppointment: async (
    _: any,
    args: TAppointmentCreateInput,
    { prisma }: TContext,
  ) => {
    //* Step 1: Validate the input data
    //* Step 2: Check if the user is in database by email and has the required role
    //* Step 3: if user exists then update user
    //* Step 4: if not then create new user where password is PhoneNumber
    //* Step 5: Check if the schedule is available
    //* Step 6: Check if the appointment time is within the schedule time
    //* Step 7: Check if the time slot is already booked
    //* Step 8: Check if the location is valid
    //* Step 9: Create appointment

    const parsedData = await Appointment.validations.create.parseAsync(
      args.input,
    );

    // Checking if user exists
    let user = await prisma.user.findUnique({
      where: { email: parsedData.user.email },
      select: { id: true, patient: { select: { id: true } } },
    });

    let token: string | null = null;

    const { patient, email, ...userData } = parsedData.user;

    // Create New User with PhoneNumber as Password
    if (!user) {
      const hashedPassword = await bcrypt.hash(
        parsedData.user.phoneNumber,
        Number(config.bcrypt_salt_rounds),
      );

      user = await prisma.user.create({
        data: {
          ...userData,
          email,
          password: hashedPassword,
          needPasswordChange: true,
          patient: {
            create: {
              ...patient,
            },
          },
        },
        select: { id: true, patient: { select: { id: true } } },
      });

      token = jwtHelpers.generateToken(
        {
          id: user.id,
          email: parsedData.user.email,
          role: ROLE.PATIENT,
        },
        config.jwt.jwt_access_token_secret as string,
        config.jwt.jwt_access_token_expires_in as string,
      );
    } else {
      // Update User if Already exists
      await prisma.user.update({
        where: { email: parsedData.user.email },
        data: {
          ...userData,
          patient: {
            update: {
              ...patient,
            },
          },
        },
      });
    }

    // Checking if Date is valid
    const date = moment(parsedData.appointment.timeSlot.slotDate, "DD-MM-YYYY");

    if (!date.isValid()) {
      throw new AppError(status.BAD_REQUEST, "Invalid Date.");
    }

    const weekName = date.format("dddd").toUpperCase();

    // Check if the schedule is available when doctor ID is Provided
    let schedule: Partial<
      TDoctorSchedule & { doctor: Partial<TDoctor> }
    > | null = null;

    if (parsedData.appointment?.doctorId) {
      schedule = await prisma.doctorSchedule.findUnique({
        where: {
          doctorId_day: {
            doctorId: parsedData.appointment.doctorId,
            day: weekName as DAY,
          },
        },
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
        throw new AppError(status.BAD_REQUEST, "Doctor is not available.");
      }
    }

    // Check if the service  is available when service ID is Provided
    let serviceSettings: Partial<TServiceSettings> | null = null;

    if (parsedData?.appointment?.serviceId) {
      serviceSettings = await prisma.serviceSettings.findFirst({
        where: { service: { id: parsedData.appointment?.serviceId } },
        select: {
          startTime: true,
          endTime: true,
          fee: true,
        },
      });

      if (!serviceSettings) {
        throw new AppError(status.NOT_FOUND, "Service Not available.");
      }
    }

    // Check if the appointment time is within the schedule time
    const timeFormat = "HH:mm";

    const appointmentStartTime = moment(
      parsedData?.appointment?.timeSlot?.startTime,
      timeFormat,
    );
    const appointmentEndTime = moment(
      parsedData?.appointment?.timeSlot?.endTime,
      timeFormat,
    );

    let scheduleStartTime: Moment;
    let scheduleEndTime: Moment;

    if (schedule) {
      scheduleStartTime = moment(schedule.startTime, timeFormat);
      scheduleEndTime = moment(schedule.endTime, timeFormat);
    }

    if (serviceSettings) {
      scheduleStartTime = moment(serviceSettings.startTime, timeFormat);
      scheduleEndTime = moment(serviceSettings.endTime, timeFormat);
    }

    if (
      appointmentStartTime.isBefore(scheduleStartTime!) ||
      appointmentEndTime.isAfter(scheduleEndTime!)
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        `Appointment time must be within ${scheduleStartTime!.format(
          "hh:mm A",
        )} and ${scheduleEndTime!.format("hh:mm A")}.`,
      );
    }

    // Check if the time slot is already booked
    const isTimeSlotExist = await prisma.timeSlot.findFirst({
      where: {
        slotDate: parsedData.appointment.timeSlot.slotDate,
        startTime: parsedData.appointment.timeSlot.startTime,
        OR: [
          {
            doctorId: schedule?.doctorId,
          },
          {
            serviceId: parsedData.appointment.serviceId,
            locationId: parsedData.appointment.locationId,
          },
        ],
      },
      select: {
        id: true,
        isBooked: true,
      },
    });

    if (isTimeSlotExist && isTimeSlotExist.isBooked) {
      throw new AppError(status.BAD_REQUEST, "Time slot is already booked.");
    }

    const { doctorId, timeSlot, ...appointmentData } = parsedData.appointment;

    // For dynamicly add doctor or service in appointment create data
    const appointmentType: { doctorId?: string; serviceId?: string } = {};

    if (parsedData.appointment.doctorId)
      appointmentType.doctorId = parsedData.appointment.doctorId;

    if (parsedData.appointment.serviceId)
      appointmentType.serviceId = parsedData.appointment.serviceId;

    // Check if location is valid
    const location = await prisma.location.findUnique({
      where: { id: parsedData.appointment.locationId },
      select: { id: true },
    });

    if (!location) {
      throw new AppError(status.NOT_FOUND, "Location is not valid.");
    }

    // Create appointment
    await prisma.$transaction(async (tx) => {
      let newTimeSlot: Partial<TimeSlot> | null = null;

      // Create new time slot if it doesn't exist
      if (!isTimeSlotExist) {
        newTimeSlot = await tx.timeSlot.create({
          data: {
            ...parsedData.appointment.timeSlot,
            ...appointmentType,
            day: weekName as DAY,
            locationId: location.id,
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
          ...appointmentType,
          patientId: user?.patient?.id as string,
          slotId: isTimeSlotExist
            ? isTimeSlotExist?.id
            : (newTimeSlot?.id as string),
          ...appointmentData,
          payment: {
            create: {
              amount: schedule?.doctor?.fee || (serviceSettings?.fee as number),
              status:
                schedule?.doctor?.fee === 0 || serviceSettings?.fee === 0
                  ? PAYMENT_STATUS.COMPLETED
                  : PAYMENT_STATUS.PENDING,
            },
          },
        },
      });
    });

    if (token) {
      return { success: true, token };
    }
    return { success: true };
  },

  updateAppointment: async (
    _: any,
    args: TAppointmentUpdateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser);

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
        patient: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new AppError(status.NOT_FOUND, "Appointment not found.");
    }

    if (
      parsedData.status &&
      appointment.status !== APPOINTMENT_STATUS.SCHEDULED
    ) {
      throw new AppError(status.FORBIDDEN, "Status can't be updated now.");
    }

    if (currentUser?.role === ROLE.PATIENT) {
      if (appointment?.patient.userId !== currentUser.id) {
        throw new AppError(
          status.BAD_REQUEST,
          "You are not authorized to update this appointment.",
        );
      }

      if (parsedData.notes) delete parsedData.notes;
      if (parsedData.status !== APPOINTMENT_STATUS.CANCELLED) {
        throw new AppError(
          status.BAD_REQUEST,
          "You are not authorized to update this status.",
        );
      }
    }

    // Check if the current user is the doctor of the appointment
    if (
      currentUser?.role === ROLE.DOCTOR &&
      currentUser?.id !== appointment?.doctor?.userId
    ) {
      throw new AppError(
        status.FORBIDDEN,
        "You are not authorized to update this appointment.",
      );
    }

    // If status is completed or no show, current time should be after the appointment time
    if (
      parsedData.status === APPOINTMENT_STATUS.COMPLETED ||
      parsedData.status === APPOINTMENT_STATUS.NO_SHOW
    ) {
      const appointmentDateTime = moment(
        `${appointment?.timeSlot?.slotDate} ${appointment?.timeSlot?.startTime}`,
        "DD-MM-YYYY HH:mm",
      );
      const currentDateTime = moment();

      if (currentDateTime.isBefore(appointmentDateTime)) {
        throw new AppError(
          status.BAD_REQUEST,
          "You can't update appointment status before appointment time.",
        );
      }
    }

    const { appointmentId, ...restData } = parsedData;
    const updateData: Prisma.AppointmentUpdateInput = restData;

    await prisma.$transaction(async (tx) => {
      // Make time slot available if the appointment is cancelled
      if (parsedData.status === APPOINTMENT_STATUS.CANCELLED) {
        await tx.timeSlot.update({
          where: { id: appointment?.slotId as string },
          data: { isBooked: false },
        });

        updateData.canceledSlotId = appointment?.slotId;
        updateData.timeSlot = {
          disconnect: true,
        };
      }

      await tx.appointment.update({
        where: { id: parsedData.appointmentId },
        data: updateData,
      });
    });

    return { success: true };
  },
};

export const resolvers = { queries, relationalQuery, mutations };
