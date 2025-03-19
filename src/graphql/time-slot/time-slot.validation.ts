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
    day,
    slotDate: z.coerce.date(),
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
  .refine(
    (data) => {
      const start = moment(data.startTime, timeFormat);
      const end = moment(data.endTime, timeFormat);
      return start.isBefore(end);
    },
    {
      message: "Start time must be earlier than end time.",
      path: ["startTime"],
    }
  );

export const validations = { create };
