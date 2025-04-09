import { GENDER } from "@prisma/client";

export type TDoctorCreateInput = {
  input: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    gender: GENDER;
    profilePicture?: string;
    doctor: {
      specialtyId: string;
      locationId: string;
      licenseNumber: string;
      bio?: string;
      qualification: string;
      experienceYears: number;
      fee?: number;
    };
  };
};

export type TDoctorUpdateInput = {
  input: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: Date;
    gender?: GENDER;
    profilePicture?: string;
    doctor: {
      licenseNumber?: string;
      bio?: string;
      qualification?: string;
      experienceYears?: number;
      fee?: number;
    };
  };
};
