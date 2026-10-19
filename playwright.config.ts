import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Start the local app so smoke checks never depend on production availability.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    // Resolve relative page.goto paths against the local app started above.
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // Keep routine smoke checks on one engine to avoid tripling runtime and browser installation cost.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
