import { defineConfig } from 'vitest/config'

/**
 * Security-rule tests run inside `firebase emulators:exec`, which injects
 * FIRESTORE_EMULATOR_HOST. They use Node rather than jsdom.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/rules/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 30_000,
  },
})
