export const queries = `#graphql
    getAllAppointments(
        page: String
        limit: String
        searchTerm: String
        sortBy: String
        sortOrder: String
        status: APPOINTMENT_STATUS
        date: String
        locationId: String
        all: Boolean
    ): AppointmentsResponse!

    appointment(id: String!): Appointment!
`;
