# 🚀 Luv Live Stream Backend API

> **NestJS GraphQL API** với MongoDB cho nền tảng live streaming

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red)](https://nestjs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.8.1-pink)](https://graphql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.1.1-green)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [API Documentation](#-api-documentation)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [GraphQL Schemas](#-graphql-schemas)
- [Deployment](#-deployment)

## 🎯 Tổng quan

Backend API cho ứng dụng live streaming được xây dựng với:
- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language và runtime
- **MongoDB** - NoSQL database
- **TypeScript** - Type-safe development

## ✨ Tính năng

### 🔐 Authentication
- [x] User registration/login
- [x] JWT token authentication
- [ ] OAuth integration
- [ ] Role-based access control

### 👥 User Management
- [x] User CRUD operations
- [x] User profiles
- [x] User roles (Admin, Streamer, Viewer)
- [x] Password hashing with bcrypt

### 📺 Stream Management
- [x] Stream CRUD operations
- [x] Stream categories
- [x] Live stream status tracking
- [x] Viewer count management
- [x] Stream search functionality

### 🔄 Real-time Features
- [ ] WebSocket integration
- [ ] Live chat
- [ ] Real-time notifications
- [ ] Stream events

## 🛠 Công nghệ sử dụng

### **Backend Stack**
```json
{
  "@nestjs/core": "^11.0.1",
  "@nestjs/graphql": "^12.0.11",
  "@nestjs/mongoose": "^10.0.4",
  "graphql": "^16.8.1",
  "mongoose": "^8.1.1"
}
```

### **Development Tools**
```json
{
  "typescript": "^5.7.3",
  "jest": "^30.0.0",
  "eslint": "^9.18.0",
  "prettier": "^3.4.2"
}
```

## 📦 Cài đặt

### **Prerequisites**
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 8.0.0

### **Clone & Install**
```bash
# Clone repository
git clone <repository-url>
cd luv-app-be

# Install dependencies
npm install

# Setup environment
cp .env.development .env
```

### **Environment Configuration**
```bash
# .env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/luv-app-dev
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

### **Start Development**
```bash
# Start MongoDB (if local)
mongod

# Start development server
npm run start:dev

# GraphQL Playground will be available at:
# http://localhost:3000/graphql
```

## 📚 API Documentation

### **GraphQL Playground**
- **Development**: http://localhost:3000/graphql
- **Introspection**: Enabled in development
- **Schema**: Auto-generated from TypeScript decorators

### **Key Queries**
```graphql
# Get all users
query GetUsers {
  users {
    _id
    username
    email
    role
    createdAt
  }
}

# Get live streams
query GetLiveStreams {
  liveStreams {
    _id
    title
    category
    viewerCount
    streamer {
      username
    }
  }
}

# Search streams
query SearchStreams($query: String!) {
  searchStreams(query: $query) {
    _id
    title
    description
    category
    status
  }
}
```

### **Key Mutations**
```graphql
# Register user
mutation RegisterUser($input: CreateUserInput!) {
  register(createUserInput: $input) {
    accessToken
    user {
      _id
      username
      email
    }
  }
}

# Create stream
mutation CreateStream($input: CreateStreamInput!) {
  createStream(createStreamInput: $input) {
    _id
    title
    streamKey
    status
  }
}

# Start stream
mutation StartStream($streamKey: String!) {
  startStream(streamKey: $streamKey) {
    _id
    status
    actualStartTime
  }
}
```

## 📁 Cấu trúc dự án

```
src/
├── 📁 auth/                  # Authentication module
│   ├── dto/
│   │   ├── login.input.ts
│   │   └── auth.response.ts
│   ├── auth.service.ts
│   ├── auth.resolver.ts
│   └── auth.module.ts
│
├── 📁 user/                  # User management
│   ├── dto/
│   │   ├── create-user.input.ts
│   │   └── update-user.input.ts
│   ├── user.schema.ts
│   ├── user.service.ts
│   ├── user.resolver.ts
│   └── user.module.ts
│
├── 📁 stream/                # Stream management
│   ├── dto/
│   │   ├── create-stream.input.ts
│   │   └── update-stream.input.ts
│   ├── stream.schema.ts
│   ├── stream.service.ts
│   ├── stream.resolver.ts
│   └── stream.module.ts
│
├── app.module.ts             # Root module
├── main.ts                   # Application entry point
└── schema.gql                # Generated GraphQL schema
```

## 🎨 GraphQL Schemas

### **User Schema**
```graphql
type User {
  _id: ID!
  username: String!
  email: String!
  displayName: String!
  avatar: String
  role: UserRole!
  isActive: Boolean!
  lastLoginAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum UserRole {
  ADMIN
  STREAMER
  VIEWER
}
```

### **Stream Schema**
```graphql
type Stream {
  _id: ID!
  title: String!
  description: String
  category: StreamCategory!
  status: StreamStatus!
  streamKey: String!
  thumbnailUrl: String
  viewerCount: Int!
  totalViews: Int!
  streamer: User!
  scheduledStartTime: DateTime
  actualStartTime: DateTime
  endTime: DateTime
  duration: Int
  tags: [String!]!
  isPublic: Boolean!
  allowChat: Boolean!
  isRecorded: Boolean!
  recordingUrl: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum StreamStatus {
  OFFLINE
  LIVE
  SCHEDULED
  ENDED
}

enum StreamCategory {
  GAMING
  MUSIC
  TALK_SHOW
  EDUCATION
  SPORTS
  ENTERTAINMENT
  OTHER
}
```

## 🚀 Deployment

### **Docker Deployment**
```bash
# Build image
docker build -t luv-app-be .

# Run container
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://your-mongo-host:27017/luv-app \
  -e JWT_SECRET=your-production-secret \
  --name luv-app-be \
  luv-app-be
```

### **Production Environment**
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### **Environment Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/luv-app-dev` |
| `JWT_SECRET` | JWT signing secret | Required |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Development server với hot reload |
| `npm run build` | Build production |
| `npm run start:prod` | Production server |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

## 🔧 Development

### **Adding New Module**
```bash
# Generate module
nest g module feature-name
nest g service feature-name
nest g resolver feature-name

# Generate GraphQL resource
nest g resource feature-name --type graphql-code-first
```

### **Database Operations**
```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/luv-app-dev

# View collections
show collections

# Query users
db.users.find().pretty()
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📝 License

This project is **UNLICENSED** - Proprietary software.

---

**🚀 GraphQL Playground**: http://localhost:3000/graphql  
**📧 Support**: dev-team@luv-app.com

*Built with ❤️ using NestJS, GraphQL & MongoDB*