type Env = ImportMetaEnv

const env: Env = import.meta.env

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
}

/**
 * A Firebase web config needs at minimum an API key, project id and app id.
 * When any of these are missing the app still renders, but auth and data
 * features explain how to finish setup instead of crashing.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

export const appName = env.VITE_APP_NAME?.trim() || 'Northstar'

export const useEmulators = env.VITE_USE_EMULATORS === 'true'

export const isProduction = import.meta.env.PROD

export const appEnv = {
  appName,
  isFirebaseConfigured,
  useEmulators,
  isProduction,
}
