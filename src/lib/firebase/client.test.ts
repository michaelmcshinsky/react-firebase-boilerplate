import { describe, expect, it, vi } from 'vitest'

vi.mock('@/app/config/env', () => ({
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
  isFirebaseConfigured: false,
  useEmulators: false,
  appName: 'Test',
  isProduction: false,
  appEnv: {
    appName: 'Test',
    isFirebaseConfigured: false,
    useEmulators: false,
    isProduction: false,
  },
}))

const { FirebaseNotConfiguredError, getFirebase, requireFirebase } = await import('./client')

describe('firebase client', () => {
  it('returns null instead of throwing when configuration is missing', () => {
    expect(getFirebase()).toBeNull()
  })

  it('throws a friendly, typed error from requireFirebase', () => {
    expect(() => requireFirebase()).toThrow(FirebaseNotConfiguredError)
    expect(() => requireFirebase()).toThrow(/Copy \.env\.example to \.env/)
  })
})
