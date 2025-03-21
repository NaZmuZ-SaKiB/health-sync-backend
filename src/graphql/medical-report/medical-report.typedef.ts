export const typeDefs = `#graphql
    type MedicalReport {
        id: ID!
        patient: Patient!
        appointment: Appointment
        title: String!
        reportType: REPORT_TYPE!
        reportDate: String!
        fileUrl: String
        notes: String
        createdAt: String!
        updatedAt: String!
    }

    enum REPORT_TYPE {
        LAB_REPORT
        PRESCRIPTION
        DIAGNOSIS
    }
`;
