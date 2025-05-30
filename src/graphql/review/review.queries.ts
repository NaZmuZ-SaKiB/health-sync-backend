export const queries = `#graphql
  getAllReviews(
    page: String
    limit: String
    searchTerm: String
    sortBy: String
    sortOrder: String
    type: String
  ): ReviewsResponse!
`;
