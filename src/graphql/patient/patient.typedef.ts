export const typeDefs = `#graphql
    type Patient {
        id: ID!
        user: User!
        emergencyContactName: String
        emergencyContactPhone: String
        bloodGroup: BloodGroup!
        allergies: String
        createdAt: DateTime!
        updatedAt: DateTime!
        
        # Relations
        appointments: [Appointment!]!
        medicalReports: [MedicalReport!]!
}
`;
