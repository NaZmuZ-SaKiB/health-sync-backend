import { BLOOD_GROUP, GENDER } from "@prisma/client";
import { z } from "zod";

const gender = z.enum(Object.values(GENDER) as [GENDER, ...GENDER[]], {
  errorMap: () => ({
    message: "Invalid Gender.",
  }),
});

const bloodGroup = z.enum(
  Object.values(BLOOD_GROUP) as [BLOOD_GROUP, ...BLOOD_GROUP[]],
  {
    errorMap: () => ({ message: "Invalid blood group." }),
  }
);

const update = z.object({
  firstName: z
    .string()
    .max(50, "First name must be less than 50 characters.")
    .optional(),
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters.")
    .optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: gender.optional(),
  patient: z
    .object({
      emergencyContactName: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      bloodGroup: bloodGroup.optional(),
      allergies: z.string().optional(),
    })
    .optional(),
});

export const validations = {
  update,
};
