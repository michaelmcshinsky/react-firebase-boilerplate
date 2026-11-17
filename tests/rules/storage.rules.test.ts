/**
 * Storage-rule tests for avatar uploads. Run with the Firestore suite:
 *
 *   npm run test:rules
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { deleteObject, getBytes, ref, uploadBytes, type FirebaseStorage } from 'firebase/storage'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

let environment: RulesTestEnvironment

const PROJECT_ID = 'demo-rfb-rules'
const MAX_BYTES = 2 * 1024 * 1024

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: {
      rules: readFileSync(path.resolve('storage.rules'), 'utf8'),
    },
  })
})

afterAll(async () => {
  await environment.cleanup()
})

beforeEach(async () => {
  await environment.clearStorage()
})

function anonymous(): FirebaseStorage {
  return environment.unauthenticatedContext().storage() as unknown as FirebaseStorage
}

function as(uid: string): FirebaseStorage {
  return environment.authenticatedContext(uid).storage() as unknown as FirebaseStorage
}

function image(bytes = 8) {
  return { data: new Uint8Array(bytes), contentType: 'image/png' }
}

describe('avatars', () => {
  it('lets a member upload an image to their own folder', async () => {
    const { data, contentType } = image()

    await assertSucceeds(
      uploadBytes(ref(as('user-1'), 'avatars/user-1/photo.png'), data, { contentType }),
    )
  })

  it('rejects uploads into another member folder', async () => {
    const { data, contentType } = image()

    await assertFails(
      uploadBytes(ref(as('user-1'), 'avatars/user-2/photo.png'), data, { contentType }),
    )
  })

  it('rejects anonymous uploads', async () => {
    const { data, contentType } = image()

    await assertFails(
      uploadBytes(ref(anonymous(), 'avatars/user-1/photo.png'), data, { contentType }),
    )
  })

  it('rejects non-image content types', async () => {
    await assertFails(
      uploadBytes(ref(as('user-1'), 'avatars/user-1/notes.txt'), new Uint8Array([1, 2, 3]), {
        contentType: 'text/plain',
      }),
    )
  })

  it('rejects files at or above the 2 MB limit', async () => {
    await assertFails(
      uploadBytes(ref(as('user-1'), 'avatars/user-1/huge.png'), new Uint8Array(MAX_BYTES + 1), {
        contentType: 'image/png',
      }),
    )
  })

  it('allows reading avatars anonymously but nothing else', async () => {
    const { data, contentType } = image()

    await environment.withSecurityRulesDisabled(async (context) => {
      await uploadBytes(
        ref(context.storage() as unknown as FirebaseStorage, 'avatars/user-1/photo.png'),
        data,
        { contentType },
      )
      await uploadBytes(
        ref(context.storage() as unknown as FirebaseStorage, 'private/secret.png'),
        data,
        { contentType },
      )
    })

    await assertSucceeds(getBytes(ref(anonymous(), 'avatars/user-1/photo.png')))
    await assertFails(getBytes(ref(anonymous(), 'private/secret.png')))
  })

  it('lets the owner delete their avatar but not someone else', async () => {
    const { data, contentType } = image()

    await environment.withSecurityRulesDisabled(async (context) => {
      const storage = context.storage() as unknown as FirebaseStorage
      await uploadBytes(ref(storage, 'avatars/user-1/old.png'), data, { contentType })
      await uploadBytes(ref(storage, 'avatars/user-2/old.png'), data, { contentType })
    })

    await assertFails(deleteObject(ref(as('user-1'), 'avatars/user-2/old.png')))
    await assertSucceeds(deleteObject(ref(as('user-1'), 'avatars/user-1/old.png')))
  })
})
