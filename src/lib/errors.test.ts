import { describe, expect, it } from 'vitest'

import { getErrorMessage, authErrorMessages } from './errors'
import { FirebaseError } from 'firebase/app'

describe('getErrorMessage', () => {
  it('maps known Firebase auth error codes to friendly messages', () => {
    const error = new FirebaseError('auth/user-not-found', 'User not found')
    expect(getErrorMessage(error)).toBe('No account exists for that email address.')
  })

  it('maps weak password error', () => {
    const error = new FirebaseError('auth/weak-password', 'Password too weak')
    expect(getErrorMessage(error)).toBe('Choose a stronger password with at least 8 characters.')
  })

  it('maps too many requests', () => {
    const error = new FirebaseError('auth/too-many-requests', 'Too many requests')
    expect(getErrorMessage(error)).toBe('Too many attempts. Wait a moment and try again.')
  })

  it('maps network error', () => {
    const error = new FirebaseError('auth/network-request-failed', 'Network error')
    expect(getErrorMessage(error)).toBe('Network error. Check your connection and try again.')
  })

  it('maps permission denied', () => {
    const error = new FirebaseError('permission-denied', 'Permission denied')
    expect(getErrorMessage(error)).toBe('You do not have permission to do that.')
  })

  it('maps functions errors', () => {
    const error = new FirebaseError('functions/not-found', 'Function not found')
    expect(getErrorMessage(error)).toBe('That Cloud Function is not deployed. Run firebase deploy --only functions.')

    const internalError = new FirebaseError('functions/internal', 'Internal error')
    expect(getErrorMessage(internalError)).toBe('The function failed. Check its logs in the Firebase console.')

    const unavailableError = new FirebaseError('functions/unavailable', 'Unavailable')
    expect(getErrorMessage(unavailableError)).toBe('Cloud Functions are unreachable. Deploy them or start the emulator.')
  })

  it('falls back to error.message for unknown FirebaseError codes', () => {
    const error = new FirebaseError('auth/unknown-code', 'Custom message')
    expect(getErrorMessage(error)).toBe('Custom message')
  })

  it('uses fallback for FirebaseError without message', () => {
    const error = new FirebaseError('auth/unknown-code', '')
    expect(getErrorMessage(error)).toBe('Something went wrong.')
  })

  it('handles generic Error instances', () => {
    const error = new Error('Generic error')
    expect(getErrorMessage(error)).toBe('Generic error')
  })

  it('handles Error without message', () => {
    const error = new Error()
    expect(getErrorMessage(error)).toBe('Something went wrong.')
  })

  it('handles string errors', () => {
    expect(getErrorMessage('string error')).toBe('string error')
  })

  it('handles unknown types with fallback', () => {
    expect(getErrorMessage(null)).toBe('Something went wrong.')
    expect(getErrorMessage(undefined)).toBe('Something went wrong.')
    expect(getErrorMessage(123)).toBe('Something went wrong.')
    expect(getErrorMessage({})).toBe('Something went wrong.')
  })

  it('allows custom fallback', () => {
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback')
  })
})

describe('authErrorMessages', () => {
  it('contains all expected error codes', () => {
    expect(authErrorMessages).toHaveProperty('auth/email-already-in-use')
    expect(authErrorMessages).toHaveProperty('auth/invalid-credential')
    expect(authErrorMessages).toHaveProperty('auth/invalid-email')
    expect(authErrorMessages).toHaveProperty('auth/user-disabled')
    expect(authErrorMessages).toHaveProperty('auth/user-not-found')
    expect(authErrorMessages).toHaveProperty('auth/wrong-password')
    expect(authErrorMessages).toHaveProperty('auth/weak-password')
    expect(authErrorMessages).toHaveProperty('auth/too-many-requests')
    expect(authErrorMessages).toHaveProperty('auth/network-request-failed')
    expect(authErrorMessages).toHaveProperty('auth/popup-closed-by-user')
    expect(authErrorMessages).toHaveProperty('auth/popup-blocked')
    expect(authErrorMessages).toHaveProperty('auth/cancelled-popup-request')
    expect(authErrorMessages).toHaveProperty('auth/requires-recent-login')
    expect(authErrorMessages).toHaveProperty('auth/operation-not-allowed')
    expect(authErrorMessages).toHaveProperty('permission-denied')
    expect(authErrorMessages).toHaveProperty('functions/not-found')
    expect(authErrorMessages).toHaveProperty('functions/internal')
    expect(authErrorMessages).toHaveProperty('functions/unavailable')
    expect(authErrorMessages).toHaveProperty('unavailable')
    expect(authErrorMessages).toHaveProperty('unauthenticated')
  })

  it('all messages are non-empty strings', () => {
    for (const message of Object.values(authErrorMessages)) {
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })
})