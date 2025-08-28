# User API Documentation

## Overview
This document outlines the User API endpoints for the LUV application. All endpoints are GraphQL mutations and queries.

## Rate Limiting
- Registration endpoint: 3 attempts per minute per IP
- Other endpoints: Standard throttling applies

## Authentication
Most endpoints require JWT authentication. Public endpoints are marked below.

## Endpoints

### Public Endpoints

#### 1. Register User
**Type:** Mutation  
**Name:** `registerUser`  
**Description:** Register a new user account  
**Rate Limited:** Yes (3/minute)

**Input:**
```graphql
input RegisterUserDto {
  username: String!
  email: String!
  password: String!
  display_name: String
  avatar_url: String
}
```

**Output:**
```graphql
type UserResponse {
  _id: ID!
  username: String!
  email: String!
  google_id: String
  avatar_url: String
  display_name: String
  role: UserRole!
  is_active: Boolean!
  last_login_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
}
```

**Example:**
```graphql
mutation RegisterUser($input: RegisterUserDto!) {
  registerUser(registerUserDto: $input) {
    _id
    username
    email
    role
    created_at
  }
}
```

#### 2. Get User by Username
**Type:** Query  
**Name:** `userByUsername`  
**Description:** Get user profile by username (public information)

**Input:**
```graphql
userByUsername(username: String!): UserResponse!
```

### Authenticated Endpoints

#### 3. Get Current User
**Type:** Query  
**Name:** `me`  
**Description:** Get current authenticated user's profile

**Output:**
```graphql
me: UserResponse!
```

#### 4. Update Profile
**Type:** Mutation  
**Name:** `updateMyProfile`  
**Description:** Update current user's profile

**Input:**
```graphql
input UpdateUserDto {
  username: String
  email: String
  avatar_url: String
  display_name: String
  is_active: Boolean
  role: UserRole
  google_id: String
}
```

#### 5. Change Password
**Type:** Mutation  
**Name:** `changePassword`  
**Description:** Change user's password

**Input:**
```graphql
changePassword(oldPassword: String!, newPassword: String!): Boolean!
```

### Admin Only Endpoints

#### 6. Create User
**Type:** Mutation  
**Name:** `createUser`  
**Description:** Create a new user (admin only)

#### 7. Get All Users
**Type:** Query  
**Name:** `users`  
**Description:** Get all active users (admin only)

#### 8. Update Any User
**Type:** Mutation  
**Name:** `updateUser`  
**Description:** Update any user's profile (admin only)

#### 9. Deactivate User
**Type:** Mutation  
**Name:** `removeUser`  
**Description:** Deactivate user account (admin only)

#### 10. Promote to Streamer
**Type:** Mutation  
**Name:** `promoteToStreamer`  
**Description:** Promote user to streamer role (admin only)

#### 11. Promote to Admin
**Type:** Mutation  
**Name:** `promoteToAdmin`  
**Description:** Promote user to admin role (admin only)

#### 12. Demote to Viewer
**Type:** Mutation  
**Name:** `demoteToViewer`  
**Description:** Demote user to viewer role (admin only)

#### 13. User Statistics
**Type:** Query  
**Name:** `userStats`  
**Description:** Get user statistics (admin only)

**Output:**
```graphql
type UserStatsResponse {
  totalUsers: Int!
  activeUsers: Int!
  streamers: Int!
  viewers: Int!
  admins: Int!
}
```

## User Roles
- `ADMIN`: Full system access
- `STREAMER`: Can create and manage streams
- `VIEWER`: Basic user permissions

## Security Features
- Password strength validation
- Username format validation
- Email format validation
- Rate limiting on registration
- JWT authentication
- Role-based access control
- Input sanitization and validation
- Password hashing with bcrypt (12 rounds)

## Database Indexes
The following indexes are created for optimal performance:
- `email` (unique, sparse)
- `username` (unique)
- `google_id` (unique, sparse)
- `role`
- `is_active`
- `created_at` (descending)
- `last_login_at` (descending)
- Compound: `email + is_active`
- Compound: `username + is_active`
- Compound: `role + is_active`

## Error Codes
- `BAD_USER_INPUT`: Invalid input data
- `UNAUTHENTICATED`: Not authenticated
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: User not found
- `CONFLICT`: Username/email already exists
- `INTERNAL_ERROR`: Server error

## Best Practices
1. Always validate user input
2. Use proper authentication for protected endpoints
3. Handle errors gracefully
4. Implement proper logging
5. Use rate limiting for public endpoints
6. Never expose sensitive data like password hashes
