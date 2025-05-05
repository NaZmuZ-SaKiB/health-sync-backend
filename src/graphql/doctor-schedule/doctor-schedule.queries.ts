export const queries = `#graphql
    doctorSchedules(doctorId: String!):[DoctorSchedule!]!

    getDoctorScheduleByDate(
        doctorId: String!
        date: String!
    ): DoctorSchedule
`;
