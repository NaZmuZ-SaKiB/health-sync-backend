import moment from "moment";
import { z } from "zod";

const timeFormat = "HH:mm";

const update = z
  .object({
    serviceId: z
      .string({ required_error: "Service Id is required." })
      .nonempty("Service Id is required."),
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
      message: "Start time must be before end time.",
      path: ["endTime"],
    },
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
    },
  );

export const validations = { update };
