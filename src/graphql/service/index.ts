import { typeDefs } from "./service.typedef";
import { queries } from "./service.queries";
import { mutations } from "./service.mutations";
import { resolvers } from "./service.resolvers";
import { validations } from "./service.validation";

export * from "./service.type";

export const Service = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
