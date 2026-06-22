import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run storybook -- --ci --port 6006',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
