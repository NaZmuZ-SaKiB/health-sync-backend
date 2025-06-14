export const typeDefs = `#graphql
    type Image {
        id: ID!
        userType: ROLE!
        name: String!
        publicId: String!
        height: Int!
        width: Int!
        format: String!
        url: String!
        secureUrl: String!
        thumbnailUrl: String!
        createdAt: String!
        updatedAt: String!

        # Relations 
        user: User!
    }

    # Return Types
    type ImagesResponse {
        meta: Meta!
        images: [Image!]!
    }

    # Inputs 
    input ImagesCreateInput {
        name: String!
        publicId: String!
        height: Int
        width: Int
        format: String!
        url: String!
        secureUrl: String!
        thumbnailUrl: String!
    }
`;
