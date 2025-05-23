export const typeDefs = `#graphql
    type Location {
        id: ID!
        name: String!
        mapUrl: String!
        address: String!
        phoneNumber: String!
        description: String
        image: String
        createdAt: String!
        updatedAt: String!

        # Relations
        doctors: [Doctor!]!
        appointments: [Appointment]
    }

    # Return Types
    type LocationsResponse {
        locations: [Location!]!
        meta: Meta!
    }
`;
