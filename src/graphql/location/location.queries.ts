export const queries = `#graphql
    getAllLocations(
        page: String
        limit: String
        searchTerm: String
        sortBy: String
        sortOrder: String
    ): LocationsResponse!

    location(id: String!): Location!
`;
