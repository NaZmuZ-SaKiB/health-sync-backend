import { DAY } from "@prisma/client";

export type TTimeSlotCreateInput = {
  doctorId: string;
  day: DAY;
  slotDate: Date;
  startTime: string;
  endTime: string;
};
