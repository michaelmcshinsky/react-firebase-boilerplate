/**
 * Security-rule tests. These run against the Firestore emulator:
 *
 *   npm run test:rules
 *
 * The suite proves that custom claims drive every access decision, that the
 * mirrored profile document cannot be used to escalate privileges, and that
 * the catch-all rule denies anything not explicitly allowed.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { deleteDoc, doc, getDoc, setDoc, updateDoc, type Firestore } from 'firebase/firestore'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

let environment: RulesTestEnvironment

const PROJECT_ID = 'demo-rfb-rules'

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(path.resolve('firestore.rules'), 'utf8'),
    },
  })
})

afterAll(async () => {
  await environment.cleanup()
})

beforeEach(async () => {
  await environment.clearFirestore()
})

function anonymous(): Firestore {
  return environment.unauthenticatedContext().firestore() as unknown as Firestore
}

function as(uid: string, roles: string[] = ['user']): Firestore {
  return environment.authenticatedContext(uid, { roles }).firestore() as unknown as Firestore
}

async function seed(run: (db: Firestore) => Promise<void>) {
  await environment.withSecurityRulesDisabled(async (context) => {
    await run(context.firestore() as unknown as Firestore)
  })
}

async function seedUser(uid: string, roles: string[] = ['user']) {
  await seed((db) =>
    setDoc(doc(db, 'users', uid), {
      email: `${uid}@example.com`,
      displayName: uid,
      firstName: uid,
      lastName: '',
      photoURL: null,
      roles,
      active: true,
    }),
  )
}

async function seedPost(id: string, authorId: string, status: 'draft' | 'published' = 'draft') {
  await seed((db) =>
    setDoc(doc(db, 'posts', id), {
      title: `Post ${id}`,
      slug: `post-${id}`,
      summary: '',
      body: 'Body',
      status,
      tags: [],
      authorId,
      authorName: authorId,
    }),
  )
}

async function seedProduct(id: string, visibility: 'public' | 'private') {
  await seed((db) =>
    setDoc(doc(db, 'products', id), {
      name: `Product ${id}`,
      sku: id.toUpperCase(),
      description: '',
      price: 10,
      visibility,
    }),
  )
}

describe('users', () => {
  beforeEach(async () => {
    await seedUser('user-1')
    await seedUser('user-2')
    await seedUser('admin-1', ['admin'])
  })

  it('denies anonymous reads', async () => {
    await assertFails(getDoc(doc(anonymous(), 'users', 'user-1')))
  })

  it('lets a member read only their own profile', async () => {
    await assertSucceeds(getDoc(doc(as('user-1'), 'users', 'user-1')))
    await assertFails(getDoc(doc(as('user-1'), 'users', 'user-2')))
  })

  it('lets an admin read any profile', async () => {
    await assertSucceeds(getDoc(doc(as('admin-1', ['admin']), 'users', 'user-2')))
  })

  it('allows self sign-up with the least-privilege role', async () => {
    await assertSucceeds(
      setDoc(doc(as('new-member'), 'users', 'new-member'), {
        email: 'new@example.com',
        displayName: 'New member',
        roles: ['user'],
        active: true,
      }),
    )
  })

  it('rejects self sign-up that claims a privileged role', async () => {
    await assertFails(
      setDoc(doc(as('attacker'), 'users', 'attacker'), {
        email: 'attacker@example.com',
        displayName: 'Attacker',
        roles: ['admin'],
        active: true,
      }),
    )
  })

  it('lets a member edit their own profile fields', async () => {
    await assertSucceeds(updateDoc(doc(as('user-1'), 'users', 'user-1'), { displayName: 'Ada' }))
  })

  it('blocks privilege escalation through the profile document', async () => {
    await assertFails(updateDoc(doc(as('user-1'), 'users', 'user-1'), { roles: ['admin'] }))
    await assertFails(updateDoc(doc(as('user-1'), 'users', 'user-1'), { active: false }))
  })

  it('lets an admin change roles and delete members', async () => {
    const admin = as('admin-1', ['admin'])

    await assertSucceeds(updateDoc(doc(admin, 'users', 'user-2'), { roles: ['editor'] }))
    await assertFails(deleteDoc(doc(as('user-1'), 'users', 'user-2')))
    await assertSucceeds(deleteDoc(doc(admin, 'users', 'user-2')))
  })
})

describe('posts', () => {
  beforeEach(async () => {
    await seedUser('user-1')
    await seedUser('user-2')
    await seedUser('editor-1', ['editor'])
    await seedPost('published', 'user-2', 'published')
    await seedPost('draft', 'user-2', 'draft')
    await seedPost('mine', 'user-1', 'draft')
  })

  it('exposes published posts to anonymous readers only', async () => {
    await assertSucceeds(getDoc(doc(anonymous(), 'posts', 'published')))
    await assertFails(getDoc(doc(anonymous(), 'posts', 'draft')))
  })

  it('lets authors and staff read drafts', async () => {
    await assertSucceeds(getDoc(doc(as('user-1'), 'posts', 'mine')))
    await assertFails(getDoc(doc(as('user-1'), 'posts', 'draft')))
    await assertSucceeds(getDoc(doc(as('editor-1', ['editor']), 'posts', 'draft')))
  })

  it('accepts a well-formed self-authored post', async () => {
    await assertSucceeds(
      setDoc(doc(as('user-1'), 'posts', 'new'), {
        title: 'A new post',
        status: 'draft',
        authorId: 'user-1',
        tags: [],
      }),
    )
  })

  it('rejects forged authors and unknown statuses', async () => {
    await assertFails(
      setDoc(doc(as('user-1'), 'posts', 'forged'), {
        title: 'Forged',
        status: 'draft',
        authorId: 'user-2',
      }),
    )
    await assertFails(
      setDoc(doc(as('user-1'), 'posts', 'archived'), {
        title: 'Archived',
        status: 'archived',
        authorId: 'user-1',
      }),
    )
  })

  it('limits updates and deletes to the author or staff', async () => {
    await assertSucceeds(updateDoc(doc(as('user-1'), 'posts', 'mine'), { title: 'Mine' }))
    await assertFails(updateDoc(doc(as('user-1'), 'posts', 'draft'), { title: 'Hijacked' }))
    await assertSucceeds(
      updateDoc(doc(as('editor-1', ['editor']), 'posts', 'draft'), { title: 'OK' }),
    )

    await assertFails(deleteDoc(doc(as('user-1'), 'posts', 'draft')))
    await assertSucceeds(deleteDoc(doc(as('user-1'), 'posts', 'mine')))
  })
})

describe('products', () => {
  beforeEach(async () => {
    await seedUser('user-1')
    await seedUser('editor-1', ['editor'])
    await seedProduct('public-product', 'public')
    await seedProduct('private-product', 'private')
  })

  it('reads public products anonymously but not private ones', async () => {
    await assertSucceeds(getDoc(doc(anonymous(), 'products', 'public-product')))
    await assertFails(getDoc(doc(anonymous(), 'products', 'private-product')))
  })

  it('restricts writes to staff', async () => {
    const product = {
      name: 'New product',
      sku: 'NEW-01',
      description: '',
      price: 5,
      visibility: 'public',
    }

    await assertFails(setDoc(doc(as('user-1'), 'products', 'new'), product))
    await assertSucceeds(setDoc(doc(as('editor-1', ['editor']), 'products', 'new'), product))
    await assertFails(updateDoc(doc(as('user-1'), 'products', 'public-product'), { price: 1 }))
  })
})

describe('default deny', () => {
  it('denies collections that are not declared in the rules', async () => {
    await assertFails(getDoc(doc(anonymous(), 'secrets', 'one')))
    await assertFails(getDoc(doc(as('admin-1', ['admin']), 'secrets', 'one')))
  })
})
