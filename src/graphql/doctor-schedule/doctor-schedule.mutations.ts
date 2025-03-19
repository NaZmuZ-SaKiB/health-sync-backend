export const mutations = `#graphql
    createDoctorSchedule(
        doctorId: String!
        startTime: String!
        endTime: String!
        day: DAY!
    ): GenericSuccessResponse!

    updateDoctorSchedule(
        scheduleId: String!
        startTime: String
        endTime: String
        isAvailable: Boolean
    ): GenericSuccessResponse!
`;
