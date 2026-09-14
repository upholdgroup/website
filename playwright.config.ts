import { defineConfig, devices } from "@playwright/test";

/**
 * Its own port, not 3000 — a dev server for another project is often already
 * sitting there, and `reuseExistingServer` would happily test that instead.
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3210);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Runs after desktop rather than alongside it. Both projects share one
    // server and one JSON store, so in parallel they race to claim the first
    // admin account and to create the same test roles.
    { name: "mobile", use: { ...devices["iPhone 13"] }, dependencies: ["desktop"] },
  ],
  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // Admin fails closed without these, and the suite needs to sign in. The
    // store stays on the local JSON driver, so the test reads the enrolled
    // TOTP secret straight out of it and computes real codes.
    env: {
      ADMIN_EMAILS: "desk@upholdgroup.com.au",
      ADMIN_SESSION_SECRET: "playwright-fixed-secret-not-used-anywhere-else",
    },
    stdout: "pipe",
  },
});
