import { typeDefs } from "./time-slot.typedef";
import { queries } from "./time-slot.queries";
import { mutations } from "./time-slot.mutations";
import { resolvers } from "./time-slot.resolvers";
import { validations } from "./time-slot.validation";

export * from "./time-slot.type";

export const TimeSlot = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
