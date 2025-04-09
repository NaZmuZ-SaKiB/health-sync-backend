import { typeDefs } from "./location.typedef";
import { queries } from "./location.queries";
import { mutations } from "./location.mutations";
import { resolvers } from "./location.resolvers";
import { validations } from "./location.validation";

export * from "./location.type";

export const Location = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
