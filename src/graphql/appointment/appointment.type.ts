import { APPOINTMENT_STATUS, BLOOD_GROUP, GENDER } from "@prisma/client";

export type TAppointmentCreateInput = {
  input: {
    user: {
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address?: string;
      dateOfBirth: string;
      gender: GENDER;

      patient: {
        bloodGroup: BLOOD_GROUP;
        allergies?: string;
      };
    };

    appointment: {
      doctorId: string;
      timeSlot: {
        slotDate: string;
        startTime: string;
        endTime: string;
      };
      reason?: string;
    };
  };
};

export type TAppointmentUpdateInput = {
  appointmentId: string;
  status?: APPOINTMENT_STATUS;
  notes?: string;
};
