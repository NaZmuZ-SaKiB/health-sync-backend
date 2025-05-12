export const queries = `#graphql
    getAllServices(
        page: String
        limit: String
        searchTerm: String
        sortBy: String
        sortOrder: String
    ): ServicesResponse!

    service(id: String!): Service!
`;
