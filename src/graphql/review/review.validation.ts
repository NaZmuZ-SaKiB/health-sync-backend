import { z } from "zod";

const create = z.object({
  appointmentId: z
    .string({ required_error: "Appointment ID is required" })
    .min(1, "Appointment ID cannot be empty"),

  rating: z
    .number({ required_error: "Rating is required" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),

  comment: z
    .string({ required_error: "Comment is required" })
    .min(1, "Comment cannot be empty"),
});

export const validations = { create };
