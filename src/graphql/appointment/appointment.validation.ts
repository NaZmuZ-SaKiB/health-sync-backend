import { APPOINTMENT_STATUS, BLOOD_GROUP, GENDER } from "@prisma/client";
import moment from "moment";
import { z } from "zod";

const yearFormat = "DD-MM-YYYY";
const timeFormat = "HH:mm";

const status = z.enum(
  Object.values(APPOINTMENT_STATUS) as [
    APPOINTMENT_STATUS,
    ...APPOINTMENT_STATUS[],
  ],
  {
    errorMap: () => ({
      message: "Invalid Appointment Status.",
    }),
  },
);

const gender = z.enum(Object.values(GENDER) as [GENDER, ...GENDER[]], {
  errorMap: () => ({
    message: "Invalid Gender.",
  }),
});

const bloodGroup = z.enum(
  Object.values(BLOOD_GROUP) as [BLOOD_GROUP, ...BLOOD_GROUP[]],
  {
    errorMap: () => ({ message: "Invalid blood group." }),
  },
);

const create = z.object({
  user: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    address: z.string().optional(),
    dateOfBirth: z.string().date("Invalid Date."),
    gender,

    patient: z.object({
      bloodGroup,
      allergies: z.string().optional(),
    }),
  }),

  appointment: z
    .object({
      doctorId: z.string().optional(),
      serviceId: z.string().optional(),
      locationId: z.string({ required_error: "Location is required." }),
      timeSlot: z
        .object({
          slotDate: z
            .string()
            .refine((date) => {
              const slot = moment(date, yearFormat, true);
              return slot.isValid();
            }, `Invalid Date Format. Use ${yearFormat}.`)
            .refine((date) => {
              const today = moment().startOf("day");
              const maxDate = moment().add(2, "days").endOf("day");
              const slot = moment(date, yearFormat, true);
              return slot.isBetween(today, maxDate, null, "[]");
            }, `Slot date must be today or within the next two days.`),
          startTime: z
            .string()
            .refine((time) => moment(time, timeFormat, true).isValid(), {
              message: "Start time must be in HH:mm format.",
            }),
          endTime: z
            .string()
            .refine((time) => moment(time, timeFormat, true).isValid(), {
              message: "End time must be in HH:mm format.",
            }),
        })
        .refine((slot) => {
          const slotDate = slot.slotDate;
          const selectedDateTime = moment(
            `${slotDate} ${slot.startTime}`,
            `${yearFormat} ${timeFormat}`,
            true,
          );
          return (
            !selectedDateTime.isSame(moment(), "day") ||
            selectedDateTime.isAfter(moment().add(30, "minutes"))
          );
        }, "Start time must be at least 30 minutes from now.")
        .refine(
          (data) => {
            const start = moment(data.startTime, timeFormat);
            const end = moment(data.endTime, timeFormat);
            return start.isBefore(end);
          },
          {
            message: "Start time must be before end time.",
            path: ["endTime"],
          },
        ),
      reason: z.string().optional(),
    })
    .refine((data) => !!data.doctorId !== !!data.serviceId, {
      path: ["doctorId"],
      message: "Either Doctor or Service is required for appointment.",
    }),
});

// const createold = z.object({
//   scheduleId: z.string().min(1, { message: "Schedule ID is required" }),
//   reason: z.string().optional(),
//   timeSlot: z
//     .object({
//       slotDate: z
//         .string()
//         .refine((date) => {
//           const slot = moment(date, yearFormat, true);
//           return slot.isValid();
//         }, `Invalid Date Format. Use ${yearFormat}.`)
//         .refine((date) => {
//           const today = moment().startOf("day");
//           const maxDate = moment().add(2, "days").endOf("day");
//           const slot = moment(date, yearFormat, true);
//           return slot.isBetween(today, maxDate, null, "[]");
//         }, `Slot date must be today or within the next two days.`),
//       startTime: z
//         .string()
//         .refine((time) => moment(time, timeFormat, true).isValid(), {
//           message: "Start time must be in HH:mm format.",
//         }),
//       endTime: z
//         .string()
//         .refine((time) => moment(time, timeFormat, true).isValid(), {
//           message: "End time must be in HH:mm format.",
//         }),
//     })
//     .refine((slot) => {
//       const slotDate = slot.slotDate;
//       const selectedDateTime = moment(
//         `${slotDate} ${slot.startTime}`,
//         `${yearFormat} ${timeFormat}`,
//         true
//       );
//       return (
//         !selectedDateTime.isSame(moment(), "day") ||
//         selectedDateTime.isAfter(moment().add(30, "minutes"))
//       );
//     }, "Start time must be at least 30 minutes from now.")
//     .refine(
//       (data) => {
//         const start = moment(data.startTime, timeFormat);
//         const end = moment(data.endTime, timeFormat);
//         return start.isBefore(end);
//       },
//       {
//         message: "Start time must be before end time.",
//         path: ["endTime"],
//       }
//     ),
// });

const update = z.object({
  appointmentId: z.string().min(1, { message: "Appointment ID is required" }),
  status: status.optional(),
  notes: z.string().optional(),
});

export const validations = { create, update };
