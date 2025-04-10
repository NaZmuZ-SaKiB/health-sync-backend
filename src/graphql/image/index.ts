import { typeDefs } from "./image.typedef";
import { queries } from "./image.queries";
import { mutations } from "./image.mutations";
import { resolvers } from "./image.resolvers";
import { validations } from "./image.validation";

export * from "./image.type";

export const Image = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
