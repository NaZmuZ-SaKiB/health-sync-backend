export const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        firstName: String
        lastName: String
        phoneNumber: String
        address: String
        dateOfBirth: String
        gender: GENDER
        profilePicture: String
        role: ROLE!
        isActive: Boolean!
        needPasswordChange: Boolean!
        createdAt: String!
        updatedAt: String!
        
        # Relations
        patient: Patient
        doctor: Doctor
        images: [Image!]!
    }

    type AuthResponse {
        success: Boolean!
        token: String!
    }
`;
