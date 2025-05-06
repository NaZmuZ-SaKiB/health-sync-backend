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
import { Specialty } from "./specialty";
import { TimeSlot } from "./time-slot";
import { User } from "./user";

export const resolvers = {
  Query: {
    ...User.resolvers.queries,
    ...Doctor.resolvers.queries,
    ...Specialty.resolvers.queries,
    ...DoctorSchedule.resolvers.queries,
    ...TimeSlot.resolvers.queries,
    ...Appointment.resolvers.queries,
    ...Location.resolvers.queries,
    ...Image.resolvers.queries,
  },
  Mutation: {
    ...User.resolvers.mutations,
    ...Patient.resolvers.mutations,
    ...Doctor.resolvers.mutations,
    ...Specialty.resolvers.mutations,
    ...DoctorSchedule.resolvers.mutations,
    ...TimeSlot.resolvers.mutations,
    ...Appointment.resolvers.mutations,
    ...Payment.resolvers.mutations,
    ...MedicalReport.resolvers.mutations,
    ...Location.resolvers.mutations,
    ...Image.resolvers.mutations,
    ...Notification.resolvers.mutations,
    ...Review.resolvers.mutations,
  },
  ...User.resolvers.relationalQuery,
  ...Doctor.resolvers.relationalQuery,
  ...Appointment.resolvers.relationalQuery,
};
