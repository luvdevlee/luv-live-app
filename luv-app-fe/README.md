# 🎥 Luv Live Stream Application

> **Professional live streaming platform** built with Next.js 15, React 19, and TypeScript

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC)](https://tailwindcss.com/)

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Scripts](#-scripts)
- [Triển khai](#-triển-khai)
- [Môi trường phát triển](#-môi-trường-phát-triển)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Tổng quan

Luv Live Stream Application là một nền tảng phát trực tiếp chuyên nghiệp được xây dựng với các công nghệ hiện đại. Ứng dụng cung cấp trải nghiệm streaming mượt mà và chất lượng cao cho người dùng.

### ✨ Đặc điểm nổi bật

- **Hiệu suất cao**: Tối ưu hóa với Next.js 15 và React 19
- **Responsive**: Hoạt động tốt trên mọi thiết bị
- **SEO-friendly**: Tối ưu hóa cho công cụ tìm kiếm
- **Type-safe**: Được phát triển hoàn toàn với TypeScript
- **Modern UI**: Sử dụng TailwindCSS 4.x

## 🚀 Tính năng

- [ ] Live streaming real-time
- [ ] Chat tương tác
- [ ] Quản lý người dùng
- [ ] Dashboard analytics
- [ ] Mobile responsive
- [ ] Dark/Light mode
- [ ] Multi-language support

## 🛠 Công nghệ sử dụng

### Frontend Stack
- **Framework**: Next.js 15.5.0 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.x
- **Fonts**: Geist (Next.js/Font)

### DevOps & Tools
- **Bundler**: Next.js built-in
- **Linting**: ESLint 9.x
- **Package Manager**: npm
- **Container**: Docker
- **Build Analysis**: @next/bundle-analyzer

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Git**: Latest version

### Clone và cài đặt

```bash
# Clone repository
git clone <repository-url>
cd luv-app-fe

# Cài đặt dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Tạo file `.env.local` với các biến môi trường:

```env
# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

# Streaming Configuration
NEXT_PUBLIC_RTMP_URL=rtmp://localhost:1935
NEXT_PUBLIC_HLS_URL=http://localhost:8080/hls

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🎮 Sử dụng

### Development Mode

```bash
# Khởi chạy development server
npm run dev

# Mở trình duyệt tại http://localhost:3000
```

### Production Build

```bash
# Build cho production
npm run build

# Khởi chạy production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t luv-app-fe .

# Chạy container
docker run -p 3000:3000 luv-app-fe
```

## 📁 Cấu trúc dự án

```
luv-app-fe/
├── 📁 public/              # Static assets
│   ├── favicon.ico
│   └── *.svg
├── 📁 src/
│   ├── 📁 app/             # App Router (Next.js 13+)
│   │   ├── favicon.ico
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── 📁 components/      # Reusable components
│   ├── 📁 lib/            # Utility functions
│   ├── 📁 hooks/          # Custom React hooks
│   └── 📁 types/          # TypeScript type definitions
├── 📄 Dockerfile          # Docker configuration
├── 📄 next.config.ts      # Next.js configuration
├── 📄 package.json        # Dependencies & scripts
├── 📄 tailwind.config.js  # TailwindCSS configuration
├── 📄 tsconfig.json       # TypeScript configuration
└── 📄 README.md           # Documentation
```

## 🎯 Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Khởi chạy development server |
| `npm run build` | Build production |
| `npm start` | Khởi chạy production server |
| `npm run lint` | Kiểm tra linting |
| `npm run lint:fix` | Tự động sửa linting errors |
| `npm run export` | Export static files |
| `npm run analyze` | Phân tích bundle size |

## 🚀 Triển khai

### Vercel (Recommended)

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Cấu hình environment variables
4. Deploy tự động

### Docker

```bash
# Build image
docker build -t luv-app-fe .

# Run container
docker run -d -p 3000:3000 --name luv-app luv-app-fe
```

### Traditional Hosting

```bash
# Build static files
npm run build
npm run export

# Upload 'out' folder to hosting
```

## 🔧 Môi trường phát triển

### Code Style

- **ESLint**: Cấu hình với Next.js rules
- **Prettier**: Tự động format code
- **TypeScript**: Strict mode enabled
- **Git hooks**: Pre-commit linting

### Recommended Extensions (VS Code)

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint"
  ]
}
```

### Browser Support

- **Chrome**: >= 90
- **Firefox**: >= 88
- **Safari**: >= 14
- **Edge**: >= 90

## 🤝 Contributing

### Quy trình đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Coding Standards

- Sử dụng TypeScript cho tất cả code
- Follow ESLint rules
- Viết tests cho components quan trọng
- Đặt tên biến/function rõ ràng
- Comment code phức tạp

## 📊 Performance

- **Lighthouse Score**: 95+ (Target)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security

- **CSP Headers**: Configured
- **XSS Protection**: Enabled
- **HTTPS Only**: Production
- **Environment Variables**: Properly secured

## 🐛 Troubleshooting

### Common Issues

1. **Build errors**: Kiểm tra TypeScript types
2. **Styling issues**: Clear TailwindCSS cache
3. **Performance**: Sử dụng `npm run analyze`

### Getting Help

- 📧 Email: dev-team@luv-app.com
- 💬 Discord: [Join our server](https://discord.gg/luv-app)
- 📝 Issues: [GitHub Issues](https://github.com/luv-team/luv-app-fe/issues)

## 📝 License

This project is **UNLICENSED** - Proprietary software by Luv Dev Team.

---

**Developed with ❤️ by Luv Dev Team**

*For more information, visit our [documentation site](https://docs.luv-app.com)*