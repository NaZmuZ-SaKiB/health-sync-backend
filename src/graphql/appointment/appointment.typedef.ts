export const typeDefs = `#graphql
    type Appointment {
        id: ID!
        status: APPOINTMENT_STATUS!
        reason: String
        notes: String
        createdAt: String!
        updatedAt: String!

        # Relations
        patient: Patient!
        doctor: Doctor!
        timeSlot: TimeSlot!
        payment: Payment
        report: MedicalReport
        review: Review
    }

    input AppointmentCreateInput {
        scheduleId: String!
        reason: String
        timeSlot: TimeSlotCreateInput!
    }
`;
