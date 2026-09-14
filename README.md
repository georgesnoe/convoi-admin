# Convoi Admin

Admin dashboard for the Convoi platform. Built with React, TypeScript and Vite.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (with the React Compiler via the Babel plugin)
- **react-router 8** — routing
- **shadcn/ui** on top of **@base-ui/react** — UI components
- **Tailwind CSS v4** — styling
- **zod 4** — schema validation (forms + environment variables)
- **sonner** — toasts
- **@tabler/icons-react** — icons
- **bun** — package manager / runtime

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or npm)

### Installation

```bash
bun install
```

### Environment variables

Create a `.env` file at the project root:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

| Variable            | Description                 | Default                 |
| ------------------- | --------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:8080` |

The environment is validated at startup by `src/lib/env.ts` (zod). The app throws if `VITE_API_BASE_URL` is missing or not a valid URL.

### Development

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Preview the production build

```bash
bun run preview
```

### Lint & format

```bash
bun run lint
bun run lint:fix
bun run format
bun run format:check
```

## Project structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, card, field, input, ...)
│   ├── logo.tsx            # Shared app logo
│   └── require-auth.tsx    # Route guard
├── lib/
│   ├── api.ts              # API client (fetch wrapper, credentials: "include")
│   └── env.ts              # Zod validation of environment variables
├── routes/
│   ├── sign-in.tsx         # Sign-in page
│   ├── sign-up.tsx         # Sign-up page
│   └── dashboard.tsx       # Dashboard (protected)
├── routes.tsx              # Router definition
└── main.tsx                # App entry point
```

## Routes

| Path         | Description                          | Protected |
| ------------ | ------------------------------------ | --------- |
| `/`          | Redirects to `/dashboard`            | —         |
| `/sign-in`   | Sign-in form                         | No        |
| `/sign-up`   | Sign-up form (name, email, password) | No        |
| `/dashboard` | Dashboard ("Hello world" for v0)     | Yes       |

## Backend

The backend API is implemented in a separate repository:

- **Repository:** [georgesnoe/convoi-backend](https://github.com/georgesnoe/convoi-backend)

It exposes the endpoints consumed by this admin app (see [API integration](#api-integration)) and sets the session cookies that this app sends back with `credentials: "include"`.

## API integration

All requests go through `src/lib/api.ts` and include `credentials: "include"`, so the session cookies set by the server are sent with every request.

| Endpoint            | Method | Body                        | Used by      |
| ------------------- | ------ | --------------------------- | ------------ |
| `/api/auth/sign-in` | POST   | `{ email, password }`       | Sign-in form |
| `/api/auth/sign-up` | POST   | `{ name, email, password }` | Sign-up form |
| `/api/users/me`     | GET    | —                           | Route guard  |

The auth functions return the raw `Response`; the forms treat `status === 200` as success and redirect to `/dashboard`.

## Auth guard

`RequireAuth` wraps the `/dashboard` route. On mount it calls `GET /api/users/me`; if the response is not `ok` (e.g. 401), the user is redirected to `/sign-in`. Children are rendered immediately and never unmounted during the request, so page state is preserved.
