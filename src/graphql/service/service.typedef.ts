export const typeDefs = `#graphql
    type Service {
        id: ID!
        name: String!
        description: String
        icon: String
        createdAt: String!
        updatedAt: String!

        # Relations
        timeSlots: [TimeSlot!]!
        appointments: [Appointment!]!
        reviews: [Review!]!
    }

    # Return Types
    type ServicesResponse {
        services: [Service!]!
        meta: Meta!
    }
`;
