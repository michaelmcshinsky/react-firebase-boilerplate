import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updatePassword,
  updateProfile,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'

import { requireFirebase } from './client'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export async function signIn(email: string, password: string): Promise<User> {
  const { auth } = requireFirebase()
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  return credential.user
}

export async function signUp(input: {
  email: string
  password: string
  displayName: string
}): Promise<User> {
  const { auth } = requireFirebase()
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email.trim(),
    input.password,
  )
  await updateProfile(credential.user, { displayName: input.displayName.trim() })
  return credential.user
}

export async function signInWithGoogle(): Promise<User> {
  const { auth } = requireFirebase()
  const credential = await signInWithPopup(auth, googleProvider)
  return credential.user
}

export async function signOutUser(): Promise<void> {
  const { auth } = requireFirebase()
  await firebaseSignOut(auth)
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { auth } = requireFirebase()
  await sendPasswordResetEmail(auth, email.trim(), {
    url: `${window.location.origin}/login`,
    handleCodeInApp: false,
  })
}

export async function resendVerificationEmail(user: User): Promise<void> {
  await sendEmailVerification(user, {
    url: `${window.location.origin}/account`,
  })
}

export async function changePassword(
  user: User,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!user.email) throw new Error('This account does not have a password to change.')
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

export async function updateAccountProfile(input: {
  displayName?: string
  photoURL?: string | null
}): Promise<void> {
  const { auth } = requireFirebase()
  if (!auth.currentUser) throw new Error('You need to be signed in to update your profile.')
  await updateProfile(auth.currentUser, input)
}
