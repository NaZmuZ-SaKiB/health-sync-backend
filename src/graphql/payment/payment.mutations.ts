export const mutations = `#graphql
    updatePayment(
        paymentId: String!
        transactionId: String
        status: PAYMENT_STATUS
    ): GenericSuccessResponse!
`;
