import { typeDefs } from "./user.typedef";
import { queries } from "./user.queries";
import { mutations } from "./user.mutations";
import { resolvers } from "./user.resolvers";
import { validations } from "./user.validation";

export * from "./user.type";

export const User = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
