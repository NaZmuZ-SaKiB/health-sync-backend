export const mutations = `#graphql
   createService(
    name: String!
    description: String
    iconId: String
   ): GenericSuccessResponse!

   updateService(
      serviceId: String!
      name: String
      description: String
      iconId: String
   ): Service!

   deleteServices(
    ids: [String!]!
   ): GenericSuccessResponse!
`;
