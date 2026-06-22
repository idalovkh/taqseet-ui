import { test, expect } from '@playwright/test'

const stories = [
  { id: 'ui-button--primary', name: 'button-primary' },
  { id: 'ui-button--dark-primary', name: 'button-dark' },
  { id: 'ui-input--default', name: 'input-default' },
  { id: 'ui-input--dark', name: 'input-dark' },
  { id: 'ui-badge--success', name: 'badge-success' },
  { id: 'ui-badge--dark', name: 'badge-dark' },
]

for (const story of stories) {
  test(`visual: ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story.name}.png`, {
      maxDiffPixelRatio: 0.01,
    })
  })
}
