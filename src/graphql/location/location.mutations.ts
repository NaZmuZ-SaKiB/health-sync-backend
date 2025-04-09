export const mutations = `#graphql
    createLocation(
        name: String!
        mapUrl: String!
        address: String!
        phoneNumber: String!
        description: String
        image: String
    ):GenericSuccessResponse!
`;
