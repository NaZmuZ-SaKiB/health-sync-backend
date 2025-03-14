import { Patient } from "./patient";
import { User } from "./user";

export const typeDefs = `#graphql
  ${User.typeDefs}
  ${Patient.typeDefs}

  type Query {
    ${User.queries}
  }
`;
