import { z } from "zod";

const create = z.object({
  name: z.string().nonempty("Name is required"),
  mapUrl: z.string().url("Invalid URL format for mapUrl"),
  address: z.string().nonempty("Address is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

const update = create.partial().extend({
  locationId: z.string().min(1, { message: "Location ID is required." }),
});

const remove = z.object({
  ids: z
    .array(z.string().nonempty({ message: "ID is required." }))
    .min(1, { message: "At least one ID is required." }),
});

export const validations = { create, update, remove };
