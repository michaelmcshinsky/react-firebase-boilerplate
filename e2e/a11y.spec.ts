import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** Wait for styles and webfonts so contrast checks are not racing the CSS. */
async function settle(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(150)
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  return violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => `${violation.id} (${violation.nodes.length}): ${violation.help}`)
}

test.describe('accessibility', () => {
  test('landing page has no serious violations', async ({ page }) => {
    await page.goto('/')
    await settle(page)

    expect(await seriousViolations(page)).toEqual([])
  })

  test('sign-in page has no serious violations', async ({ page }) => {
    await page.goto('/login')
    await settle(page)

    expect(await seriousViolations(page)).toEqual([])
  })

  test('404 page has no serious violations', async ({ page }) => {
    await page.goto('/does-not-exist')
    await settle(page)

    expect(await seriousViolations(page)).toEqual([])
  })

  test('skip link moves focus into the main content', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.getByRole('link', { name: 'Skip to main content' })
    await skipLink.focus()
    await expect(skipLink).toBeFocused()

    await skipLink.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })
})
