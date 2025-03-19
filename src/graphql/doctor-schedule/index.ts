import { typeDefs } from "./doctor-schedule.typedef";
import { queries } from "./doctor-schedule.queries";
import { mutations } from "./doctor-schedule.mutations";
import { resolvers } from "./doctor-schedule.resolvers";
import { validations } from "./doctor-schedule.validation";

export * from "./doctor-schedule.type";

export const DoctorSchedule = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
