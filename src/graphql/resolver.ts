import { Patient } from "./patient";
import { User } from "./user";

export const resolvers = {
  Query: {
    ...User.resolvers.queries,
  },
  Mutation: {
    ...User.resolvers.mutations,
    ...Patient.resolvers.mutations,
  },
};
