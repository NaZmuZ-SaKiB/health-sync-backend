export const mutations = `#graphql
    createSpecialty(name: String!, description: String, icon: String): GenericSuccessResponse!

    updateSpecialty(specialtyId: String!, name: String, description: String, icon: String): GenericSuccessResponse!

    removeSpecialties(ids: [String!]!): GenericSuccessResponse!
`;
