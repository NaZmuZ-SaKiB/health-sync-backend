export const queries = `#graphql
  getAllReports(
    page: String
    limit: String
    searchTerm: String
    sortBy: String
    sortOrder: String
    reportType: REPORT_TYPE
  ) : ReportsResponse!
`;
