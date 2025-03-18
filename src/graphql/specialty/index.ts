import { typeDefs } from "./specialty.typedef";
import { queries } from "./specialty.queries";
import { mutations } from "./specialty.mutations";
import { resolvers } from "./specialty.resolvers";
import { validations } from "./specialty.validation";

export * from "./specialty.type";

export const Specialty = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
