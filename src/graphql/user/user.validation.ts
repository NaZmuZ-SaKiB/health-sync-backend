import * as z from "zod";

const create = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .max(255, { message: "Email must be less than 255 characters" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password must be less than 64 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*()]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the TypeScript type from the Zod schema
export const validations = {
  create,
};
