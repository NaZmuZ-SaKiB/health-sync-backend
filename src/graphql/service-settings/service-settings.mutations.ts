export const mutations = `#graphql
  updateServiceSettings(
    serviceId: String!
    startTime: String
    endTime: String
    duration: Int
  ): GenericSuccessResponse!
`;
