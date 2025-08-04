export const queries = `#graphql
    getAllImages(
        page: String
        limit: String
        searchTerm: String
        isProfilePicture: Boolean
    ): ImagesResponse!
`;
