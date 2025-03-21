export const typeDefs = `#graphql
    type Notification {
        id: ID!
        userId: String!
        title: String!
        message: String!
        isRead: Boolean!
        type: NOTIFICATION_TYPE!
        createdAt: String!
    }
`;
