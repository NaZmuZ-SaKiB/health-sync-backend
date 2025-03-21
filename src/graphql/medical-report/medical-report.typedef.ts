export const typeDefs = `#graphql
    type MedicalReport {
        id: ID!
        title: String!
        reportType: REPORT_TYPE!
        reportDate: String!
        fileUrl: String
        notes: String
        createdAt: String!
        updatedAt: String!

        # Relations
        patient: Patient!
        appointment: Appointment
    }
`;
