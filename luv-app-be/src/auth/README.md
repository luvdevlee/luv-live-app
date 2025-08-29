# Authentication Module

Module xác thực và phân quyền cho ứng dụng GraphQL sử dụng JWT và Redis.

## Tính năng

- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với email/password
- ✅ JWT Access Token (15 phút)
- ✅ Refresh Token (7 ngày)
- ✅ Đăng xuất với blacklist token
- ✅ Redis session management
- ✅ Rate limiting
- ✅ GraphQL integration
- ✅ Role-based authorization

## GraphQL Mutations

### Đăng ký
```graphql
mutation Register($registerUserDto: RegisterUserDto!) {
  register(registerUserDto: $registerUserDto) {
    access_token
    refresh_token
    expires_in
    user {
      _id
      username
      email
      role
    }
  }
}
```

### Đăng nhập
```graphql
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    access_token
    refresh_token
    expires_in
    user {
      _id
      username
      email
      role
    }
  }
}
```

### Đăng xuất
```graphql
mutation Logout {
  logout {
    message
    success
  }
}
```

### Refresh Token
```graphql
mutation RefreshToken($refreshTokenInput: RefreshTokenInput!) {
  refreshToken(refreshTokenInput: $refreshTokenInput) {
    access_token
    expires_in
  }
}
```

## Sử dụng trong Resolver

### Protected Route
```typescript
@UseGuards(GqlAuthGuard)
@Mutation(() => SomeResponse)
async protectedMutation(
  @CurrentUser() user: User,
  @Args('input') input: SomeInput,
) {
  // Logic here
}
```

### Public Route
```typescript
@Public()
@Query(() => SomeResponse)
async publicQuery() {
  // Logic here
}
```

## Environment Variables

Cần cấu hình các biến môi trường sau:

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional-redis-password
```

## Rate Limiting

- Login: 5 attempts/minute
- Register: 3 attempts/minute  
- Refresh Token: 10 attempts/minute

## Token Management

- Access Token: 15 phút
- Refresh Token: 7 ngày
- Blacklisted tokens được lưu trong Redis
- Refresh tokens được lưu trong Redis với expiry

## Security Features

- Bcrypt password hashing với salt rounds = 12
- JWT token blacklist khi logout
- Rate limiting cho sensitive endpoints
- Input validation với class-validator
- Role-based access control
