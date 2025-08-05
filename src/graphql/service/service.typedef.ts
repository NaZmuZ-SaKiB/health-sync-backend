export const typeDefs = `#graphql
    type Service {
        id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!

        # Relations
        icon: Image
        serviceSettings: ServiceSettings
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
