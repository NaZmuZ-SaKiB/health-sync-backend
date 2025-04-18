export const mutations = `#graphql
    createLocation(
        name: String!
        mapUrl: String!
        address: String!
        phoneNumber: String!
        description: String
        image: String
    ):Location!

    updateLocation(
        locationId: String!,
        name: String,
        mapUrl: String,
        address: String,
        phoneNumber: String,
        description: String,
        icon: String
    ):Location!

    removeLocations(ids: [String!]!): GenericSuccessResponse!
`;
