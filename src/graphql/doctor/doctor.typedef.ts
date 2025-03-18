export const typeDefs = `#graphql
    type Doctor {
        id: ID!
        user: User!
        specialty: Specialty!
        licenseNumber: String!
        bio: String
        qualification: String!
        isVerified: Boolean!
        experienceYears: Int!
        fee: Int
        createdAt: String!
        updatedAt: String!

        # Relations
        # schedules: [DoctorSchedule!]!
        # timeSlots: [TimeSlot!]!
        # appointments: [Appointment!]!
        # reviews: [Review!]!
        # averageRating: Float!
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
