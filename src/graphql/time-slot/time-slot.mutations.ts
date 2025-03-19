export const mutations = `#graphql
   createTimeSlot(
        doctorId: String!
        day: DAY!
        slotDate: String!
        startTime: String!
        endTime: String!
   ): GenericSuccessResponse!
`;
