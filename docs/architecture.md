# Architecture

The starter is organised by feature, not by file type. Each feature owns its
page, form schema, dialogs and table columns. Cross-cutting code lives in
`lib`, `hooks`, `services` and `components`.

```
src/
├── app/            bootstrap, providers, router
├── components/     reusable UI (Radix primitives + layout)
├── features/       one folder per product area
├── hooks/          generic React hooks
├── lib/            pure helpers + Firebase SDK wrappers
├── services/       Firestore reads and writes
├── styles/         Tailwind theme tokens
└── types/          shared domain models
```

## Layers

### 1. Configuration (`src/app/config/env.ts`)

Environment variables are read once, validated for presence, and exported as a
typed object. `isFirebaseConfigured` lets the UI degrade gracefully instead of
crashing when a new clone has no credentials yet.

### 2. Firebase SDK wrappers (`src/lib/firebase/`)

| File            | Responsibility                                                  |
| --------------- | --------------------------------------------------------------- |
| `client.ts`     | Single app instance, emulator wiring, `requireFirebase()` guard |
| `converters.ts` | `Timestamp` ⇄ `Date`, drops `undefined` before writes           |
| `firestore.ts`  | Typed collection/document helpers + callable wrapper            |
| `auth.ts`       | Thin auth operations with no React state                        |
| `storage.ts`    | Avatar validation and upload                                    |

Nothing else imports `firebase/*` directly; swapping an implementation is a
one-folder change.

### 3. Services (`src/services/`)

Services are the only place that writes. They build queries, normalise payloads
(`slugify`, `serverTimestamp`, upper-cased SKUs) and call typed references. Pages
never construct a `collection()` or `doc()` themselves.

### 4. Hooks (`src/hooks/`)

`useCollection` and `useDocument` wrap `onSnapshot` with loading and error state.
Memoize the query in the caller:

```tsx
const query = useMemo(() => allPostsQuery(100), [])
const { data, loading, error } = useCollection(query)
```

### 5. Providers (`src/app/providers/`)

`AuthProvider` subscribes to `onAuthStateChanged`, loads the profile document,
reads custom claims from the ID token and exposes a single `useAuth()` value.
`ThemeProvider` applies the `dark` class before paint and persists the choice.
Contexts live in separate `.ts` files so React Fast Refresh keeps working.

### 6. Routing (`src/app/router/`)

`createBrowserRouter` with pathless guard routes:

```
RequireAuth → AppShell → Dashboard | Posts | Account | Settings
                       → RequireRole(admin, editor) → Products
                       → RequireRole(admin)         → Users
```

Every page except the landing screen is lazily imported, so the initial bundle
only contains React, the auth shell and the marketing page.

## Authorization

Custom claims are the only authority:

```
setUserRoles (Cloud Function)
   ├─ auth.setCustomUserClaims(uid, { roles })   ← rules read this
   └─ users/{uid}.roles = roles                  ← admin UI reads this
```

- Firestore rules call `request.auth.token.get('roles', [])`.
- The client reads claims from `getIdTokenResult()` and falls back to the profile
  document for display only.
- Route guards and `can()` helpers mirror the rules but never replace them.

Changing roles requires the callable function, so a tampered profile document
cannot grant access.

## Adding a feature

1. Add the model to `src/types/index.ts`.
2. Add a converter in `src/lib/firebase/firestore.ts`.
3. Create `src/services/<feature>.ts` with query + mutation functions.
4. Add a Zod schema in `src/features/<feature>/schema.ts`.
5. Build the page and dialog from existing `components/ui` primitives.
6. Register the route (lazy import) and wrap it in `RequireRole` if needed.
7. Update `firestore.rules` and `firestore.indexes.json`.
8. Add unit tests for schema, permissions and any pure helper; add an E2E test
   for the happy path.
