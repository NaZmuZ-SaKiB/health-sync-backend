export const mutations = `#graphql
    createLocation(
        name: String!
        mapUrl: String!
        address: String!
        phoneNumber: String!
        description: String
        imageId: String
    ):Location!

    updateLocation(
        locationId: String!,
        name: String,
        mapUrl: String,
        address: String,
        phoneNumber: String,
        description: String,
        imageId: String
    ):Location!

    removeLocations(ids: [String!]!): GenericSuccessResponse!
`;
