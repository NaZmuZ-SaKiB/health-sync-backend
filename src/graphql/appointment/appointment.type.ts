import { APPOINTMENT_STATUS } from "@prisma/client";

export type TAppointmentCreateInput = {
  input: {
    scheduleId: string;
    reason?: string;
    timeSlot: {
      slotDate: string;
      startTime: string;
      endTime: string;
    };
  };
};

export type TAppointmentUpdateInput = {
  appointmentId: string;
  status?: APPOINTMENT_STATUS;
  notes?: string;
};
