import { typeDefs } from "./setting.typedef";
import { queries } from "./setting.queries";
import { mutations } from "./setting.mutations";
import { resolvers } from "./setting.resolvers";
import { validations } from "./setting.validation";

export * from "./setting.type";

export const Setting = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
