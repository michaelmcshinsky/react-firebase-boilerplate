# Firebase setup

## 1. Create the project

1. <https://console.firebase.google.com> → **Add project**.
2. **Authentication → Sign-in method**: enable **Email/Password**. Enable
   **Google** if you want the social button to work.
3. **Firestore Database** → **Create database** → production mode → choose a
   region close to your users.
4. **Storage** → **Get started** (needed for avatar uploads).
5. **Project settings → Your apps → Web** → register an app and copy the config.

## 2. Configure the client

```bash
cp .env.example .env
```

Fill in the values from the web app config:

```
VITE_FIREBASE_API_KEY=…
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=…
VITE_FIREBASE_APP_ID=…
```

These values are public by design. Access is controlled by Security Rules.

## 3. Deploy rules and indexes

```bash
cp .firebaserc.example .firebaserc   # set your project id
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## 4. Deploy functions

Functions require the Blaze plan.

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

Deployed functions:

| Function        | Type              | Purpose                                        |
| --------------- | ----------------- | ---------------------------------------------- |
| `onUserCreated` | auth trigger (v1) | Creates `users/{uid}` with the `user` role     |
| `onUserDeleted` | auth trigger (v1) | Marks the profile inactive                     |
| `setUserRoles`  | callable (v2)     | Writes custom claims + mirrors roles           |
| `deleteUser`    | callable (v2)     | Deletes the auth account and profile           |
| `seed`          | HTTP (v2)         | Seeds demo posts/products (admin bearer token) |

## 5. Create the first administrator

New accounts start as `user`, and only admins can promote accounts. Bootstrap
the first admin with the grant script:

```bash
gcloud auth application-default login
FIREBASE_PROJECT_ID=your-project npm run grant:admin -- you@company.com
```

With a service account instead:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
  npm run grant:admin -- you@company.com editor
```

Claim changes apply to the user's **next ID token refresh**. ID tokens are
cached for ~1 hour and only refreshed on sign-in, reload after expiry, or an
explicit `getIdToken(true)` force-refresh, so a role change can take up to
~1 hour to reach an already-signed-in client. Three ways to close the gap:

- **Fast path (recommended):** after `setUserRoles` resolves, call
  `user.getIdToken(true)` — already wired into `AuthProvider.refresh()`
  (`src/app/providers/auth-provider.tsx`). Call `refresh()` right after a
  role change instead of making the user sign out.
- **Sign out and back in** — always works, but it's a poor UX for routine
  role edits.
- **Wait it out** — tokens refresh automatically; worst case is ~1 hour.

Note the delay is on the **client side only**: Firestore rules read
`request.auth.token.roles` from the token the client presents, so a stale
token also means stale rule evaluation. The Admin SDK mirror
(`users/{uid}.roles`) is written immediately and is only for display —
it never grants access.

## 6. Local development with the emulator suite

```bash
npm run emulators   # Auth 9099, Firestore 8085, Functions 5001, Storage 9199
```

In `.env`:

```
VITE_USE_EMULATORS=true
```

Then seed demo accounts and content:

```bash
npm run seed
```

| Account            | Password    | Role   |
| ------------------ | ----------- | ------ |
| admin@example.com  | password123 | admin  |
| editor@example.com | password123 | editor |
| member@example.com | password123 | user   |

## 7. Deploy the site

Firebase Hosting:

```bash
npm run deploy
```

Netlify: `netlify.toml` builds with `npm run build`, publishes `dist` and adds
the SPA fallback. Add the `VITE_FIREBASE_*` variables in the Netlify UI.

## Troubleshooting

| Symptom                               | Cause                                                  |
| ------------------------------------- | ------------------------------------------------------ |
| Setup screen instead of the app       | `VITE_FIREBASE_*` missing, or dev server not restarted |
| `Missing or insufficient permissions` | Rules not deployed, or custom claims not refreshed     |
| “That Cloud Function is not deployed” | Functions not deployed / emulator not running          |
| Role change does nothing              | Sign out and back in to refresh the ID token           |
| Avatar upload fails                   | Storage rules not deployed, or file > 2 MB             |
| Composite index error                 | Run `firebase deploy --only firestore:indexes`         |
