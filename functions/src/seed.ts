import { logger } from 'firebase-functions'
import { onRequest } from 'firebase-functions/v2/https'
import { FieldValue } from 'firebase-admin/firestore'

import { auth, callerIsAdmin, db } from './admin'

interface SeedDocument {
  collection: string
  id: string
  data: Record<string, unknown>
}

const SEEDS: SeedDocument[] = [
  {
    collection: 'posts',
    id: 'seed-welcome',
    data: {
      title: 'Welcome to the boilerplate',
      slug: 'welcome-to-the-boilerplate',
      summary: 'What ships in the box, and what to delete first.',
      body: 'This post is seeded data. Replace it with your own content, or delete it and start clean. Everything on this page is served from Firestore through a typed converter.',
      status: 'published',
      tags: ['welcome', 'guide'],
      authorId: 'seed',
      authorName: 'Seed script',
    },
  },
  {
    collection: 'posts',
    id: 'seed-auth',
    data: {
      title: 'How authorization actually works',
      slug: 'how-authorization-actually-works',
      summary: 'Custom claims, mirrored profiles and least-privilege rules.',
      body: 'Admins change roles through a callable function. The function writes custom claims, then mirrors them onto users/{uid}. Firestore rules read only the claims, so a stale profile document can never grant access.',
      status: 'published',
      tags: ['auth', 'security'],
      authorId: 'seed',
      authorName: 'Seed script',
    },
  },
  {
    collection: 'posts',
    id: 'seed-roadmap',
    data: {
      title: 'Roadmap draft',
      slug: 'roadmap-draft',
      summary: 'A draft only staff can read.',
      body: 'Drafts are hidden from anonymous readers by firestore.rules. Publish this one to see it become publicly readable.',
      status: 'draft',
      tags: ['internal'],
      authorId: 'seed',
      authorName: 'Seed script',
    },
  },
  {
    collection: 'products',
    id: 'seed-studio',
    data: {
      name: 'Studio licence',
      sku: 'STUDIO-01',
      description: 'Single-seat licence used to demonstrate numeric fields and sorting.',
      price: 240,
      visibility: 'public',
    },
  },
  {
    collection: 'products',
    id: 'seed-team',
    data: {
      name: 'Team licence',
      sku: 'TEAM-05',
      description: 'Five seats, private until you decide to publish it.',
      price: 960,
      visibility: 'private',
    },
  },
  {
    collection: 'products',
    id: 'seed-support',
    data: {
      name: 'Priority support',
      sku: 'SUPPORT-01',
      description: 'A small add-on product with a decimal price.',
      price: 49.5,
      visibility: 'public',
    },
  },
]

/**
 * POST /seed with `Authorization: Bearer <admin id token>`.
 * Idempotent: documents use fixed ids and are merged on every run.
 */
export const seed = onRequest({ region: 'us-central1', cors: true }, async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Use POST.' })
    return
  }

  const header = request.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''

  if (!token) {
    response.status(401).json({ error: 'Missing bearer token.' })
    return
  }

  let decoded
  try {
    decoded = await auth.verifyIdToken(token)
  } catch (error) {
    logger.warn('Seed rejected: invalid token', error)
    response.status(401).json({ error: 'Invalid or expired token.' })
    return
  }

  if (!callerIsAdmin(decoded)) {
    response.status(403).json({ error: 'Administrators only.' })
    return
  }

  const batch = db.batch()
  for (const seedDocument of SEEDS) {
    batch.set(
      db.collection(seedDocument.collection).doc(seedDocument.id),
      {
        ...seedDocument.data,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }

  await batch.commit()
  logger.info('Seed complete', { count: SEEDS.length, by: decoded.uid })

  response.status(200).json({ ok: true, seeded: SEEDS.length })
})
