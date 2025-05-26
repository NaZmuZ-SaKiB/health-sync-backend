export const queries = `#graphql
    getTimeSlotsByDate(
        doctorId: String
        serviceId: String
        locationId: String
        date: String!
    ): [TimeSlot!]!
`;
