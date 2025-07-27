export const mutations = `#graphql
    signup(
        email: String!
        password: String!
        confirmPassword: String!
    ): AuthResponse!

    signin(
        email: String!
        password: String!
    ): AuthResponse!

    updateProfilePicture(id: String!): GenericSuccessResponse!

    updateUserStatus(id: String!): GenericSuccessResponse!

    createAdmin(
        email: String!
    ): GenericSuccessResponse!

    deleteAdmins(ids: [String!]!): GenericSuccessResponse!
`;
