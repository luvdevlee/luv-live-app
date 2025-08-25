# 📁 Cấu trúc thư mục - Luv Live Stream Application

## 🏗 Tổng quan cấu trúc

```
luv-app-fe/
├── 📁 public/                    # Static assets
│   ├── favicon.ico
│   ├── *.svg                     # Icons & graphics
│   └── robots.txt
│
├── 📁 src/                       # Source code
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── 📁 (auth)/           # Auth route group
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 (dashboard)/       # Dashboard route group
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 streams/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 about/             # Public pages
│   │   │   └── page.tsx
│   │   ├── 📁 contact/
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 api/               # API routes
│   │   │   └── 📁 auth/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── favicon.ico
│   │
│   ├── 📁 components/            # React components
│   │   ├── 📁 ui/               # Basic UI components
│   │   │   └── index.ts
│   │   ├── 📁 layout/           # Layout components
│   │   │   └── index.ts
│   │   ├── 📁 forms/            # Form components
│   │   │   └── index.ts
│   │   └── 📁 media/            # Media components
│   │       └── index.ts
│   │
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── 📁 utils/            # Helper functions
│   │   │   └── index.ts
│   │   ├── 📁 api/              # API utilities
│   │   │   └── index.ts
│   │   ├── 📁 auth/             # Authentication
│   │   │   └── index.ts
│   │   └── 📁 constants/        # App constants
│   │       └── index.ts
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   │   └── index.ts
│   │
│   ├── 📁 types/                 # TypeScript definitions
│   │   ├── global.ts            # Global types
│   │   ├── api.ts               # API types
│   │   └── components.ts        # Component types
│   │
│   ├── 📁 styles/                # CSS & styling
│   │   ├── 📁 globals/          # Global styles
│   │   │   └── variables.css
│   │   └── 📁 components/       # Component styles
│   │       └── button.css
│   │
│   └── 📁 assets/                # Static assets
│       ├── 📁 icons/            # SVG icons
│       │   └── .gitkeep
│       └── 📁 images/           # Images
│           └── .gitkeep
│
├── 📄 Dockerfile                # Docker configuration
├── 📄 next.config.ts            # Next.js config
├── 📄 package.json              # Dependencies
├── 📄 tsconfig.json             # TypeScript config
├── 📄 tailwind.config.js        # TailwindCSS config
├── 📄 postcss.config.mjs        # PostCSS config
├── 📄 eslint.config.mjs         # ESLint config
├── 📄 .gitignore                # Git ignore
└── 📄 README.md                 # Documentation
```

## 📋 Mô tả chi tiết

### 🎯 **App Router Structure** (`src/app/`)

| Thư mục | Mục đích | Ví dụ |
|---------|----------|--------|
| `(auth)/` | Route group cho authentication | `/login`, `/register` |
| `(dashboard)/` | Route group cho dashboard | `/dashboard`, `/streams` |
| `about/` | Trang giới thiệu | `/about` |
| `contact/` | Trang liên hệ | `/contact` |
| `api/` | API routes | `/api/auth` |

### 🧩 **Components Structure** (`src/components/`)

| Thư mục | Mục đích | Components |
|---------|----------|------------|
| `ui/` | Basic UI components | Button, Input, Modal, Card |
| `layout/` | Layout components | Header, Footer, Sidebar, Navigation |
| `forms/` | Form components | LoginForm, RegisterForm, ContactForm |
| `media/` | Media components | VideoPlayer, StreamViewer, ChatBox |

### 🛠 **Library Structure** (`src/lib/`)

| Thư mục | Mục đích | Nội dung |
|---------|----------|----------|
| `utils/` | Helper functions | Formatting, validation, helpers |
| `api/` | API utilities | Client, endpoints, interceptors |
| `auth/` | Authentication | Auth logic, tokens, guards |
| `constants/` | App constants | API URLs, routes, messages |

### 📝 **Types Structure** (`src/types/`)

| File | Mục đích | Types |
|------|----------|-------|
| `global.ts` | Global types | User, Stream, ApiResponse |
| `api.ts` | API types | LoginRequest, AuthResponse |
| `components.ts` | Component types | ButtonProps, InputProps |

### 🎨 **Styles Structure** (`src/styles/`)

| Thư mục | Mục đích | Files |
|---------|----------|-------|
| `globals/` | Global styles | variables.css, base.css |
| `components/` | Component styles | button.css, modal.css |

## 🔄 **Naming Conventions**

### **Files & Folders:**
- **PascalCase**: React components (`Button.tsx`, `UserProfile.tsx`)
- **camelCase**: Utilities, hooks (`useAuth.ts`, `formatDate.ts`)
- **kebab-case**: Pages, routes (`user-profile/`, `stream-dashboard/`)
- **lowercase**: Config files (`next.config.ts`, `package.json`)

### **Imports & Exports:**
```typescript
// ✅ Good - Barrel exports
export { Button } from './Button';
export { Input } from './Input';

// ✅ Good - Default exports for pages
export default function HomePage() {}

// ✅ Good - Named exports for utilities
export const formatDate = () => {};
export const validateEmail = () => {};
```

## 🔗 **Import Paths**

### **Absolute Imports** (via `tsconfig.json`):
```typescript
// ✅ Recommended
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { User } from '@/types/global';
import { formatDate } from '@/lib/utils';

// ❌ Avoid
import { Button } from '../../../components/ui/Button';
```

## 📦 **Component Organization**

### **Component Structure:**
```typescript
// Button/
├── Button.tsx          # Main component
├── Button.test.tsx     # Tests
├── Button.stories.tsx  # Storybook
├── Button.module.css   # Styles
└── index.ts           # Barrel export
```

### **Page Structure:**
```typescript
// dashboard/
├── page.tsx           # Page component
├── loading.tsx        # Loading UI
├── error.tsx          # Error UI
├── not-found.tsx      # 404 UI
└── layout.tsx         # Layout (if needed)
```

## 🔧 **Development Guidelines**

### **1. File Organization:**
- Một component = một file
- Group related files together
- Use index.ts for barrel exports
- Keep folder depth reasonable (max 3-4 levels)

### **2. Component Patterns:**
- **Server Components**: Default cho pages
- **Client Components**: Khi cần interactivity
- **Shared Components**: Trong `components/ui/`
- **Page-specific**: Trong page folder

### **3. Styling Strategy:**
- **TailwindCSS**: Primary styling method
- **CSS Modules**: For complex components
- **Global CSS**: For design system variables
- **Component CSS**: For component-specific styles

## 🚀 **Scalability Features**

### **Route Groups:**
- `(auth)`: Authentication pages
- `(dashboard)`: Protected dashboard
- `(marketing)`: Landing pages
- `(admin)`: Admin panel

### **Feature-based Organization:**
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── api/
│   └── streaming/
│       ├── components/
│       ├── hooks/
│       └── types/
```

## 📚 **Best Practices**

1. **Consistency**: Follow naming conventions
2. **Modularity**: Keep components small and focused
3. **Reusability**: Create generic UI components
4. **Type Safety**: Use TypeScript for everything
5. **Performance**: Optimize imports and lazy loading
6. **Documentation**: Document complex components
7. **Testing**: Write tests for critical components

---

**📝 Note**: Cấu trúc này được thiết kế để scale với dự án lớn và team development. Có thể điều chỉnh theo nhu cầu cụ thể của dự án.
