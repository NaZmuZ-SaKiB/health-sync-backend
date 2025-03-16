export const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String
        phoneNumber: String!
        address: String
        dateOfBirth: String!
        gender: Gender!
        profilePicture: String
        role: Role!
        isActive: Boolean!
        createdAt: String!
        updatedAt: String!
        
        # Relations
        patient: Patient
        # doctor: Doctor
    }

    type AuthResponse {
        token: String!
    }

    enum Gender {
        MALE
        FEMALE
        OTHER
    }

    enum Role {
        PATIENT
        DOCTOR
        ADMIN
        SUPER_ADMIN
    }
`;
