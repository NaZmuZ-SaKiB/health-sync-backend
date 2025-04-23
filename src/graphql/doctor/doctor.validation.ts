import { DOCTOR_VERIFICATION_STATUS, GENDER } from "@prisma/client";
import { z } from "zod";

const gender = z.enum(Object.values(GENDER) as [GENDER, ...GENDER[]], {
  errorMap: () => ({
    message: "Invalid Gender.",
  }),
});

const verificationStatus = z.enum(
  Object.values(DOCTOR_VERIFICATION_STATUS) as [
    DOCTOR_VERIFICATION_STATUS,
    ...DOCTOR_VERIFICATION_STATUS[]
  ]
);

const create = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format." })
    .nonempty({ message: "Email is required." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." }),
  dateOfBirth: z.string().date("Invalid Date Format."),
  gender,
  profilePicture: z.string().optional(),
  doctor: z.object({
    specialtyId: z.string().min(1, { message: "Specialty ID is required." }),
    locationId: z.string().min(1, { message: "Location ID is required." }),
    licenseNumber: z
      .string()
      .min(1, { message: "License number is required." }),
    bio: z.string().optional(),
    qualification: z.string().min(3, {
      message: "Qualification must be at least 3 characters long.",
    }),
    experienceYears: z
      .number()
      .min(0, { message: "Experience years must be a positive number." }),
    fee: z
      .number()
      .min(0, { message: "Fee must be a non-negative number." })
      .optional(),
  }),
});

const update = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required." })
    .optional(),
  lastName: z.string().min(1, { message: "Last name is required." }).optional(),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .optional(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." })
    .optional(),
  dateOfBirth: z.string().date("Invalid date format.").optional(),
  gender: gender.optional(),
  profilePicture: z.string().optional(),
  doctor: z
    .object({
      locationId: z.string().nonempty().optional(),
      licenseNumber: z
        .string()
        .min(1, { message: "License number is required." })
        .optional(),
      bio: z.string().optional(),
      qualification: z
        .string()
        .min(3, {
          message: "Qualification must be at least 3 characters long.",
        })
        .optional(),
      experienceYears: z
        .number()
        .min(0, { message: "Experience years must be a positive number." })
        .optional(),
      fee: z
        .number()
        .min(0, { message: "Fee must be a non-negative number." })
        .optional(),
    })
    .optional(),
});

const verify = z.object({
  doctorId: z.string().nonempty({ message: "Doctor ID is required." }),
  status: verificationStatus,
});

const remove = z.object({
  ids: z
    .array(z.string().nonempty({ message: "ID is required." }))
    .min(1, { message: "At least one ID is required." }),
});

export const validations = { create, update, verify, remove };
