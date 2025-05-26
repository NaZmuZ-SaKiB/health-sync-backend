import { REPORT_TYPE } from "@prisma/client";
import { z } from "zod";

const reportType = z.enum(
  Object.values(REPORT_TYPE) as [REPORT_TYPE, ...REPORT_TYPE[]],
  {
    errorMap: () => ({
      message: "Invalid Report Type.",
    }),
  },
);

const create = z.object({
  patientId: z
    .string({ required_error: "Patient ID is required" })
    .min(1, { message: "Patient ID cannot be empty" }),
  appointmentId: z.string().optional(),
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title cannot be empty" }),
  reportType: reportType,
  reportDate: z.coerce.date().optional(),
  fileUrl: z
    .string()
    .url({ message: "File URL must be a valid URL" })
    .optional(),
  notes: z.string().optional(),
});

export const validations = { create };
