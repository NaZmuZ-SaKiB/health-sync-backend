export const typeDefs = `#graphql
    type Doctor {
        id: ID!
        licenseNumber: String!
        bio: String
        qualification: String!
        verificationStatus: DOCTOR_VERIFICATION_STATUS!
        isVerified: Boolean!
        experienceYears: Int!
        fee: Int
        averageRating: Float!
        appliedDate: String!
        createdAt: String!
        updatedAt: String!

        # Relations
        user: User!
        specialty: Specialty!
        location: Location!
        schedules: [DoctorSchedule!]!
        timeSlots: [TimeSlot!]!
        appointments: [Appointment!]!
        reviews: [Review!]!
    }

    # Return Types
    type DoctorsResponse {
        meta: Meta!
        doctors: [Doctor!]!
    }

    # Inputs 
    input DoctorCreateInput {
        specialtyId: String!
        locationId: String!
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
        gender: GENDER!
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
        gender: GENDER
        profilePicture: String
        doctor: DoctorUpdateInput
    }
`;
