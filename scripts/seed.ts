/**
 * Seeds the local Firebase Emulator Suite with three accounts, role claims and
 * demo content. Requires the emulators to be running:
 *
 *   npm run emulators     # terminal 1
 *   npm run seed          # terminal 2
 *
 * Never run this against production: it refuses to start unless the emulator
 * environment variables point at localhost.
 */
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const projectId = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_PROJECT_ID ?? 'demo-boilerplate'

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099'

const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST

if (!firestoreHost.includes('127.0.0.1') && !firestoreHost.includes('localhost')) {
  throw new Error('Refusing to seed: FIRESTORE_EMULATOR_HOST is not localhost.')
}
if (!authHost.includes('127.0.0.1') && !authHost.includes('localhost')) {
  throw new Error('Refusing to seed: FIREBASE_AUTH_EMULATOR_HOST is not localhost.')
}

const app = initializeApp({ projectId })
const auth = getAuth(app)
const db = getFirestore(app)

type DemoRole = 'admin' | 'editor' | 'user'

const DEMO_USERS: Array<{
  email: string
  password: string
  displayName: string
  firstName: string
  lastName: string
  roles: DemoRole[]
}> = [
  {
    email: 'admin@example.com',
    password: 'password123',
    displayName: 'Ada Admin',
    firstName: 'Ada',
    lastName: 'Admin',
    roles: ['admin'],
  },
  {
    email: 'editor@example.com',
    password: 'password123',
    displayName: 'Eli Editor',
    firstName: 'Eli',
    lastName: 'Editor',
    roles: ['editor'],
  },
  {
    email: 'member@example.com',
    password: 'password123',
    displayName: 'Mia Member',
    firstName: 'Mia',
    lastName: 'Member',
    roles: ['user'],
  },
]

async function upsertUser(user: (typeof DEMO_USERS)[number]) {
  let uid: string

  try {
    const created = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      emailVerified: true,
    })
    uid = created.uid
  } catch {
    const existing = await auth.getUserByEmail(user.email)
    uid = existing.uid
  }

  await auth.setCustomUserClaims(uid, { roles: user.roles })
  await db.doc(`users/${uid}`).set(
    {
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      photoURL: null,
      roles: user.roles,
      active: true,
      emailVerified: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  return uid
}

async function seedContent(authorId: string, authorName: string) {
  const posts = [
    {
      id: 'seed-welcome',
      title: 'Welcome to the boilerplate',
      slug: 'welcome-to-the-boilerplate',
      summary: 'What ships in the box, and what to delete first.',
      body: 'This post is seeded data. Replace it with your own content, or delete it and start clean. Everything on the page is served from Firestore through a typed converter.',
      status: 'published',
      tags: ['welcome', 'guide'],
    },
    {
      id: 'seed-auth',
      title: 'How authorization actually works',
      slug: 'how-authorization-actually-works',
      summary: 'Custom claims, mirrored profiles and least-privilege rules.',
      body: 'Admins change roles through a callable function. It writes custom claims, then mirrors them onto users/{uid}. Firestore rules read only the claims, so a stale profile document can never grant access.',
      status: 'published',
      tags: ['auth', 'security'],
    },
    {
      id: 'seed-roadmap',
      title: 'Roadmap draft',
      slug: 'roadmap-draft',
      summary: 'A draft only staff can read.',
      body: 'Drafts are hidden from anonymous readers by firestore.rules. Publish this one to see it become publicly readable.',
      status: 'draft',
      tags: ['internal'],
    },
  ]

  const products = [
    {
      id: 'seed-studio',
      name: 'Studio licence',
      sku: 'STUDIO-01',
      description: 'Single-seat licence used to demonstrate numeric fields and sorting.',
      price: 240,
      visibility: 'public',
    },
    {
      id: 'seed-team',
      name: 'Team licence',
      sku: 'TEAM-05',
      description: 'Five seats, private until you decide to publish it.',
      price: 960,
      visibility: 'private',
    },
    {
      id: 'seed-support',
      name: 'Priority support',
      sku: 'SUPPORT-01',
      description: 'A small add-on product with a decimal price.',
      price: 49.5,
      visibility: 'public',
    },
  ]

  const batch = db.batch()

  for (const post of posts) {
    const { id, ...data } = post
    batch.set(db.collection('posts').doc(id), {
      ...data,
      authorId,
      authorName,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  for (const product of products) {
    const { id, ...data } = product
    batch.set(db.collection('products').doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
}

async function main() {
  console.log(`\nSeeding emulator project "${projectId}"…\n`)

  const seeded: Array<{ email: string; roles: DemoRole[]; uid: string }> = []

  for (const user of DEMO_USERS) {
    const uid = await upsertUser(user)
    seeded.push({ email: user.email, roles: user.roles, uid })
  }

  const admin = seeded.find((user) => user.roles.includes('admin'))
  if (admin) {
    await seedContent(admin.uid, 'Ada Admin')
  }

  console.table(
    seeded.map((user) => ({
      email: user.email,
      password: 'password123',
      roles: user.roles.join(', '),
      uid: user.uid,
    })),
  )

  console.log('\nDone. Sign in at http://localhost:3000 with any account above.\n')
}

main().catch((error: unknown) => {
  console.error('\nSeed failed.')
  console.error(error)
  console.error('\nIs the emulator suite running? Try: npm run emulators\n')
  process.exitCode = 1
})
