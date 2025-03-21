export const mutations = `#graphql
    createReview(
        appointmentId: String!
        rating: Int!
        comment: String!
    ): GenericSuccessResponse!
`;
