import { typeDefs } from "./appointment.typedef";
import { queries } from "./appointment.queries";
import { mutations } from "./appointment.mutations";
import { resolvers } from "./appointment.resolvers";
import { validations } from "./appointment.validation";

export * from "./appointment.type";

export const Appointment = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
