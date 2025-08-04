export const typeDefs = `#graphql
    type Specialty {
        id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!

        # Relations
        doctors: [Doctor!]!
        icon: Image
    }

    # Return Types
    type SpecialtyCreateUpdateResponse {
        success: Boolean!
        specialty: Specialty!
    }

    type SpecialtiesResponse {
        specialties: [Specialty!]!
        meta: Meta!
    }
`;
