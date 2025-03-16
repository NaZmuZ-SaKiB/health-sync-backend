export const mutations = `#graphql
    signup(
        email: String!
        password: String!
        confirmPassword: String!
    ): SignupResponse!
`;
