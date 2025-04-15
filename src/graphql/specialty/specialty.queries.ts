export const queries = `#graphql
    getAllSpecialties(
        page: String
        limit: String
        searchTerm: String
        sortBy: String
        sortOrder: String
    ): SpecialtiesResponse!
`;
