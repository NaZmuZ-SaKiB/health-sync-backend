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
`;
