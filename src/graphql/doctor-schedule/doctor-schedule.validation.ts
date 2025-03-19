import { DAY } from "@prisma/client";
import moment from "moment";
import { z } from "zod";

const day = z.enum(Object.values(DAY) as [DAY, ...DAY[]], {
  errorMap: () => ({
    message: "Invalid Day.",
  }),
});

const create = z
  .object({
    doctorId: z.string().min(1, { message: "Doctor ID is required." }),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "Start time must be in HH:MM format.",
    }),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, {
      message: "End time must be in HH:MM format.",
    }),
    day,
  })
  .refine(
    (data) => {
      const start = moment(data.startTime, "HH:mm");
      const end = moment(data.endTime, "HH:mm");
      return start.isBefore(end);
    },
    {
      message: "Start time must be before end time.",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const start = moment(data.startTime, "HH:mm");
      const end = moment(data.endTime, "HH:mm");
      return end.diff(start, "hours") >= 1;
    },
    {
      message:
        "There must be at least a 1-hour gap between start time and end time.",
      path: ["endTime"],
    }
  );

export const validations = { create };
