export const typeDefs = `#graphql
    type ServiceSettings {
        id: ID!
        startTime: String!
        endTime: String!
        duration: Int!
        createdAt: String!
        updatedAt: String!

        # Relations
        service: Service!
    }

    # Return Types

`;
