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

const update = z.object({
  serviceId: z.string({ required_error: "Service Id Required." }),
  name: z.string().max(255).optional(),
  description: z.string().max(255).optional(),
  icon: z
    .string()
    .nonempty()
    .url({ message: "Invalid URL for icon." })
    .optional(),
});

const remove = z.object({
  ids: z
    .array(z.string().nonempty({ message: "ID is required." }))
    .min(1, { message: "At least one ID is required." }),
});

export const validations = { create, update, remove };
