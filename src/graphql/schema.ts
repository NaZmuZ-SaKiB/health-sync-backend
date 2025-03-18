import { Doctor } from "./doctor";
import { Patient } from "./patient";
import { Specialty } from "./specialty";
import { User } from "./user";

export const typeDefs = `#graphql
  ${User.typeDefs}
  ${Patient.typeDefs}
  ${Doctor.typeDefs}
  ${Specialty.typeDefs}

  type GenericSuccessResponse {
    success: Boolean!
  }

  type Query {
    ${User.queries}
  }

  type Mutation {
    ${User.mutations}
    ${Patient.mutations}
    ${Doctor.mutations}
    ${Specialty.mutations}
  }
`;
