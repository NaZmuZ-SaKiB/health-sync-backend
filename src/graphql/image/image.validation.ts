import { z } from "zod";

const create = z.object({
  name: z
    .string({
      required_error: "Image name is required.",
      invalid_type_error: "Image name must be a string.",
    })
    .nonempty({ message: "Image name cannot be empty." }),

  publicId: z
    .string({
      required_error: "Public ID is required.",
      invalid_type_error: "Public ID must be a string.",
    })
    .nonempty({ message: "Public ID cannot be empty." }),

  height: z
    .number({
      required_error: "Image height is required.",
      invalid_type_error: "Height must be a number.",
    })
    .int({ message: "Height must be an integer." })
    .nonnegative({ message: "Height cannot be negative." }),

  width: z
    .number({
      required_error: "Image width is required.",
      invalid_type_error: "Width must be a number.",
    })
    .int({ message: "Width must be an integer." })
    .nonnegative({ message: "Width cannot be negative." }),

  format: z
    .string({
      required_error: "Image format is required.",
      invalid_type_error: "Format must be a string.",
    })
    .nonempty({ message: "Format cannot be empty." }),

  url: z
    .string({
      required_error: "Image URL is required.",
      invalid_type_error: "URL must be a string.",
    })
    .nonempty({ message: "URL cannot be empty." })
    .url({ message: "URL must be a valid URL." }),

  secureUrl: z
    .string({
      required_error: "Secure URL is required.",
      invalid_type_error: "Secure URL must be a string.",
    })
    .nonempty({ message: "Secure URL cannot be empty." })
    .url({ message: "Secure URL must be a valid URL." }),

  thumbnailUrl: z
    .string({
      required_error: "Thumbnail URL is required.",
      invalid_type_error: "Thumbnail URL must be a string.",
    })
    .nonempty({ message: "Thumbnail URL cannot be empty." })
    .url({ message: "Thumbnail URL must be a valid URL." }),
});

const update = create
  .pick({
    name: true,
  })
  .extend({
    imageId: z.string({
      required_error: "Image ID is required.",
      invalid_type_error: "Image ID must be a string.",
    }),
  });

export const validations = {
  create,
  update,
};
