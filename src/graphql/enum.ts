export const enumTypedef = `#graphql
    enum ROLE {
        PATIENT
        DOCTOR
        ADMIN
        SUPER_ADMIN
    }

    enum GENDER {
        MALE
        FEMALE
        OTHER
    }

    enum BLOOD_GROUP {
        A_POSITIVE
        A_NEGATIVE
        B_POSITIVE
        B_NEGATIVE
        O_POSITIVE
        O_NEGATIVE
        AB_POSITIVE
        AB_NEGATIVE
    }

    enum DOCTOR_VERIFICATION_STATUS {
        PENDING
        VERIFIED
        REJECTED
    }

    enum APPOINTMENT_STATUS {
        PENDING_PAYMENT
        SCHEDULED
        COMPLETED
        CANCELLED
        NO_SHOW
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

    enum REPORT_TYPE {
        LAB_REPORT
        PRESCRIPTION
        DIAGNOSIS
    }

    enum NOTIFICATION_TYPE {
        NEW_APPOINTMENT
        APPOINTMENT_REMINDER
        PAYMENT_CONFIRMATION
        REPORT_AVAILABLE
        NORMAL
    }

    enum PAYMENT_STATUS {
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }
`;
