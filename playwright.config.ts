import { defineConfig, devices } from '@playwright/test'

// Use the configured live URL for deployment checks and localhost for pull requests and manual runs.
const configuredBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = configuredBaseURL
  ? `${configuredBaseURL.replace(/\/+$/, '')}/`
  : 'http://localhost:3000/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Start Next.js only when no remote target is set, so live checks use the deployed site directly.
  webServer: configuredBaseURL ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    // Resolve relative Playwright URLs against the selected local or live site.
    baseURL,
    trace: 'on-first-retry',
  },
  // Keep routine smoke checks on one engine to avoid tripling runtime and browser installation cost.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
