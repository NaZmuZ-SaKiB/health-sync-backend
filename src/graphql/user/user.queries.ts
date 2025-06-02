export const queries = `#graphql
    me: User!
    userById(id: String!): User!
    getAllAdmins(
      page: String
      limit: String
      searchTerm: String
      sortBy: String
      sortOrder: String
      gender: String
    ): UsersResponse!
`;
