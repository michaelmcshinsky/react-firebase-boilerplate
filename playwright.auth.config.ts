import { defineConfig, devices } from '@playwright/test'

/**
 * Signed-in suite. `npm run test:e2e:auth` starts the Auth and Firestore
 * emulators, seeds demo accounts, then boots Vite in `test` mode so the app
 * talks to the emulators using `.env.test`.
 */
const PORT = 3212

export default defineConfig({
  testDir: './e2e/auth',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev -- --mode test --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
