export const mutations = `#graphql
   createService(
    name: String!
    description: String
    icon: String
   ): GenericSuccessResponse!

   updateService(
      serviceId: String!
      name: String
      description: String
      icon: String
   ): Service!
`;
