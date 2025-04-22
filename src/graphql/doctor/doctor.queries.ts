export const queries = `#graphql
    getAllDoctors(
        page: String
        limit: String
        searchTerm: String
        sortBy: String
        sortOrder: String
        gender: String
        specialty: String
        location: String
        isVerified: String
        isDeleted: String
    ):DoctorsResponse!

    doctor(id: String!): Doctor!
`;
