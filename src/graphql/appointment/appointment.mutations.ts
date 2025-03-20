export const mutations = `#graphql
    createAppointment(input: AppointmentCreateInput!): GenericSuccessResponse!

    updateAppointment(
        appointmentId: String!
        status: APPOINTMENT_STATUS
        notes: String
    ): GenericSuccessResponse!
`;
