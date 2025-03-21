import { typeDefs } from "./review.typedef";
import { queries } from "./review.queries";
import { mutations } from "./review.mutations";
import { resolvers } from "./review.resolvers";
import { validations } from "./review.validation";

export * from "./review.type";

export const Review = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
