import { DAY } from "@prisma/client";
import moment from "moment";
import { z } from "zod";

const timeFormat = "HH:mm";

const day = z.enum(Object.values(DAY) as [DAY, ...DAY[]], {
  errorMap: () => ({
    message: "Invalid Day.",
  }),
});

const create = z
  .object({
    doctorId: z.string().min(1, { message: "Doctor ID is required." }),
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
    day,
  })
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
  )
  .refine(
    (data) => {
      const start = moment(data.startTime, timeFormat);
      const end = moment(data.endTime, timeFormat);
      return end.diff(start, "hours") >= 1;
    },
    {
      message:
        "There must be at least a 1-hour gap between start time and end time.",
      path: ["endTime"],
    }
  );

const update = z
  .object({
    scheduleId: z.string().min(1, { message: "Schedule ID is required." }), // Required
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, {
        message: "Start time must be in HH:MM format.",
      })
      .optional(),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, { message: "End time must be in HH:MM format." })
      .optional(),
    isAvailable: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If startTime is provided, endTime must also be provided
      if (data.startTime && !data.endTime) {
        return false;
      }
      return true;
    },
    {
      message: "End time is required when start time is provided.",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      // If endTime is provided, startTime must also be provided
      if (data.endTime && !data.startTime) {
        return false;
      }
      return true;
    },
    {
      message: "Start time is required when end time is provided.",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = moment(data.startTime, timeFormat);
        const end = moment(data.endTime, timeFormat);

        if (!start.isBefore(end)) {
          return false;
        }

        if (end.diff(start, "hours") < 1) {
          return false;
        }
      }
      return true;
    },
    {
      message: "End time must be at least 1 hour after start time.",
      path: ["endTime"],
    }
  );

export const validations = { create, update };
