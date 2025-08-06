export const mutations = `#graphql
  updateSetting(
    key: String!
    value: String!
  ): GenericSuccessResponse!

  updateManySetting(
    settings: [SettingUpdateInput!]!
  ): GenericSuccessResponse!
`;
