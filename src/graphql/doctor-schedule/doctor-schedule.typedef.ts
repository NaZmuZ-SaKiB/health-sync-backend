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

    # Inputs
    input DoctorScheduleUpdateData {
        startTime: String
        endTime: String
        sessionLength: Int
        isAvailable: Boolean
    }

    input DoctorScheduleUpdateInput {
        ids: [String!]!
        data: DoctorScheduleUpdateData!
    }
`;
