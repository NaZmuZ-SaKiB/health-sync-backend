import moment from "moment";
import { z } from "zod";

const yearFormat = "DD-MM-YYYY";
const timeFormat = "HH:mm";

const create = z.object({
  scheduleId: z.string().min(1, { message: "Schedule ID is required" }),
  reason: z.string().optional(),
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
        true
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
      }
    ),
});

export const validations = { create };
