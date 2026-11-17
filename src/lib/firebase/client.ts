import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions, type Functions } from 'firebase/functions'
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage'

import { firebaseConfig, isFirebaseConfigured, useEmulators } from '@/app/config/env'

export interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  functions: Functions
  storage: FirebaseStorage
}

let services: FirebaseServices | null = null
let emulatorsConnected = false

export function getFirebase(): FirebaseServices | null {
  if (!isFirebaseConfigured) return null
  if (services) return services

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const functions = getFunctions(app)
  const storage = getStorage(app)

  if (useEmulators && !emulatorsConnected) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8085)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
    connectStorageEmulator(storage, '127.0.0.1', 9199)
    emulatorsConnected = true
  }

  services = { app, auth, db, functions, storage }
  return services
}

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super(
      'Firebase is not configured yet. Copy .env.example to .env and add the credentials from your Firebase project.',
    )
    this.name = 'FirebaseNotConfiguredError'
  }
}

/** Returns the configured services or throws a friendly setup error. */
export function requireFirebase(): FirebaseServices {
  const instance = getFirebase()
  if (!instance) throw new FirebaseNotConfiguredError()
  return instance
}

export function resetFirebaseForTests() {
  services = null
  emulatorsConnected = false
}
