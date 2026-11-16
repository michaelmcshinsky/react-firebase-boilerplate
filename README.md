# React Firebase Boilerplate

> A production-minded React 19 + Firebase starter kit with authentication, role-based access control, typed Firestore CRUD and a polished admin dashboard that already looks finished.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Firebase Modular SDK · Cloud Functions v2 · Vitest · Playwright

---

## What's Included

### Authentication

- Email/password registration and sign-in
- Google OAuth provider
- Password reset flow
- Email verification with resend
- Session persistence
- Protected routes with loading states

### Authorization (RBAC)

- Custom claims: `admin`, `editor`, `user`
- Claims enforced in Firestore rules (source of truth)
- Mirrored to user profiles for UI display
- Route-level guards (`RequireAuth`, `RequireRole`)
- Component-level helpers (`hasRole`, `can`, `canManageContent`)

### Admin Dashboard

- Responsive shell with collapsible sidebar
- Light/dark/system theme with persistence
- Sortable, filterable, paginated data tables (TanStack Table)
- Create/edit/delete dialogs with validation (React Hook Form + Zod)
- Toast notifications (Sonner)
- Empty, loading, and error states

### Data Layer

- Typed Firestore converters (timestamps → `Date`)
- Streaming hooks: `useCollection`, `useDocument`
- Service modules own all writes (`services/posts.ts`, `services/products.ts`, `services/users.ts`)
- Optimistic UI updates

### Firebase

- Modular SDK initialization with emulator support
- Firestore security rules (least privilege)
- Storage rules (avatar uploads)
- Cloud Functions v2: `setUserRoles`, `deleteUser`, `seed`
- Auth triggers: profile creation on sign-up, deactivation on delete
- Emulator-ready seed script (`npm run emulators && npm run seed`)

### Quality Gates

- Strict TypeScript (`verbatimModuleSyntax`, `erasableSyntaxOnly`)
- ESLint + Prettier with Tailwind plugin
- Vitest + Testing Library (unit)
- Playwright (E2E smoke tests)
- GitHub Actions CI pipeline

---

## Quick Start

```bash
git clone https://github.com/michaelmcshinsky/react-firebase-boilerplate.git
cd react-firebase-boilerplate
npm install
cp .env.example .env   # add your Firebase web config
npm run dev
```

Open http://localhost:3000. The landing page explains the stack and links to the sign-up page.

---

## Environment Variables

| Variable                            | Required | Description                                      |
| ----------------------------------- | -------- | ------------------------------------------------ |
| `VITE_FIREBASE_API_KEY`             | Yes      | Firebase web API key                             |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Yes      | `your-project.firebaseapp.com`                   |
| `VITE_FIREBASE_PROJECT_ID`          | Yes      | Firebase project ID                              |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Yes      | `your-project.appspot.com`                       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes      | Sender ID from console                           |
| `VITE_FIREBASE_APP_ID`              | Yes      | Web app ID from console                          |
| `VITE_FIREBASE_MEASUREMENT_ID`      | No       | Analytics ID                                     |
| `VITE_USE_EMULATORS`                | No       | Set `true` to point at local emulators           |
| `VITE_APP_NAME`                     | No       | App name shown in sidebar (default: "Northstar") |

---

## Firebase Setup

1. **Create a Firebase project** at https://console.firebase.google.com
2. **Enable Authentication** → Sign-in method → Email/Password (+ Google if desired)
3. **Create Firestore database** → Production mode
4. **Enable Storage** → Get started
5. **Copy web app config** from Project Settings → Your apps
6. **Deploy rules & indexes** (optional but recommended):
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
7. **Deploy functions** (required for role management, seeding, account deletion):
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```
8. **Promote your account to admin** (new accounts start as `user`):
   ```bash
   gcloud auth application-default login
   FIREBASE_PROJECT_ID=your-project npm run grant:admin -- you@company.com
   ```

Full walkthrough: [`docs/firebase-setup.md`](docs/firebase-setup.md).

---

## Local Emulator Workflow

```bash
# Terminal 1: start emulators (Auth, Firestore, Functions, Storage, UI)
npm run emulators

# Terminal 2: seed demo accounts (admin@example.com / password123, etc.)
npm run seed

# Terminal 3: start Vite dev server
npm run dev
```

The seed script creates:

- `admin@example.com` (admin)
- `editor@example.com` (editor)
- `member@example.com` (user)
- Sample posts and products

---

## Project Structure

```
react-firebase-boilerplate/
├── functions/                 # Cloud Functions v2 (Node 22)
│   └── src/
│       ├── admin.ts           # Admin SDK init, role types
│       ├── auth-triggers.ts   # onCreate/onDelete profile sync
│       ├── admin-functions.ts # setUserRoles, deleteUser
│       ├── seed.ts            # HTTP seed endpoint
│       └── index.ts           # Exports
├── docs/                      # Architecture + Firebase setup guides
├── public/                    # Static assets, Netlify _redirects/_headers
├── src/
│   ├── app/
│   │   ├── config/env.ts      # Env validation + constants
│   │   ├── providers/         # AuthProvider, ThemeProvider, AppProviders
│   │   └── router/            # React Router + guards
│   ├── components/
│   │   ├── ui/                # shadcn-style primitives (Radix + Tailwind)
│   │   ├── forms/             # FormField wrapper
│   │   ├── layout/            # AppShell, SidebarNav, UserMenu
│   │   └── *.tsx              # DataTable, ConfirmDialog, EmptyState, etc.
│   ├── features/
│   │   ├── auth/              # Login, Register, ForgotPassword, schemas
│   │   ├── dashboard/         # DashboardPage with activity feed
│   │   ├── posts/             # PostsPage + PostFormDialog
│   │   ├── products/          # ProductsPage + ProductFormDialog
│   │   ├── users/             # UsersPage + MemberRolesDialog
│   │   ├── account/           # Profile, avatar, password change
│   │   ├── settings/          # Theme, env info, links
│   │   └── marketing/         # LandingPage, NotFoundPage
│   ├── hooks/                 # useCollection, useDocument, useAsyncAction, useDebouncedValue
│   ├── lib/
│   │   ├── firebase/          # client.ts, converters.ts, auth.ts, firestore.ts, storage.ts
│   │   ├── utils.ts           # cn, slugify, initials, formatCurrency
│   │   ├── dates.ts           # formatDate, formatRelative, formatDateTime
│   │   ├── errors.ts          # Friendly Firebase error messages
│   │   └── permissions.ts     # RBAC helpers
│   ├── services/              # Server writes (posts, products, users)
│   ├── styles/globals.css     # Tailwind v4 theme tokens
│   ├── types/index.ts         # Shared type definitions
│   ├── main.tsx               # App entry
│   └── test/setup.ts          # Vitest setup
├── e2e/                       # Playwright smoke tests
├── scripts/                   # Emulator seed + grant-admin (tsx)
├── netlify.toml               # Netlify build + SPA fallback
├── firebase.json              # Hosting, Functions, Emulators, Rules
├── firestore.rules            # Security rules
├── firestore.indexes.json     # Composite indexes
├── storage.rules              # Storage rules
└── vite.config.ts             # Vite + Tailwind plugin
```

---

## Available Scripts

| Command                                 | Description                            |
| --------------------------------------- | -------------------------------------- |
| `npm run dev`                           | Start Vite dev server                  |
| `npm run build`                         | Typecheck + production build           |
| `npm run preview`                       | Preview production build               |
| `npm run typecheck`                     | TypeScript build (no emit)             |
| `npm run lint`                          | ESLint with zero warnings              |
| `npm run format`                        | Prettier write                         |
| `npm run format:check`                  | Prettier check                         |
| `npm run test`                          | Vitest watch mode                      |
| `npm run test:run`                      | Vitest single run                      |
| `npm run test:coverage`                 | Vitest with coverage report            |
| `npm run e2e`                           | Playwright tests                       |
| `npm run emulators`                     | Firebase Emulator Suite                |
| `npm run seed`                          | Seed emulator with demo data           |
| `npm run grant:admin -- <email> [role]` | Write custom claims with the Admin SDK |
| `npm run deploy`                        | Build + `firebase deploy`              |

---

## Authorization Model

```
Custom Claims (source of truth) → Firestore Rules → Client UI
```

1. **Admin calls `setUserRoles(uid, ['editor'])`** → Cloud Function writes custom claims
2. **Same function mirrors roles to `users/{uid}.roles`** → For admin UI display
3. **Firestore rules read `request.auth.token.roles`** → Enforces access on every read/write
4. **Client reads claims via `useAuth()`** → Gates routes and UI elements

The profile document is **never trusted for access control** — it's only a mirror.

---

## Adding a New Feature

1. **Types** – Define models in `src/types/index.ts`
2. **Converters** – Add Firestore converter in `src/lib/firebase/converters.ts`
3. **Services** – Create `src/services/feature.ts` with queries and mutations
4. **Schemas** – Zod schemas in `src/features/feature/schema.ts`
5. **UI** – Page + dialog components in `src/features/feature/`
6. **Route** – Add to `src/app/router/router.tsx` with `RequireRole` if needed
7. **Rules** – Update `firestore.rules` and `firestore.indexes.json`
8. **Tests** – Add unit and E2E tests

---

## License

MIT © [Michael McShinsky](https://github.com/michaelmcshinsky)
