import { Appointment } from "./appointment";
import { Doctor } from "./doctor";
import { DoctorSchedule } from "./doctor-schedule";
import { Image } from "./image";
import { Location } from "./location";
import { MedicalReport } from "./medical-report";
import { Notification } from "./notification";
import { Patient } from "./patient";
import { Payment } from "./payment";
import { Review } from "./review";
import { Service } from "./service";
import { ServiceSettings } from "./service-settings";
import { Setting } from "./setting";
import { Specialty } from "./specialty";
import { TimeSlot } from "./time-slot";
import { User } from "./user";

export const resolvers = {
  Query: {
    ...User.resolvers.queries,
    ...Patient.resolvers.queries,
    ...Doctor.resolvers.queries,
    ...Specialty.resolvers.queries,
    ...DoctorSchedule.resolvers.queries,
    ...Service.resolvers.queries,
    ...ServiceSettings.resolvers.queries,
    ...TimeSlot.resolvers.queries,
    ...Appointment.resolvers.queries,
    ...Payment.resolvers.queries,
    ...MedicalReport.resolvers.queries,
    ...Location.resolvers.queries,
    ...Image.resolvers.queries,
    ...Review.resolvers.queries,
    ...Setting.resolvers.queries,
  },
  Mutation: {
    ...User.resolvers.mutations,
    ...Patient.resolvers.mutations,
    ...Doctor.resolvers.mutations,
    ...Specialty.resolvers.mutations,
    ...DoctorSchedule.resolvers.mutations,
    ...Service.resolvers.mutations,
    ...ServiceSettings.resolvers.mutations,
    ...TimeSlot.resolvers.mutations,
    ...Appointment.resolvers.mutations,
    ...Payment.resolvers.mutations,
    ...MedicalReport.resolvers.mutations,
    ...Location.resolvers.mutations,
    ...Image.resolvers.mutations,
    ...Notification.resolvers.mutations,
    ...Review.resolvers.mutations,
    ...Setting.resolvers.mutations,
  },
  // Relational Queries
  ...User.resolvers.relationalQuery,
  ...Patient.resolvers.relationalQuery,
  ...Doctor.resolvers.relationalQuery,
  ...Specialty.resolvers.relationalQuery,
  ...Service.resolvers.relationalQuery,
  ...Appointment.resolvers.relationalQuery,
  ...Payment.resolvers.relationalQuery,
  ...MedicalReport.resolvers.relationalQuery,
  ...Location.resolvers.relationalQuery,
  ...Review.resolvers.relationalQuery,
};
