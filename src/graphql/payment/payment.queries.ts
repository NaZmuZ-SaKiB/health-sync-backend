export const queries = `#graphql
  getAllPayments(
    page: String
    limit: String
    searchTerm: String
    sortBy: String
    sortOrder: String
    status: PAYMENT_STATUS
  ) : PaymentsResponse!
`;
