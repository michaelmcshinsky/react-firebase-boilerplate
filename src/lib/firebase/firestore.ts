import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'

import type { Post, Product, UserProfile } from '@/types'

import { requireFirebase } from './client'
import { createConverter } from './converters'

export const userConverter = createConverter<UserProfile>()
export const postConverter = createConverter<Post>()
export const productConverter = createConverter<Product>()

export function usersCollection(): CollectionReference<UserProfile> {
  return collection(requireFirebase().db, 'users').withConverter(userConverter)
}

export function postsCollection(): CollectionReference<Post> {
  return collection(requireFirebase().db, 'posts').withConverter(postConverter)
}

export function productsCollection(): CollectionReference<Product> {
  return collection(requireFirebase().db, 'products').withConverter(productConverter)
}

export function userDocument(uid: string): DocumentReference<UserProfile> {
  return doc(requireFirebase().db, 'users', uid).withConverter(userConverter)
}

export function postDocument(id: string): DocumentReference<Post> {
  return doc(requireFirebase().db, 'posts', id).withConverter(postConverter)
}

export function productDocument(id: string): DocumentReference<Product> {
  return doc(requireFirebase().db, 'products', id).withConverter(productConverter)
}

interface CallableMap {
  setUserRoles: { request: { uid: string; roles: string[] }; response: { ok: true } }
  deleteUser: { request: { uid: string }; response: { ok: true } }
}

/** Type-safe wrapper around a callable Cloud Function. */
export async function callFunction<K extends keyof CallableMap>(
  name: K,
  data: CallableMap[K]['request'],
): Promise<CallableMap[K]['response']> {
  const { functions } = requireFirebase()
  const callable = httpsCallable<CallableMap[K]['request'], CallableMap[K]['response']>(
    functions,
    name,
  )
  const result = await callable(data)
  return result.data
}
