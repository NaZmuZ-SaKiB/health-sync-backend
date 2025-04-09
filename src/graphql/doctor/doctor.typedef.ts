export const typeDefs = `#graphql
    type Doctor {
        id: ID!
        licenseNumber: String!
        bio: String
        qualification: String!
        isVerified: Boolean!
        experienceYears: Int!
        fee: Int
        averageRating: Float!
        createdAt: String!
        updatedAt: String!

        # Relations
        user: User!
        specialty: Specialty!
        Location: Location!
        schedules: [DoctorSchedule!]!
        timeSlots: [TimeSlot!]!
        appointments: [Appointment!]!
        reviews: [Review!]!
    }

    input DoctorCreateInput {
        specialtyId: String!
        licenseNumber: String!
        bio: String
        qualification: String!
        experienceYears: Int!
        fee: Int
    }

    input UserDoctorCreateInput {
        email: String!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        address: String!
        dateOfBirth: String!
        gender: Gender!
        profilePicture: String
        doctor: DoctorCreateInput!
    }

    input DoctorUpdateInput {
        licenseNumber: String
        bio: String
        qualification: String
        experienceYears: Int
        fee: Int
    }
    
    input UserDoctorUpdateInput {
        firstName: String
        lastName: String
        phoneNumber: String
        address: String
        dateOfBirth: String
        gender: Gender
        profilePicture: String
        doctor: DoctorUpdateInput
    }
`;
