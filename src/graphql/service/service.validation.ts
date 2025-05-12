import { z } from "zod";

const create = z.object({
  name: z
    .string()
    .min(3, { message: "Service name must have min 3 chars." })
    .max(255),
  description: z.string().max(255).optional(),
  icon: z
    .string()
    .nonempty()
    .url({ message: "Invalid URL for icon." })
    .optional(),
});

export const validations = { create };
