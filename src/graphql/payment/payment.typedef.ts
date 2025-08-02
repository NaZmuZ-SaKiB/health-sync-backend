export const typeDefs = `#graphql
    type Payment {
        id: ID!
        amount: Int!
        paymentDate: String!
        transactionId: String
        status: PAYMENT_STATUS!
        details: String
        createdAt: String!
        updatedAt: String!

        # Relations
        appointment: Appointment!
    }

    # Return Types
    type PaymentsResponse {
      meta: Meta!
      payments: [Payment!]!
    }
`;
