export const typeDefs = `#graphql
    type Patient {
        id: ID!
        emergencyContactName: String
        emergencyContactPhone: String
        bloodGroup: BLOOD_GROUP
        allergies: String
        createdAt: String!
        updatedAt: String!
        
        # Relations
        user: User!
        appointments: [Appointment!]!
        medicalReports: [MedicalReport!]!
    }

    input PatientUpdateInput {
        emergencyContactName: String
        emergencyContactPhone: String
        bloodGroup: BLOOD_GROUP
        allergies: String
    }

    input UserPatientUpdateInput {
        firstName: String
        lastName: String
        phoneNumber: String
        address: String
        dateOfBirth: String
        gender: GENDER
        patient: PatientUpdateInput
    }
`;
