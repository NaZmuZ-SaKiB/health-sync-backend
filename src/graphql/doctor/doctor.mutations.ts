export const mutations = `#graphql
    createDoctor(input: UserDoctorCreateInput!): GenericSuccessResponse!

    updateDoctor(input: UserDoctorUpdateInput!): User!

    verifyDoctor(doctorId: String!, status: DOCTOR_VERIFICATION_STATUS!): GenericSuccessResponse!

    deleteDoctors(ids: [String!]!): GenericSuccessResponse!
`;
