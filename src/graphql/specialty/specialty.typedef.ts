export const typeDefs = `#graphql
    type Specialty {
        id: ID!
        name: String!
        description: String
        icon: String
        createdAt: String
        updatedAt: String

        # Relations
        doctors: [Doctor!]!
    }
`;
