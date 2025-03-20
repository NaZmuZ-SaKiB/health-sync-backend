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
