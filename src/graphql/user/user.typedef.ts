export const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        password: String!
        firstName: String!
        lastName: String
        phoneNumber: String!
        address: String
        dateOfBirth: DateTime!
        gender: Gender!
        profilePicture: String
        role: Role!
        isActive: Boolean!
        createdAt: DateTime!
        updatedAt: DateTime!
        
        # Relations
        patient: Patient
        doctor: Doctor
    }
`;
