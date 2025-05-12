import { Appointment } from "./appointment";
import { Doctor } from "./doctor";
import { DoctorSchedule } from "./doctor-schedule";
import { MedicalReport } from "./medical-report";
import { Notification } from "./notification";
import { Patient } from "./patient";
import { Payment } from "./payment";
import { Review } from "./review";
import { Specialty } from "./specialty";
import { TimeSlot } from "./time-slot";
import { User } from "./user";
import { enumTypedef } from "./enum";
import { Location } from "./location";
import { Image } from "./image";
import { Service } from "./service";

export const typeDefs = `#graphql
  ${User.typeDefs}
  ${Patient.typeDefs}
  ${Doctor.typeDefs}
  ${Specialty.typeDefs}
  ${DoctorSchedule.typeDefs}
  ${Service.typeDefs}
  ${TimeSlot.typeDefs}
  ${Appointment.typeDefs}
  ${Payment.typeDefs}
  ${MedicalReport.typeDefs}
  ${Location.typeDefs}
  ${Image.typeDefs}
  ${Notification.typeDefs}
  ${Review.typeDefs}
  ${enumTypedef}

  type GenericSuccessResponse {
    success: Boolean!
  }

  type Meta {
    page: Int!
    limit: Int!
    total: Int!
  }

  type Query {
    ${User.queries}
    ${Doctor.queries}
    ${Specialty.queries}
    ${DoctorSchedule.queries}
    ${TimeSlot.queries}
    ${Appointment.queries}
    ${Location.queries}
    ${Image.queries}
  }

  type Mutation {
    ${User.mutations}
    ${Patient.mutations}
    ${Doctor.mutations}
    ${Specialty.mutations}
    ${DoctorSchedule.mutations}
    ${Service.mutations}
    ${TimeSlot.mutations}
    ${Appointment.mutations}
    ${Payment.mutations}
    ${MedicalReport.mutations}
    ${Location.mutations}
    ${Image.mutations}
    ${Notification.mutations}
    ${Review.mutations}
  }
`;
