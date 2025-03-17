export const typeDefs = `#graphql
    type Doctor {
        id: ID!
        user: User!
        # specialty: Specialty!
        licenseNumber: String!
        bio: String
        qualification: String!
        isVerified: Boolean!
        experienceYears: Int!
        fee: Int
        createdAt: DateTime!
        updatedAt: DateTime!

        # Relations
        # schedules: [DoctorSchedule!]!
        # timeSlots: [TimeSlot!]!
        # appointments: [Appointment!]!
        # reviews: [Review!]!
        # averageRating: Float!
    }
`;
