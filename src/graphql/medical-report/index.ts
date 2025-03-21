import { typeDefs } from "./medical-report.typedef";
import { queries } from "./medical-report.queries";
import { mutations } from "./medical-report.mutations";
import { resolvers } from "./medical-report.resolvers";
import { validations } from "./medical-report.validation";

export * from "./medical-report.type";

export const MedicalReport = {
  typeDefs,
  queries,
  mutations,
  resolvers,
  validations,
};
