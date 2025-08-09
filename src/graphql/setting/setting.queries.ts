export const queries = `#graphql
  settings(
    keys: [String!]!
  ): [Setting!]!

  setting(
    key: String!
  ): Setting!

  homepageSetting: String!
`;
