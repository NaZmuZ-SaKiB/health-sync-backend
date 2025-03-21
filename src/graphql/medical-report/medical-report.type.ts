import { REPORT_TYPE } from "@prisma/client";

export type TMedicalReportCreateInput = {
  patientId: string;
  appointmentId?: string;
  title: string;
  reportType: REPORT_TYPE;
  reportDate?: string;
  fileUrl?: string;
  notes?: string;
};
