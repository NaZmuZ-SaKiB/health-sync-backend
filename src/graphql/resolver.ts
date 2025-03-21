import { Appointment } from "./appointment";
import { Doctor } from "./doctor";
import { DoctorSchedule } from "./doctor-schedule";
import { MedicalReport } from "./medical-report";
import { Patient } from "./patient";
import { Payment } from "./payment";
import { Specialty } from "./specialty";
import { TimeSlot } from "./time-slot";
import { User } from "./user";

export const resolvers = {
  Query: {
    ...User.resolvers.queries,
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
  },
};
