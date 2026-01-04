# Roots Template

A production-ready Next.js 16 admin dashboard template by **Ravix Studio** with built-in authentication, role-based access control, data tables with pagination, and a curated component library.

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
| **Data Tables**      | [TanStack Table](https://tanstack.com/table)                                          |
| **HTTP Client**      | [Axios](https://axios-http.com)                                                       |
| **Validation**       | [Zod](https://zod.dev)                                                                |
| **Package Manager**  | [Bun](https://bun.sh)                                                                 |

---

## Features

- 🔐 **Authentication** - Google OAuth with HTTP-only cookie sessions
- 👥 **Role-Based Access Control** - Admin/User roles with protected routes
- 📊 **Data Tables** - TanStack Table with server-side pagination
- 🎨 **Modern UI** - shadcn/ui components with Base UI primitives
- 📱 **Responsive Sidebar** - Collapsible navigation with keyboard shortcuts
- 🌙 **Dark Mode Ready** - CSS variables with OKLCH color space
- ⚡ **Type-Safe** - End-to-end TypeScript with Zod validation
- 🏗️ **Modular Architecture** - Feature-based module structure

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (private)/              # Protected routes (requires auth + admin role)
│   │   ├── layout.tsx          # Private layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── providers.tsx           # Client-side providers
│   └── globals.css             # Global styles & CSS variables
│
├── assets/                     # Static assets (images, fonts)
│
├── components/
│   ├── navigation/
│   │   └── app-sidebar.tsx     # Main sidebar component
│   └── ui/                     # Reusable UI components (shadcn-based)
│       ├── button.tsx
│       ├── table.tsx
│       ├── pagination.tsx
│       ├── sidebar.tsx
│       └── ...
│
├── config/
│   ├── index.ts                # Config barrel export
│   ├── endpoints.ts            # API endpoint definitions
│   └── env.ts                  # Environment variable schema (Zod)
│
├── hooks/
│   └── use-mobile.tsx          # Mobile detection hook
│
├── lib/
│   ├── api.ts                  # Axios instance & API types
│   └── utils.ts                # Utility functions (cn, getInitials)
│
├── modules/                    # Feature modules (domain-driven)
│   ├── auth/
│   │   └── pages/
│   │       └── login.tsx
│   └── users/
│       ├── components/
│       │   └── users-list-table.tsx
│       └── pages/
│           └── users.tsx
│
├── providers/
│   └── auth-provider.tsx       # Authentication context provider
│
├── services/
│   ├── index.ts                # Services barrel export
│   ├── auth-services.ts        # Auth API calls
│   └── user-services.ts        # User API calls
│
├── store/
│   ├── index.ts                # Store barrel export
│   └── user-store.ts           # User state (Zustand)
│
└── types/
    ├── index.ts                # Types barrel export
    └── user-types.ts           # User type definitions
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
  users: {
    getAll: {
      query: "getAllUsers",
      endpoint: "/v1/users",
    },
  },
};
```

Each endpoint object contains:

- `query`: TanStack Query key identifier
- `endpoint`: API path (appended to `NEXT_PUBLIC_API_BASE_URL`)

---

## Authentication & Authorization

### User Roles

```typescript
// src/types/user-types.ts
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export type User = {
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
};
```

### Authentication Flow

1. **Landing Page** → Checks if user is logged in via `AuthProvider`
2. **Login Page** → Initiates Google OAuth flow
3. **OAuth Callback** → Backend handles OAuth, sets HTTP-only cookies
4. **Auth Check** → `AuthProvider` fetches `/v1/auth/me` on app load
5. **User State** → Stored in Zustand's `useUserStore`

### AuthProvider

Located at `src/providers/auth-provider.tsx`:

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useUserStore();

  const { data } = useQuery({
    queryKey: [endpoints.auth.me.query],
    queryFn: AuthServices.getMe,
  });

  useEffect(() => {
    if (data?.data.payload.user.email) {
      setUser(data?.data.payload.user);
    }
    setIsLoading(false);
  }, [data?.data.payload.user]);

  return <>{children}</>;
}
```

### Protected Routes

The `(private)` route group requires authentication and admin role:

```typescript
// src/app/(private)/layout.tsx
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if ((!user && !isLoading) || (user && user.role !== UserRole.ADMIN)) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-svh">
        <header>...</header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
```

### User Store

Located at `src/store/user-store.ts`:

```typescript
import { create } from "zustand";
import { User } from "@/types";

export const useUserStore = create<{
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
```

---

## Data Tables

The template includes TanStack Table with server-side pagination.

### Basic Table with Pagination

```typescript
// src/modules/users/components/users-list-table.tsx
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UsersListTableProps {
  users: User[];
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
}

export function UsersListTable({ users, pagination, onPageChange }: UsersListTableProps) {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>...</Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => onPageChange?.(pagination.page - 1)} />
              </PaginationItem>
              {/* Page numbers with ellipsis */}
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange?.(pagination.page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
```

### Using with React Query

```typescript
// src/modules/users/pages/users.tsx
const PAGE_SIZE = 10;

export function UsersPage() {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: [endpoints.users.getAll.query, page],
    queryFn: () => UserServices.getAllUsers({ page, limit: PAGE_SIZE }),
  });

  return (
    <UsersListTable
      users={data?.data.payload.users || []}
      pagination={data?.data.payload.pagination}
      onPageChange={setPage}
    />
  );
}
```

---

## Sidebar Navigation

The template includes a collapsible sidebar with:

- Brand header
- Navigation groups with active state
- User dropdown with logout
- Keyboard shortcut (⌘B) to toggle

### Adding Navigation Items

```typescript
// src/components/navigation/app-sidebar.tsx
const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Users",
    href: "/users",
    icon: People,
  },
];

const settingsNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings01Icon,
  },
];
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Required for HTTP-only cookies
});
```

### Creating Services

Services are organized by domain in `src/services/`:

```typescript
// src/services/user-services.ts
import { api, APIResponse, Pagination } from "@/lib/api";
import { endpoints } from "@/config";
import { User } from "@/types";

export namespace UserServices {
  export function getAllUsers({ page, limit }: { page: number; limit: number }) {
    return api.get<APIResponse<{ users: User[]; pagination: Pagination }>>(
      endpoints.users.getAll.endpoint,
      { params: { page, limit } },
    );
  }
}
```

---

## API Requirements

Your backend API should implement these endpoints:

### Authentication

| Method | Endpoint           | Request     | Response                                 |
| ------ | ------------------ | ----------- | ---------------------------------------- |
| `GET`  | `/v1/oauth/google` | -           | `{ message, payload: { link: string } }` |
| `GET`  | `/v1/auth/me`      | Cookie auth | `{ message, payload: { user: User } }`   |
| `GET`  | `/v1/auth/logout`  | Cookie auth | `{ message, payload: null }`             |

### Users

| Method | Endpoint    | Query Params    | Response                                                          |
| ------ | ----------- | --------------- | ----------------------------------------------------------------- |
| `GET`  | `/v1/users` | `page`, `limit` | `{ message, payload: { users: User[], pagination: Pagination } }` |

### Expected Types

```typescript
// User
type User = {
  email: string;
  firstName: string;
  lastName?: string;
  role: "admin" | "user";
  avatar?: string;
};

// Pagination
type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
```

---

## UI Components

The template uses [shadcn/ui](https://ui.shadcn.com) with the **base-lyra** style and [Hugeicons](https://hugeicons.com).

### Available Components

| Component      | File                | Description                         |
| -------------- | ------------------- | ----------------------------------- |
| `Button`       | `button.tsx`        | Action button with variants & icons |
| `Input`        | `input.tsx`         | Text input field                    |
| `Textarea`     | `textarea.tsx`      | Multi-line text input               |
| `Select`       | `select.tsx`        | Dropdown select                     |
| `Combobox`     | `combobox.tsx`      | Searchable select                   |
| `Table`        | `table.tsx`         | Data table components               |
| `Pagination`   | `pagination.tsx`    | Pagination controls                 |
| `Sidebar`      | `sidebar.tsx`       | Collapsible sidebar                 |
| `Card`         | `card.tsx`          | Content container                   |
| `Badge`        | `badge.tsx`         | Status/label badge                  |
| `Avatar`       | `avatar.tsx`        | User avatar with fallback           |
| `DropdownMenu` | `dropdown-menu.tsx` | Action menu                         |
| `AlertDialog`  | `alert-dialog.tsx`  | Confirmation dialog                 |
| `Tooltip`      | `tooltip.tsx`       | Hover tooltip                       |
| `Skeleton`     | `skeleton.tsx`      | Loading placeholder                 |
| `Spinner`      | `spinner.tsx`       | Loading indicator                   |

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

```typescript
import { cn } from "@/lib/utils";

// Combine classes conditionally
<div className={cn("base-classes", isActive && "active-classes", className)} />;

// Get user initials
import { getInitials } from "@/lib/utils";
getInitials("John", "Doe"); // "JD"
```

### Fonts

- **JetBrains Mono** - Primary sans font (`--font-sans`)
- **Geist Sans** - Secondary sans (`--font-geist-sans`)
- **Geist Mono** - Monospace (`--font-geist-mono`)

---

## Module Architecture

### Adding a New Feature Module

1. **Create the module directory:**

```
src/modules/
└── products/
    ├── pages/
    │   └── products.tsx
    ├── components/
    │   └── products-table.tsx
    └── hooks/
        └── use-products.ts
```

2. **Create the service:**

```typescript
// src/services/product-services.ts
export namespace ProductServices {
  export function getAll({ page, limit }: { page: number; limit: number }) {
    return api.get<APIResponse<{ products: Product[]; pagination: Pagination }>>(
      endpoints.products.getAll.endpoint,
      { params: { page, limit } },
    );
  }
}
```

3. **Add endpoints:**

```typescript
// src/config/endpoints.ts
export const endpoints = {
  // ... existing
  products: {
    getAll: {
      query: "getAllProducts",
      endpoint: "/v1/products",
    },
  },
};
```

4. **Add the route:**

```tsx
// src/app/(private)/products/page.tsx
import { ProductsPage } from "@/modules/products/pages/products";

export default function Page() {
  return <ProductsPage />;
}
```

5. **Add to sidebar:**

```typescript
// src/components/navigation/app-sidebar.tsx
const mainNavItems = [
  // ... existing
  {
    title: "Products",
    href: "/products",
    icon: ShoppingCartIcon,
  },
];
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
- Use TanStack Table for data tables
- Include pagination for list endpoints

### ❌ Avoid

- Making API calls directly in components
- Hardcoding API URLs
- Storing sensitive data in client state
- Skipping TypeScript types
- Client-side pagination for large datasets

---

## License

MIT © Ravix Studio
