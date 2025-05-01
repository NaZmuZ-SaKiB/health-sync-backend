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
    doctor: {
      licenseNumber?: string;
      bio?: string;
      qualification?: string;
      experienceYears?: number;
      fee?: number;
      verificationStatus?: string;
      locationId?: string;
    };
  };
};
