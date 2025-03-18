import { Doctor } from "./doctor";
import { Patient } from "./patient";
import { Specialty } from "./specialty";
import { User } from "./user";

export const resolvers = {
  Query: {
    ...User.resolvers.queries,
  },
  Mutation: {
    ...User.resolvers.mutations,
    ...Patient.resolvers.mutations,
    ...Doctor.resolvers.mutations,
    ...Specialty.resolvers.mutations,
  },
};
