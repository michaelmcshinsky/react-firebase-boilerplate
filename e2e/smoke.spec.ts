import { test, expect } from '@playwright/test'

test.describe('public site', () => {
  test('landing page renders the hero and feature sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ship the app')
    await expect(
      page.getByRole('heading', { name: 'The boring parts, already built' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'View the source' })).toHaveAttribute(
      'href',
      'https://github.com/michaelmcshinsky/react-firebase-boilerplate',
    )
  })

  test('navigates to the sign-in screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('validates the login form before contacting Firebase', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Email is required.')).toBeVisible()
    await expect(page.getByText('Password is required.')).toBeVisible()
  })

  test('shows the configuration notice when Firebase env vars are absent', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Firebase is not configured.')).toBeVisible()
  })

  test('routes unknown paths to the 404 page', async ({ page }) => {
    await page.goto('/does-not-exist')
    await expect(page.getByRole('heading', { name: 'This page moved on' })).toBeVisible()
  })

  test('explains the missing Firebase configuration on protected routes', async ({ page }) => {
    // Without VITE_FIREBASE_* env vars the guard renders the setup screen
    // instead of a sign-in form that could never succeed.
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Connect your Firebase project' })).toBeVisible()
  })
})
