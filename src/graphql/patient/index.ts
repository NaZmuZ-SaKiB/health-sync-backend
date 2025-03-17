import { typeDefs } from "./patient.typedef";
import { queries } from "./patient.queries";
import { mutations } from "./patient.mutations";
import { resolvers } from "./patient.resolvers";
import { validations } from "./patient.validation";

export * from "./patient.type";

export const Patient = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
