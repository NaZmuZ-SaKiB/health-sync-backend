export const mutations = `#graphql
    createMedicalReport(
        patientId: String!
        appointmentId: String
        title: String!
        reportType: REPORT_TYPE
        reportDate: String
        fileUrl: String
        notes: String
    ): GenericSuccessResponse!
`;
