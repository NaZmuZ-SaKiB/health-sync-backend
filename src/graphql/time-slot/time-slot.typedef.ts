export const typeDefs = `#graphql
    type TimeSlot {
        id:ID!
        doctor: Doctor!
        day: DAY!
        slotDate: String!
        startTime: String!
        endTime: String!
        isBooked: Boolean!
        createdAt: String!
        updatedAt: String!

        # Relations
        appointment: Appointment
    }
`;
