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

    updateProfile(
        firstName: String
        lastName: String
        gender: GENDER
        phoneNumber: String
        address: String
        dateOfBirth: String
    ): GenericSuccessResponse!

    updateProfilePicture(id: String!): GenericSuccessResponse!

    updateUserStatus(id: String!): GenericSuccessResponse!

    createAdmin(
        email: String!
    ): GenericSuccessResponse!

    deleteAdmins(ids: [String!]!): GenericSuccessResponse!
`;
