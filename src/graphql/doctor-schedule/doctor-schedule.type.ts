import { DAY } from "@prisma/client";

export type TDoctorScheduleCreateInput = {
  doctorId: string;
  startTime: string;
  endTime: string;
  day: DAY;
};

export type TDoctorScheduleUpdateInput = {
  input: {
    ids: string[];
    data: {
      sessionLength?: number;
      startTime?: string;
      endTime?: string;
      isAvailable?: boolean;
    };
  };
};
