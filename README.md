# Webapp Template

A production-ready Next.js 16 template by **Ravix Studio** with built-in authentication, state management, API layer, and a curated component library.

---

## Tech Stack

| Category             | Technology                                                                            |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Framework**        | [Next.js 16](https://nextjs.org) (App Router)                                         |
| **Language**         | TypeScript 5                                                                          |
| **Styling**          | Tailwind CSS 4                                                                        |
| **UI Components**    | [Base UI](https://base-ui.com) + [shadcn/ui](https://ui.shadcn.com) (base-lyra style) |
| **Icons**            | [Hugeicons](https://hugeicons.com)                                                    |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs)                                               |
| **Data Fetching**    | [TanStack Query](https://tanstack.com/query)                                          |
| **HTTP Client**      | [Axios](https://axios-http.com)                                                       |
| **Validation**       | [Zod](https://zod.dev)                                                                |
| **Package Manager**  | [Bun](https://bun.sh)                                                                 |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # Client-side providers (React Query, Auth)
│   ├── globals.css         # Global styles & CSS variables
│   └── login/              # Login route
│       └── page.tsx
│
├── assets/                 # Static assets (images, fonts, etc.)
│
├── components/
│   └── ui/                 # Reusable UI components (shadcn-based)
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── select.tsx
│       └── ...
│
├── config/
│   ├── index.ts            # Config barrel export
│   ├── endpoints.ts        # API endpoint definitions
│   └── env.ts              # Environment variable schema (Zod validated)
│
├── lib/
│   ├── api.ts              # Axios instance & API types
│   └── utils.ts            # Utility functions (cn, etc.)
│
├── modules/                # Feature modules (domain-driven)
│   ├── auth/
│   │   └── pages/
│   │       └── login.tsx   # Login page component
│   └── landing/
│       └── pages/
│           └── landing.tsx # Landing page component
│
├── providers/
│   └── auth-provider.tsx   # Authentication context provider
│
├── services/
│   ├── index.ts            # Services barrel export
│   └── auth/
│       └── auth-services.ts # Auth API calls
│
├── store/
│   ├── index.ts            # Store barrel export
│   └── user-store.ts       # User state (Zustand)
│
└── types/
    ├── index.ts            # Types barrel export
    └── user-types.ts       # User type definitions
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+ or [Bun](https://bun.sh) 1.0+
- A backend API with authentication endpoints (see [API Requirements](#api-requirements))

### Installation

```bash
# Clone the template
git clone <repository-url> my-app
cd my-app

# Install dependencies (using Bun)
bun install

# Or with npm/pnpm/yarn
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

The environment variables are validated at runtime using Zod. If `NEXT_PUBLIC_API_BASE_URL` is missing or invalid, the app will throw an error on startup.

### Development

```bash
# Start development server
bun dev

# Or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Configuration

### Environment Variables

Defined in `src/config/env.ts`:

```typescript
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
```

Add new environment variables by extending the `envSchema`.

### API Endpoints

Defined in `src/config/endpoints.ts`:

```typescript
export const endpoints = {
  auth: {
    google: {
      query: "googleOauth",
      endpoint: "/v1/oauth/google",
    },
    me: {
      query: "me",
      endpoint: "/v1/auth/me",
    },
    logout: {
      query: "logout",
      endpoint: "/v1/auth/logout",
    },
  },
};
```

Each endpoint object contains:

- `query`: TanStack Query key identifier
- `endpoint`: API path (appended to `NEXT_PUBLIC_API_BASE_URL`)

---

## Authentication

The template includes a complete authentication flow:

### Flow Overview

1. **Landing Page** → Checks if user is logged in via `AuthProvider`
2. **Login Page** → Initiates Google OAuth flow
3. **OAuth Callback** → Backend handles OAuth, sets HTTP-only cookies
4. **Auth Check** → `AuthProvider` fetches `/v1/auth/me` on app load
5. **User State** → Stored in Zustand's `useUserStore`

### AuthProvider

Located at `src/providers/auth-provider.tsx`:

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserStore();

  const { data } = useQuery({
    queryKey: [endpoints.auth.me.query],
    queryFn: AuthServices.getMe,
  });

  useEffect(() => {
    if (data?.data.payload.user.email) {
      setUser(data?.data.payload.user);
    }
  }, [data?.data.payload.user]);

  return <>{children}</>;
}
```

### User Store

Located at `src/store/user-store.ts`:

```typescript
import { create } from "zustand";
import { User } from "@/types";

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
}>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
```

### Usage in Components

```typescript
import { useUserStore } from "@/store";

function MyComponent() {
  const { user, setUser } = useUserStore();

  if (user) {
    return <p>Welcome, {user.firstName}!</p>;
  }

  return <p>Please log in</p>;
}
```

---

## API Layer

### Axios Instance

Located at `src/lib/api.ts`:

```typescript
import axios from "axios";
import { env } from "@/config/env";

export interface APIResponse<T> {
  message: string;
  payload: T;
}

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Required for HTTP-only cookies
});
```

### Creating Services

Services are organized by domain in `src/services/`. Example:

```typescript
// src/services/auth/auth-services.ts
import { api, APIResponse } from "@/lib/api";
import { endpoints } from "@/config/endpoints";

export namespace AuthServices {
  export function getGoogleAuthUrl() {
    return api.get<APIResponse<{ link: string }>>(endpoints.auth.google.endpoint);
  }

  export function getMe() {
    return api.get<APIResponse<{ user: User }>>(endpoints.auth.me.endpoint);
  }

  export function logout() {
    return api.get<APIResponse<null>>(endpoints.auth.logout.endpoint);
  }
}
```

### Using with TanStack Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthServices } from "@/services";
import { endpoints } from "@/config";

// Query example
const { data, isLoading } = useQuery({
  queryKey: [endpoints.auth.me.query],
  queryFn: AuthServices.getMe,
});

// Mutation example
const loginMutation = useMutation({
  mutationKey: [endpoints.auth.google.query],
  mutationFn: AuthServices.getGoogleAuthUrl,
  onSuccess: (data) => {
    window.location.assign(data.data.payload.link);
  },
});
```

---

## API Requirements

Your backend API should implement these endpoints:

| Method | Endpoint           | Request     | Response                                 |
| ------ | ------------------ | ----------- | ---------------------------------------- |
| `GET`  | `/v1/oauth/google` | -           | `{ message, payload: { link: string } }` |
| `GET`  | `/v1/auth/me`      | Cookie auth | `{ message, payload: { user: User } }`   |
| `GET`  | `/v1/auth/logout`  | Cookie auth | `{ message, payload: null }`             |

### Expected User Type

```typescript
type User = {
  email: string;
  firstName: string;
  lastName?: string;
};
```

---

## UI Components

The template uses [shadcn/ui](https://ui.shadcn.com) with the **base-lyra** style and [Hugeicons](https://hugeicons.com).

### Available Components

| Component      | File                | Description                                                                 |
| -------------- | ------------------- | --------------------------------------------------------------------------- |
| `Button`       | `button.tsx`        | Primary action button with variants, sizes, loading state, and icon support |
| `Input`        | `input.tsx`         | Text input field                                                            |
| `Textarea`     | `textarea.tsx`      | Multi-line text input                                                       |
| `Select`       | `select.tsx`        | Dropdown select                                                             |
| `Combobox`     | `combobox.tsx`      | Searchable select                                                           |
| `Card`         | `card.tsx`          | Content container                                                           |
| `Badge`        | `badge.tsx`         | Status/label badge                                                          |
| `Label`        | `label.tsx`         | Form label                                                                  |
| `Field`        | `field.tsx`         | Form field wrapper                                                          |
| `InputGroup`   | `input-group.tsx`   | Input with addons                                                           |
| `Separator`    | `separator.tsx`     | Visual divider                                                              |
| `Spinner`      | `spinner.tsx`       | Loading indicator                                                           |
| `AlertDialog`  | `alert-dialog.tsx`  | Confirmation dialog                                                         |
| `DropdownMenu` | `dropdown-menu.tsx` | Action menu                                                                 |

### Button Example

```tsx
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@hugeicons/core-free-icons";

// Basic
<Button>Click me</Button>

// With icon
<Button icon={GoogleIcon}>Login with Google</Button>

// Loading state
<Button loading={isLoading}>Submit</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Adding New Components

Use shadcn CLI to add components:

```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add toast
```

---

## Styling

### Tailwind CSS 4

The template uses Tailwind CSS 4 with CSS variables for theming.

### Theme Customization

Colors are defined in `src/app/globals.css` using OKLCH color space:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... more colors */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode colors */
}
```

### Utility Functions

The `cn()` utility combines `clsx` and `tailwind-merge`:

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-classes", isActive && "active-classes", className)} />;
```

### Fonts

The template includes:

- **JetBrains Mono** - Primary sans font (`--font-sans`)
- **Geist Sans** - Secondary sans (`--font-geist-sans`)
- **Geist Mono** - Monospace (`--font-geist-mono`)

---

## Module Architecture

### Adding a New Feature Module

1. **Create the module directory:**

```
src/modules/
└── dashboard/
    ├── pages/
    │   └── dashboard.tsx
    ├── components/
    │   └── stats-card.tsx
    └── hooks/
        └── use-dashboard-data.ts
```

2. **Create the page component:**

```tsx
// src/modules/dashboard/pages/dashboard.tsx
"use client";

export function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}
```

3. **Add the route:**

```tsx
// src/app/dashboard/page.tsx
import { DashboardPage } from "@/modules/dashboard/pages/dashboard";

export default function Page() {
  return <DashboardPage />;
}
```

---

## Adding New API Services

1. **Define endpoints:**

```typescript
// src/config/endpoints.ts
export const endpoints = {
  // ... existing
  posts: {
    list: {
      query: "postsList",
      endpoint: "/v1/posts",
    },
    create: {
      query: "postsCreate",
      endpoint: "/v1/posts",
    },
  },
};
```

2. **Create the service:**

```typescript
// src/services/posts/posts-services.ts
import { api, APIResponse } from "@/lib/api";
import { endpoints } from "@/config/endpoints";

export type Post = {
  id: string;
  title: string;
  content: string;
};

export namespace PostsServices {
  export function list() {
    return api.get<APIResponse<{ posts: Post[] }>>(endpoints.posts.list.endpoint);
  }

  export function create(data: { title: string; content: string }) {
    return api.post<APIResponse<{ post: Post }>>(endpoints.posts.create.endpoint, data);
  }
}
```

3. **Export from barrel:**

```typescript
// src/services/index.ts
export * from "./auth/auth-services";
export * from "./posts/posts-services";
```

---

## Scripts

| Command     | Description              |
| ----------- | ------------------------ |
| `bun dev`   | Start development server |
| `bun build` | Build for production     |
| `bun start` | Start production server  |
| `bun lint`  | Run ESLint               |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab/Bitbucket
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Docker

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["bun", "server.js"]
```

---

## Best Practices

### ✅ Do

- Keep components in `modules/` for feature-specific UI
- Use `services/` for all API calls
- Define all endpoints in `config/endpoints.ts`
- Use Zod for runtime validation
- Leverage TanStack Query for server state
- Use Zustand for client state

### ❌ Avoid

- Making API calls directly in components
- Hardcoding API URLs
- Storing sensitive data in client state
- Skipping TypeScript types

---

## License

MIT © Ravix Studio
