export const typeDefs = `#graphql
    type Payment {
        id: ID!
        amount: Int!
        paymentDate: String!
        transactionId: String
        status: PAYMENT_STATUS!
        createdAt: String!
        updatedAt: String!

        # Relations 
        appointment: Appointment!
    }
`;
