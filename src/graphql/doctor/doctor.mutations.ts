export const mutations = `#graphql
    createDoctor(input: UserDoctorCreateInput!): GenericSuccessResponse!

    updateDoctor(input: UserDoctorUpdateInput!): GenericSuccessResponse!

    verifyDoctor(doctorId: String!, status: DOCTOR_VERIFICATION_STATUS!): GenericSuccessResponse!

    deleteDoctor(doctorId: String!): GenericSuccessResponse!
`;
