export const typeDefs = `#graphql
    type Image {
        id: ID!
        userType: Role!
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
`;
