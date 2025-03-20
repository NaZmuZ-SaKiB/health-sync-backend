import { typeDefs } from "./payment.typedef";
import { queries } from "./payment.queries";
import { mutations } from "./payment.mutations";
import { resolvers } from "./payment.resolvers";
import { validations } from "./payment.validation";

export * from "./payment.type";

export const Payment = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
