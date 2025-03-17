export const typeDefs = `#graphql
    type Patient {
        id: ID!
        user: User!
        emergencyContactName: String
        emergencyContactPhone: String
        bloodGroup: BloodGroup!
        allergies: String
        createdAt: String!
        updatedAt: String!
        
        # Relations
        # appointments: [Appointment!]!
        # medicalReports: [MedicalReport!]!
    }

    enum BloodGroup {
        A_POSITIVE
        A_NEGATIVE
        B_POSITIVE
        B_NEGATIVE
        O_POSITIVE
        O_NEGATIVE
        AB_POSITIVE
        AB_NEGATIVE
    }

    input PatientUpdateInput {
        emergencyContactName: String
        emergencyContactPhone: String
        bloodGroup: BloodGroup
        allergies: String
    }

    input UserPatientUpdateInput {
        firstName: String
        lastName: String
        phoneNumber: String
        address: String
        dateOfBirth: String
        gender: Gender
        profilePicture: String
        patient: PatientUpdateInput
    }
`;
