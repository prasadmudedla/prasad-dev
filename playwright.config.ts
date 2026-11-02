import { defineConfig, devices } from '@playwright/test';

// Separate port from `npm run dev` (4321), so tests never talk to a server that has your real .env keys.
const PORT = 4323;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Read by scripts/write-ci.mjs to update the footer numbers.
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Starts the dev server for the tests. Contact-form tests never send real email
  // (no RESEND_API_KEY is passed, and the UI test mocks the API).
  webServer: {
    // --ignore-lock keeps Astro in the foreground even if you already have `npm run dev` open.
    command: `npx astro dev --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    env: { RESEND_API_KEY: '', CONTACT_TO: '', CONTACT_FROM: '' },
    timeout: 60_000,
  },
});
