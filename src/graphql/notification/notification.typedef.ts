export const typeDefs = `#graphql
    type Notification {
        id: ID!
        userId: String!
        title: String!
        message: String!
        isRead: Boolean!
        type: NOTIFICATION_TYPE!
        createdAt: String!
    }

    enum NOTIFICATION_TYPE {
        NEW_APPOINTMENT
        APPOINTMENT_REMINDER
        PAYMENT_CONFIRMATION
        REPORT_AVAILABLE
        NORMAL
    }
`;
