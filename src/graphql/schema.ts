import { Appointment } from "./appointment";
import { Doctor } from "./doctor";
import { DoctorSchedule } from "./doctor-schedule";
import { MedicalReport } from "./medical-report";
import { Notification } from "./notification";
import { Patient } from "./patient";
import { Payment } from "./payment";
import { Specialty } from "./specialty";
import { TimeSlot } from "./time-slot";
import { User } from "./user";

export const typeDefs = `#graphql
  ${User.typeDefs}
  ${Patient.typeDefs}
  ${Doctor.typeDefs}
  ${Specialty.typeDefs}
  ${DoctorSchedule.typeDefs}
  ${TimeSlot.typeDefs}
  ${Appointment.typeDefs}
  ${Payment.typeDefs}
  ${MedicalReport.typeDefs}
  ${Notification.typeDefs}

  type GenericSuccessResponse {
    success: Boolean!
  }

  type Query {
    ${User.queries}
  }

  type Mutation {
    ${User.mutations}
    ${Patient.mutations}
    ${Doctor.mutations}
    ${Specialty.mutations}
    ${DoctorSchedule.mutations}
    ${TimeSlot.mutations}
    ${Appointment.mutations}
    ${Payment.mutations}
    ${MedicalReport.mutations}
    ${Notification.mutations}
  }
`;
