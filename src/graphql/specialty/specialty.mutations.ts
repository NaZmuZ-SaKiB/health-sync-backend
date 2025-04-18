export const mutations = `#graphql
    createSpecialty(name: String!, description: String, icon: String): SpecialtyCreateUpdateResponse!

    updateSpecialty(specialtyId: String!, name: String, description: String, icon: String): SpecialtyCreateUpdateResponse!

    removeSpecialties(ids: [String!]!): GenericSuccessResponse!
`;
