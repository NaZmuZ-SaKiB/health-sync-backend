import { typeDefs } from "./doctor.typedef";
import { queries } from "./doctor.queries";
import { mutations } from "./doctor.mutations";
import { resolvers } from "./doctor.resolvers";
import { validations } from "./doctor.validation";

export * from "./doctor.type";

export const Doctor = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
