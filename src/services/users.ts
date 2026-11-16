import { ROLES, type Role, type UserProfile } from '@/types'
import { callFunction, userDocument, usersCollection } from '@/lib/firebase/firestore'
import type { User } from 'firebase/auth'
import {
  deleteDoc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'

export function splitDisplayName(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export function normalizeRoles(value: unknown): Role[] {
  if (!Array.isArray(value)) return []
  return value.filter((role): role is Role => ROLES.includes(role as Role))
}

export function usersQuery(limitTo = 200) {
  return query(usersCollection(), orderBy('displayName', 'asc'), limit(limitTo))
}

export function subscribeToProfile(
  uid: string,
  onNext: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userDocument(uid),
    (snapshot) => onNext(snapshot.exists() ? snapshot.data() : null),
    onError,
  )
}

export async function fetchProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userDocument(uid))
  return snapshot.exists() ? snapshot.data() : null
}

/**
 * Cloud Functions create the profile document on sign-up. This client-side
 * fallback keeps local development (and emulator runs without functions)
 * working, and is idempotent when the function already ran.
 */
export async function ensureProfile(
  user: Pick<User, 'uid' | 'email' | 'displayName' | 'photoURL'>,
): Promise<UserProfile | null> {
  const existing = await fetchProfile(user.uid)
  if (existing) return existing

  const displayName = user.displayName || user.email?.split('@')[0] || 'New member'
  const { firstName, lastName } = splitDisplayName(displayName)

  await setDoc(
    userDocument(user.uid),
    {
      email: user.email ?? '',
      displayName,
      firstName,
      lastName,
      photoURL: user.photoURL ?? null,
      roles: ['user'],
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    } as unknown as UserProfile,
    { merge: true },
  )

  return fetchProfile(user.uid)
}

export async function updateProfileDocument(
  uid: string,
  input: Partial<Pick<UserProfile, 'displayName' | 'firstName' | 'lastName' | 'photoURL'>>,
) {
  await updateDoc(userDocument(uid), {
    ...input,
    updatedAt: serverTimestamp(),
  } as unknown as Partial<UserProfile>)
}

export async function setUserActive(uid: string, active: boolean) {
  await updateDoc(userDocument(uid), {
    active,
    updatedAt: serverTimestamp(),
  } as unknown as Partial<UserProfile>)
}

/** Role changes go through a callable so custom claims stay authoritative. */
export async function assignUserRoles(uid: string, roles: Role[]) {
  await callFunction('setUserRoles', { uid, roles })
}

/** Deletes the Firebase Auth user and their profile document (admin only). */
export async function deleteMember(uid: string) {
  await callFunction('deleteUser', { uid })
}

export async function deleteProfileDocument(uid: string) {
  await deleteDoc(userDocument(uid))
}
