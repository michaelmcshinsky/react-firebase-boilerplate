import { logger } from 'firebase-functions'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { FieldValue } from 'firebase-admin/firestore'

import { auth, callerIsAdmin, db, isRoleArray } from './admin'

const REGION = 'us-central1'

/**
 * Sets custom claims and mirrors them onto the user profile document.
 * Custom claims are the only source of truth for security rules.
 */
export const setUserRoles = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in before changing roles.')
  }

  if (!callerIsAdmin(request.auth.token)) {
    throw new HttpsError('permission-denied', 'Only administrators can change roles.')
  }

  const data = request.data as { uid?: unknown; roles?: unknown }
  const uid = typeof data.uid === 'string' ? data.uid : ''

  if (!uid) {
    throw new HttpsError('invalid-argument', 'A member id is required.')
  }

  if (!isRoleArray(data.roles)) {
    throw new HttpsError('invalid-argument', 'Provide at least one role from: admin, editor, user.')
  }

  const roles = [...new Set(data.roles)]
  const isSelf = uid === request.auth.uid

  if (isSelf && !roles.includes('admin')) {
    throw new HttpsError(
      'failed-precondition',
      'You cannot remove your own admin role. Ask another administrator.',
    )
  }

  await auth.setCustomUserClaims(uid, { roles })
  await db
    .doc(`users/${uid}`)
    .set({ roles, updatedAt: FieldValue.serverTimestamp() }, { merge: true })

  logger.info('Roles updated', { uid, roles, updatedBy: request.auth.uid })

  return { ok: true }
})

/** Deletes the Auth account and the profile document. Admins only, never self. */
export const deleteUser = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in before deleting members.')
  }

  if (!callerIsAdmin(request.auth.token)) {
    throw new HttpsError('permission-denied', 'Only administrators can delete members.')
  }

  const data = request.data as { uid?: unknown }
  const uid = typeof data.uid === 'string' ? data.uid : ''

  if (!uid) {
    throw new HttpsError('invalid-argument', 'A member id is required.')
  }

  if (uid === request.auth.uid) {
    throw new HttpsError('failed-precondition', 'You cannot delete your own account.')
  }

  await auth.deleteUser(uid)
  await db.doc(`users/${uid}`).delete()

  logger.info('Member deleted', { uid, deletedBy: request.auth.uid })

  return { ok: true }
})
