export const typeDefs = `#graphql
    type Review {
        id: ID!
        patientId: String!
        appointmentId: String!
        rating: Int!
        comment: String!
        createdAt: String!

        # Relations
        doctor: Doctor
        patient: Patient!
        service: Service
        appointment: Appointment!
    }

    # Return Types
    type ReviewsResponse {
        meta: Meta!
        reviews: [Review!]!
    }
`;
