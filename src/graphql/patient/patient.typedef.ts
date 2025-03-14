export const typeDefs = `#graphql
    type Patient {
        id: ID!
        user: User!
        emergencyContactName: String
        emergencyContactPhone: String
        bloodGroup: BloodGroup!
        allergies: String
        
        # Relations
        appointments: [Appointment!]!
        medicalReports: [MedicalReport!]!
}
`;
