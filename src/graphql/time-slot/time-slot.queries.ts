export const queries = `#graphql
    getTimeSlotsByDate(
        doctorId: String
        serviceId: String
        date: String!
    ): [TimeSlot!]!
`;
