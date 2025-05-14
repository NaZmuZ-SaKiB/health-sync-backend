import { typeDefs } from "./service-settings.typedef";
import { queries } from "./service-settings.queries";
import { mutations } from "./service-settings.mutations";
import { resolvers } from "./service-settings.resolvers";
import { validations } from "./service-settings.validation";

export * from "./service-settings.type";

export const ServiceSettings = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
