export const typeDefs = `#graphql
    type Appointment {
        id: ID!
        patient: Patient!
        doctor: Doctor!
        timeSlot: TimeSlot!
        status: APPOINTMENT_STATUS!
        reason: String
        notes: String
        createdAt: String!
        updatedAt: String!

        # Relations
        # payment: Payment
    }

    enum APPOINTMENT_STATUS {
        SCHEDULED
        COMPLETED
        CANCELLED
        NO_SHOW
    }

    input AppointmentCreateInput {
        scheduleId: String!
        reason: String
        timeSlot: TimeSlotCreateInput!
    }
`;
