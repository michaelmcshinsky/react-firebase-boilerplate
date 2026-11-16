import { logger } from 'firebase-functions'
import { auth } from 'firebase-functions/v1'
import { FieldValue } from 'firebase-admin/firestore'

import { db } from './admin'

/**
 * Auth background triggers are still 1st gen in Cloud Functions, so these two
 * live alongside the v2 callables exported from index.ts.
 */
export const onUserCreated = auth.user().onCreate(async (user) => {
  const displayName = user.displayName || user.email?.split('@')[0] || 'New member'
  const [firstName, ...rest] = displayName.split(/\s+/)

  await db.doc(`users/${user.uid}`).set(
    {
      email: user.email ?? '',
      displayName,
      firstName: firstName ?? '',
      lastName: rest.join(' '),
      photoURL: user.photoURL ?? null,
      roles: ['user'],
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  logger.info('Created member profile', { uid: user.uid })
})

export const onUserDeleted = auth.user().onDelete(async (user) => {
  await db.doc(`users/${user.uid}`).set(
    { active: false, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  )

  logger.info('Deactivated deleted member', { uid: user.uid })
})
