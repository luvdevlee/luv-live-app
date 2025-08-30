# Stream API Documentation

## Tổng quan

API Stream được triển khai với GraphQL, hỗ trợ đầy đủ các chức năng CRUD cho stream với bảo mật và hiệu suất cao cho production.

## Tính năng chính

### 🔐 Bảo mật
- **Xác thực JWT**: Tất cả mutations và một số queries yêu cầu xác thực
- **Phân quyền role-based**: 
  - `ADMIN`: Có thể xem/sửa/xóa tất cả streams
  - `STREAMER`: Có thể tạo/sửa/xóa streams của mình
  - `VIEWER`: Chỉ có thể xem public streams
- **Kiểm tra ownership**: User chỉ có thể sửa/xóa streams của mình
- **Privacy control**: Hỗ trợ public/private streams

### ⚡ Hiệu suất
- **Database indexing**: Các indexes được tối ưu cho queries thường dùng
- **Pagination**: Tất cả list queries đều hỗ trợ phân trang
- **Field resolvers**: Lazy loading cho mối quan hệ user-stream
- **Lean queries**: Sử dụng .lean() để tối ưu memory

### 🔍 Tìm kiếm & Lọc
- **Text search**: Tìm kiếm theo title, description, category
- **Status filter**: Lọc theo LIVE/ENDED
- **Privacy filter**: Lọc theo PUBLIC/PRIVATE
- **Category filter**: Lọc theo danh mục
- **User filter**: Lọc theo user_id
- **Sorting**: Sắp xếp theo createdAt, updatedAt, title

## GraphQL Queries & Mutations

### Queries (Public)

#### `streams` - Danh sách streams với phân trang
```graphql
query GetStreams($query: StreamsQueryDto) {
  streams(query: $query) {
    streams {
      _id
      title
      description
      category
      status
      privacy
      thumbnail_url
      media_url
      user_id
      createdAt
      updatedAt
      user {
        _id
        username
        display_name
        avatar_url
      }
    }
    meta {
      currentPage
      totalPages
      totalCount
      limit
      hasNext
      hasPrev
    }
  }
}
```

#### `stream` - Chi tiết một stream
```graphql
query GetStream($id: String!) {
  stream(id: $id) {
    _id
    title
    description
    category
    status
    privacy
    thumbnail_url
    media_url
    user_id
    createdAt
    updatedAt
    user {
      _id
      username
      display_name
      avatar_url
    }
  }
}
```

#### `streamsByUser` - Streams của một user
```graphql
query GetStreamsByUser($userId: String!) {
  streamsByUser(userId: $userId) {
    _id
    title
    description
    status
    privacy
    thumbnail_url
    createdAt
    user {
      username
      display_name
    }
  }
}
```

#### `streamsSimple` - Danh sách streams đơn giản
```graphql
query GetStreamsSimple {
  streamsSimple {
    _id
    title
    status
    thumbnail_url
    user_id
  }
}
```

### Queries (Authenticated)

#### `myStreams` - Streams của user hiện tại
```graphql
query GetMyStreams($query: StreamsQueryDto) {
  myStreams(query: $query) {
    streams {
      _id
      title
      description
      category
      status
      privacy
      thumbnail_url
      media_url
      createdAt
      updatedAt
    }
    meta {
      currentPage
      totalPages
      totalCount
    }
  }
}
```

#### `streamsAdmin` - Tất cả streams (Admin only)
```graphql
query GetStreamsAdmin($query: StreamsQueryDto) {
  streamsAdmin(query: $query) {
    streams {
      _id
      title
      description
      status
      privacy
      user_id
      createdAt
      user {
        username
        email
      }
    }
    meta {
      currentPage
      totalPages
      totalCount
    }
  }
}
```

#### `streamStats` - Thống kê streams
```graphql
query GetStreamStats($userId: String) {
  streamStats(userId: $userId) {
    totalStreams
    liveStreams
    endedStreams
    publicStreams
    privateStreams
  }
}
```

#### `globalStreamStats` - Thống kê toàn cầu (Admin only)
```graphql
query GetGlobalStreamStats {
  globalStreamStats {
    totalStreams
    liveStreams
    endedStreams
    publicStreams
    privateStreams
  }
}
```

### Mutations (Authenticated)

#### `createStream` - Tạo stream mới
```graphql
mutation CreateStream($createStreamDto: CreateStreamDto!) {
  createStream(createStreamDto: $createStreamDto) {
    _id
    title
    description
    category
    status
    privacy
    thumbnail_url
    media_url
    user_id
    createdAt
  }
}
```

#### `updateStream` - Cập nhật stream
```graphql
mutation UpdateStream($id: String!, $updateStreamDto: UpdateStreamDto!) {
  updateStream(id: $id, updateStreamDto: $updateStreamDto) {
    _id
    title
    description
    category
    status
    privacy
    thumbnail_url
    media_url
    updatedAt
  }
}
```

#### `removeStream` - Xóa stream
```graphql
mutation RemoveStream($id: String!) {
  removeStream(id: $id)
}
```

#### `endStream` - Kết thúc stream
```graphql
mutation EndStream($id: String!) {
  endStream(id: $id) {
    _id
    status
    updatedAt
  }
}
```

## Input Types

### CreateStreamDto
```typescript
{
  title: string;                    // Bắt buộc, 3-200 ký tự
  description?: string;             // Tùy chọn, tối đa 1000 ký tự
  category?: string;                // Tùy chọn, tối đa 50 ký tự
  status?: Status;                  // Tùy chọn, mặc định LIVE
  privacy?: PrivacyStatus;          // Tùy chọn, mặc định PUBLIC
  thumbnail_url?: string;           // Tùy chọn, phải là URL hợp lệ
  media_url?: string;               // Tùy chọn, phải là URL hợp lệ
}
```

### UpdateStreamDto
```typescript
{
  title?: string;                   // Tùy chọn, 3-200 ký tự
  description?: string;             // Tùy chọn, tối đa 1000 ký tự
  category?: string;                // Tùy chọn, tối đa 50 ký tự
  status?: Status;                  // Tùy chọn
  privacy?: PrivacyStatus;          // Tùy chọn
  thumbnail_url?: string;           // Tùy chọn, phải là URL hợp lệ
  media_url?: string;               // Tùy chọn, phải là URL hợp lệ
}
```

### StreamsQueryDto
```typescript
{
  page?: number;                    // Mặc định 1
  limit?: number;                   // Mặc định 10, tối đa 100
  search?: string;                  // Tìm kiếm trong title, description, category
  status?: Status;                  // Lọc theo status
  privacy?: PrivacyStatus;          // Lọc theo privacy
  category?: string;                // Lọc theo category
  user_id?: string;                 // Lọc theo user_id
  sortBy?: string;                  // Mặc định "createdAt"
  sortOrder?: "ASC" | "DESC";       // Mặc định "DESC"
}
```

## Response Types

### StreamResponse
```typescript
{
  _id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  status: Status;
  privacy: PrivacyStatus;
  thumbnail_url?: string;
  media_url?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserResponse;              // Field resolver
}
```

### StreamsPaginatedResponse
```typescript
{
  streams: StreamResponse[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## Enums

### Status
- `LIVE` - Stream đang phát trực tiếp
- `ENDED` - Stream đã kết thúc

### PrivacyStatus  
- `PUBLIC` - Stream công khai, ai cũng có thể xem
- `PRIVATE` - Stream riêng tư, chỉ owner và admin có thể xem

## Database Indexes

Các indexes được tối ưu cho performance:

```typescript
// Single indexes
StreamSchema.index({ user_id: 1 });
StreamSchema.index({ status: 1 });
StreamSchema.index({ privacy: 1 });
StreamSchema.index({ createdAt: -1 });
StreamSchema.index({ updatedAt: -1 });
```

## Security Features

### 1. Authentication
- JWT token required cho tất cả mutations
- JWT token optional cho một số queries để access private data

### 2. Authorization  
- Role-based access control (RBAC)
- Owner-based permissions
- Privacy-based visibility

### 3. Input Validation
- Class-validator cho tất cả inputs
- URL validation cho media/thumbnail URLs
- String length limitations
- Enum validation

### 4. Error Handling
- Structured error responses
- Proper HTTP status codes
- Logging cho debugging

## Performance Optimizations

### 1. Database
- Optimized indexes cho common queries
- Lean queries để giảm memory usage
- Compound indexes cho complex filters

### 2. GraphQL
- Field resolvers cho lazy loading
- Pagination cho large datasets
- Selective field querying

### 3. Caching Ready
- Response structure phù hợp cho caching
- Stable IDs cho cache invalidation

## Usage Examples

### Tạo stream mới (Streamer)
```javascript
const createStreamMutation = `
  mutation CreateStream($input: CreateStreamDto!) {
    createStream(createStreamDto: $input) {
      _id
      title
      status
      privacy
      createdAt
    }
  }
`;

const variables = {
  input: {
    title: "My Gaming Stream",
    description: "Playing the latest games",
    category: "Gaming",
    privacy: "PUBLIC"
  }
};
```

### Lấy danh sách streams với filter
```javascript
const getStreamsQuery = `
  query GetStreams($query: StreamsQueryDto) {
    streams(query: $query) {
      streams {
        _id
        title
        status
        user {
          username
        }
      }
      meta {
        totalCount
        hasNext
      }
    }
  }
`;

const variables = {
  query: {
    page: 1,
    limit: 20,
    status: "LIVE",
    search: "gaming"
  }
};
```

### Cập nhật stream (Owner)
```javascript
const updateStreamMutation = `
  mutation UpdateStream($id: String!, $input: UpdateStreamDto!) {
    updateStream(id: $id, updateStreamDto: $input) {
      _id
      title
      description
      updatedAt
    }
  }
`;

const variables = {
  id: "stream_id_here",
  input: {
    title: "Updated Stream Title",
    description: "New description"
  }
};
```

## Error Handling

API trả về các error codes chuẩn:

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token  
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Stream not found
- `409 Conflict` - Business logic conflicts
- `500 Internal Server Error` - Server errors

Error response format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": ["stream"],
  "locations": [{"line": 2, "column": 3}]
}
```
