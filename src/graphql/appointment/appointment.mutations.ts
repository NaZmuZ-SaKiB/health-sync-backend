export const mutations = `#graphql
    createAppointment(input: AppointmentCreateInput!): AppointmentCreateReturn!

    updateAppointment(
        appointmentId: String!
        status: APPOINTMENT_STATUS
        notes: String
    ): GenericSuccessResponse!
`;
