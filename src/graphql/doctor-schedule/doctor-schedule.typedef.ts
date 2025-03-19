export const typeDefs = `#graphql
    type DoctorSchedule {
        id: ID!
        doctor: Doctor!
        day: DAY!
        startTime: String!
        endTime: String!
        isAvailable: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    enum DAY {
        MONDAY
        TUESDAY
        WEDNESDAY
        THURSDAY
        FRIDAY
        SATURDAY
        SUNDAY
    }
`;
