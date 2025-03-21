export const typeDefs = `#graphql
    type TimeSlot {
        id:ID!
        day: DAY!
        slotDate: String!
        startTime: String!
        endTime: String!
        isBooked: Boolean!
        createdAt: String!
        updatedAt: String!

        # Relations
        doctor: Doctor!
        appointments: [Appointment!]!
    }

    input TimeSlotCreateInput {
        slotDate: String!
        startTime: String!
        endTime: String!
    }
`;
