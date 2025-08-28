# User Module

## Overview
User module cho ứng dụng LUV, cung cấp đầy đủ tính năng quản lý người dùng với các best practices cho production.

## Features

### 🔐 Authentication & Security
- ✅ Đăng ký người dùng với validation mạnh mẽ
- ✅ Password hashing với bcrypt (12 rounds)
- ✅ JWT authentication integration
- ✅ Rate limiting (3 đăng ký/phút)
- ✅ Input validation và sanitization
- ✅ Role-based access control

### 👤 User Management
- ✅ CRUD operations cho user
- ✅ Profile management
- ✅ Role management (Admin, Streamer, Viewer)
- ✅ Account activation/deactivation
- ✅ Password change functionality
- ✅ Google OAuth integration support

### 📊 Performance & Production Ready
- ✅ MongoDB indexes optimization
- ✅ Error handling với custom filters
- ✅ Logging với context
- ✅ GraphQL API với type safety
- ✅ Validation pipes
- ✅ Throttling protection

## File Structure
```
src/user/
├── dto/
│   ├── create-user.dto.ts       # DTO cho tạo user (admin)
│   ├── register-user.dto.ts     # DTO cho đăng ký public
│   ├── update-user.dto.ts       # DTO cho cập nhật user
│   ├── change-password.dto.ts   # DTO cho đổi password
│   ├── user.response.ts         # Response type cho GraphQL
│   └── index.ts                 # Export all DTOs
├── filters/
│   └── user-exception.filter.ts # Custom exception filter
├── schemas/
│   └── user.schema.ts           # MongoDB schema với indexes
├── user.module.ts               # Module configuration
├── user.resolver.ts             # GraphQL resolver
├── user.service.ts              # Business logic
├── USER_API_DOCS.md            # API documentation
└── README.md                   # This file
```

## API Endpoints

### Public Endpoints
- `registerUser` - Đăng ký tài khoản mới
- `userByUsername` - Lấy thông tin user public

### Authenticated Endpoints
- `me` - Lấy profile hiện tại
- `updateMyProfile` - Cập nhật profile
- `changePassword` - Đổi password

### Admin Endpoints
- `createUser` - Tạo user (admin only)
- `users` - Lấy danh sách user
- `updateUser` - Cập nhật bất kỳ user nào
- `removeUser` - Vô hiệu hóa user
- `promoteToStreamer` - Nâng cấp lên streamer
- `promoteToAdmin` - Nâng cấp lên admin
- `demoteToViewer` - Hạ xuống viewer
- `userStats` - Thống kê user

## User Roles
- **ADMIN**: Toàn quyền hệ thống
- **STREAMER**: Có thể tạo và quản lý stream
- **VIEWER**: Quyền cơ bản của user

## Security Features

### Input Validation
- Username: Chỉ chứa chữ, số và underscore, tối thiểu 3 ký tự
- Email: Format email hợp lệ
- Password: Mạnh mẽ (8+ ký tự, có chữ hoa, thường, số, ký tự đặc biệt)

### Protection Mechanisms
- Rate limiting cho registration
- Password hashing với salt rounds cao
- JWT authentication
- Role-based authorization
- Input sanitization
- Error handling chuyên nghiệp

## Database Optimization

### Indexes
- Single indexes: `email`, `username`, `google_id`, `role`, `is_active`
- Compound indexes cho queries phổ biến
- Unique constraints cho email và username

### Performance
- Lean queries cho read operations
- Selective field projection (không expose password_hash)
- Efficient error handling
- Logging với context

## Usage Examples

### Đăng ký user mới
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

### Cập nhật profile
```graphql
mutation UpdateProfile($input: UpdateUserDto!) {
  updateMyProfile(updateUserDto: $input) {
    _id
    username
    display_name
    avatar_url
    updated_at
  }
}
```

## Testing
Sử dụng file `test/user-registration.http` để test các endpoints.

## Production Considerations

### Security
- ✅ Strong password requirements
- ✅ Rate limiting implemented
- ✅ Input validation and sanitization
- ✅ Proper error handling without info leakage
- ✅ JWT authentication
- ✅ Role-based access control

### Performance
- ✅ Database indexes optimized
- ✅ Efficient queries with lean()
- ✅ Proper logging for monitoring
- ✅ Error handling with context

### Monitoring
- ✅ Structured logging với context
- ✅ Error tracking
- ✅ Performance metrics ready

## Dependencies
- `@nestjs/common` - Core NestJS functionality
- `@nestjs/graphql` - GraphQL integration
- `@nestjs/mongoose` - MongoDB integration
- `@nestjs/throttler` - Rate limiting
- `class-validator` - Input validation
- `bcrypt` - Password hashing
- `mongoose` - MongoDB ODM

## Environment Variables
Ensure these are set in your environment:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)

## Next Steps
1. Setup monitoring and alerts
2. Add unit tests
3. Add integration tests
4. Setup performance monitoring
5. Add audit logging for sensitive operations
