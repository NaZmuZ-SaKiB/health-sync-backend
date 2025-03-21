export const typeDefs = `#graphql
    type DoctorSchedule {
        id: ID!
        day: DAY!
        startTime: String!
        endTime: String!
        sessionLength: Int!
        isAvailable: Boolean!
        createdAt: String!
        updatedAt: String!

        # Relations 
        doctor: Doctor!
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
