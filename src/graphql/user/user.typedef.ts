export const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        firstName: String
        lastName: String
        phoneNumber: String
        address: String
        dateOfBirth: String
        gender: Gender
        profilePicture: String
        role: Role!
        isActive: Boolean!
        createdAt: String!
        updatedAt: String!
        
        # Relations
        patient: Patient
        doctor: Doctor
    }

    type AuthResponse {
        success: Boolean!
        token: String!
    }
`;
