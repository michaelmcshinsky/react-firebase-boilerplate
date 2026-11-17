import { FirebaseError } from 'firebase/app'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with that email already exists. Try signing in.',
  'auth/invalid-credential': 'That email and password combination is not correct.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact an administrator.',
  'auth/user-not-found': 'No account exists for that email address.',
  'auth/wrong-password': 'That email and password combination is not correct.',
  'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'The sign-in window closed before finishing.',
  'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow popups and retry.',
  'auth/cancelled-popup-request': 'Another sign-in attempt is already in progress.',
  'auth/requires-recent-login': 'Please sign in again before making this change.',
  'auth/operation-not-allowed': 'That sign-in method is not enabled in your Firebase project.',
  'permission-denied': 'You do not have permission to do that.',
  'functions/not-found':
    'That Cloud Function is not deployed. Run firebase deploy --only functions.',
  'functions/internal': 'The function failed. Check its logs in the Firebase console.',
  'functions/unavailable': 'Cloud Functions are unreachable. Deploy them or start the emulator.',
  unavailable: 'Cannot reach Firebase right now. Check your connection and try again.',
  unauthenticated: 'Your session expired. Please sign in again.',
}

/** Extracts a friendly message from Firebase, Zod and generic errors. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? (error.message || fallback)
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  if (typeof error === 'string') return error

  return fallback
}

export const authErrorMessages = AUTH_ERROR_MESSAGES
