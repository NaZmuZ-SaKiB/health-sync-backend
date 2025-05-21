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
        doctor: Doctor
        service: Service
        timeSlot: TimeSlot!
        payment: Payment
        report: MedicalReport
        review: Review
    }

    # Return Types
    type AppointmentsResponse {
        meta: Meta!
        appointments: [Appointment!]!
    }

    type AppointmentCreateReturn{
        success: Boolean!
        token: String
    }

    # Inputs
    input AppointmentUserPatientInput {
        bloodGroup: BLOOD_GROUP!
        allergies: String
    }

    input AppointmentUserInput {
        email: String!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        address: String
        dateOfBirth: String!
        gender: GENDER!
        patient: AppointmentUserPatientInput!
    }

    input AppointmentInput {
        doctorId: String
        serviceId: String
        timeSlot: TimeSlotCreateInput!
        reason: String
    }

    input AppointmentCreateInput {
        user: AppointmentUserInput!
        appointment: AppointmentInput!
    }
`;
