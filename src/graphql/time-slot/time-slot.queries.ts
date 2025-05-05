export const queries = `#graphql
    getTimeSlotsByDate(
        doctorId: String!
        date: String!
    ): [TimeSlot!]!
`;
