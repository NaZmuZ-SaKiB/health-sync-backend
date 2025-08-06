export const typeDefs = `#graphql
    type Setting {
        id: ID!
        key: String!
        value: String!
        createdAt: String!
        updatedAt: String!

        # Relations

    }

    # Return Types

    # Inputs
    input SettingUpdateInput {
      key: String!
      value: String!
    }

`;
