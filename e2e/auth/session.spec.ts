import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ACCOUNTS = {
  admin: { email: 'admin@example.com', password: 'password123' },
  member: { email: 'member@example.com', password: 'password123' },
}

async function signIn(page: Page, account: { email: string; password: string }) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(account.email)
  await page.getByLabel('Password').fill(account.password)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 })
}

test.describe('signed-in workspace', () => {
  test('admin signs in and lands on a populated dashboard', async ({ page }, testInfo) => {
    await signIn(page, ACCOUNTS.admin)

    const sidebar = page.getByRole('navigation', { name: 'Main' })

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Good to see you')
    await expect(sidebar.getByRole('link', { name: 'Members' })).toBeVisible()
    await expect(page.getByText('Welcome to the boilerplate').first()).toBeVisible()
    await expect(page.getByText('Getting started')).toBeVisible()

    // Keep a screenshot as an artefact for visual review.
    const screenshot = await page.screenshot({ fullPage: true })
    await testInfo.attach('dashboard', { body: screenshot, contentType: 'image/png' })
    await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true })
  })

  test('admin creates a post and sees it in the table', async ({ page }) => {
    await signIn(page, ACCOUNTS.admin)
    await page.getByRole('link', { name: 'Posts' }).click()

    await expect(page.getByRole('heading', { name: 'Posts', level: 1 })).toBeVisible()
    await page.getByRole('button', { name: 'New post' }).first().click()

    await page.getByLabel('Title').fill('Written by Playwright')
    await page.getByLabel('Body').fill('Created through the real form, rules and Firestore.')
    await page.getByRole('button', { name: 'Create post' }).click()

    await expect(page.getByText('Post created')).toBeVisible()
    await expect(page.getByText('Written by Playwright')).toBeVisible()
  })

  test('admin can manage members', async ({ page }) => {
    await signIn(page, ACCOUNTS.admin)
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Members' })
      .click()

    await expect(page.getByRole('heading', { name: 'Members', level: 1 })).toBeVisible()
    await expect(page.getByRole('table').getByText('admin@example.com')).toBeVisible()
    await expect(page.getByRole('table').getByText('editor@example.com')).toBeVisible()
  })

  test('a member is denied the admin-only members page', async ({ page }) => {
    await signIn(page, ACCOUNTS.member)

    await expect(
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Members' }),
    ).toHaveCount(0)

    await page.goto('/users')
    await expect(page.getByRole('heading', { name: 'Access restricted' })).toBeVisible()
  })

  test('dashboard has no serious accessibility violations', async ({ page }) => {
    await signIn(page, ACCOUNTS.admin)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const serious = violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .map(
        (violation) =>
          `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(' | ')}`,
      )

    expect(serious).toEqual([])
  })
})
