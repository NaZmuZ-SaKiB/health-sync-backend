export const queries = `#graphql
  getAllPatients(
    page: String
    limit: String
    searchTerm: String
    sortBy: String
    sortOrder: String
    gender: String
    bloodGroup: String
  ): PatientsResponse!

  patient(id: String!): Patient!
`;
