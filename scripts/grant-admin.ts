/**
 * Grants a role to an existing account by writing Firebase custom claims.
 *
 * Role management normally goes through the `setUserRoles` Cloud Function,
 * which needs an admin caller. This script solves the chicken-and-egg problem
 * for the very first administrator.
 *
 * Emulator:
 *   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run grant:admin -- admin@example.com
 *
 * Production (requires Application Default Credentials):
 *   gcloud auth application-default login
 *   FIREBASE_PROJECT_ID=your-project npm run grant:admin -- you@company.com
 *   # or: GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run grant:admin -- you@company.com
 */
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const ROLES = ['admin', 'editor', 'user'] as const
type Role = (typeof ROLES)[number]

const [email, roleArgument = 'admin'] = process.argv.slice(2)

if (!email) {
  console.error('Usage: npm run grant:admin -- <email> [admin|editor|user]')
  process.exit(1)
}

if (!ROLES.includes(roleArgument as Role)) {
  console.error(`Unknown role "${roleArgument}". Use one of: ${ROLES.join(', ')}`)
  process.exit(1)
}

const role = roleArgument as Role
const projectId = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_PROJECT_ID
const usingEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST)

if (!usingEmulator && !projectId) {
  console.error('Set FIREBASE_PROJECT_ID (or GCLOUD_PROJECT) before running against production.')
  process.exit(1)
}

const app = initializeApp({
  projectId,
  ...(usingEmulator ? {} : { credential: applicationDefault() }),
})

const auth = getAuth(app)
const db = getFirestore(app)

async function main() {
  const user = await auth.getUserByEmail(email)
  const existingClaims = user.customClaims ?? {}
  const currentRoles = Array.isArray(existingClaims.roles) ? existingClaims.roles : []
  const nextRoles = [...new Set([...currentRoles, role])]

  await auth.setCustomUserClaims(user.uid, { ...existingClaims, roles: nextRoles })
  await db.doc(`users/${user.uid}`).set(
    {
      roles: nextRoles,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  console.log(`\n${email} (${user.uid}) now has roles: ${nextRoles.join(', ')}`)
  console.log('The member must refresh their session (or sign in again) to receive fresh claims.\n')
}

main().catch((error: unknown) => {
  console.error('\nCould not grant the role.')
  console.error(error)
  console.error('\nCheck the email address and your credentials, then try again.\n')
  process.exitCode = 1
})
