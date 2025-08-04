export const mutations = `#graphql
    createSpecialty(
        name: String!
        description: String
        iconId: String
      ): SpecialtyCreateUpdateResponse!

    updateSpecialty(
      specialtyId: String!
      name: String
      description: String
      iconId: String
    ): SpecialtyCreateUpdateResponse!

    removeSpecialties(ids: [String!]!): GenericSuccessResponse!
`;
