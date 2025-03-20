export const typeDefs = `#graphql
    type Payment {
        id: ID!
        appointment: Appointment!
        amount: Int!
        paymentDate: String!
        transactionId: String
        status: PAYMENT_STATUS!
    }

    enum PAYMENT_STATUS {
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }
`;
