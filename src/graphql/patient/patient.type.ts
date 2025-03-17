import { BLOOD_GROUP, GENDER } from "@prisma/client";

export type TPatientUpdateInput = {
  input: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: GENDER;
    profilePicture?: string;
    patient?: {
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      bloodGroup?: BLOOD_GROUP;
      allergies?: string;
    };
  };
};
