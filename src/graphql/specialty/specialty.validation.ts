import { z } from "zod";

const create = z.object({
  name: z
    .string()
    .min(3, { message: "Specialty name must have min 3 chars." })
    .max(255),
  description: z.string().max(255).optional(),
  iconId: z.string().optional(),
});

const update = create.partial().extend({
  specialtyId: z.string().min(1, { message: "Specialty ID is required." }),
});

const remove = z.object({
  ids: z
    .array(z.string().nonempty({ message: "ID is required." }))
    .min(1, { message: "At least one ID is required." }),
});

export const validations = { create, update, remove };
