import { z } from "zod";

const update = z.object({
  key: z
    .string({
      required_error: "Key is required",
    })
    .nonempty(),

  value: z
    .string({
      required_error: "Value is required",
    })
    .nonempty(),
});

const updateMany = z.array(update);

export const validations = {
  update,
  updateMany,
};
