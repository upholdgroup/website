import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { codeFor } from "../src/lib/totp";

const EMAIL = "desk@upholdgroup.com.au";
const PASSWORD = "Uphold-Desk-2026";
const STORE = join(process.cwd(), ".data", "uphold.json");

// One store and one account shared by both projects, so these run in order.
test.describe.configure({ mode: "serial" });

async function storedUser() {
  const snapshot = JSON.parse(await readFile(STORE, "utf8"));
  return snapshot.users?.find((user: { email: string }) => user.email === EMAIL) ?? null;
}

/**
 * Clears a lockout by editing the store the local driver reads.
 *
 * The lock is deliberately fifteen minutes, so a test that triggers one has to
 * put the account back or every later test, including the whole mobile
 * project, signs in to a locked account.
 */
async function clearLock() {
  const snapshot = JSON.parse(await readFile(STORE, "utf8"));
  for (const user of snapshot.users ?? []) {
    user.failedAttempts = 0;
    user.lockedUntil = null;
  }
  await writeFile(STORE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

/** A code the server will accept, computed from the secret it just stored. */
async function currentCode(): Promise<string> {
  const user = await storedUser();
  return codeFor(user.totpSecret, Math.floor(Date.now() / 1000 / 30));
}

/**
 * Signs in the way a consultant does. Idempotent: it creates the account and
 * enrols an authenticator the first time, and does the two step sign in on
 * every run after that.
 */
/** Guarantees the account exists, so a test can run on its own. */
async function ensureAccount(page: Page) {
  await page.goto("/admin/login");
  if (await page.getByRole("heading", { name: "Create the first account" }).isVisible()) {
    await signIn(page);
    await page.getByRole("button", { name: "Sign out" }).click();
  }
}

async function signIn(page: Page) {
  await page.goto("/admin/login");

  if (await page.getByRole("heading", { name: "Create the first account" }).isVisible()) {
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByLabel("Confirm password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create the account" }).click();
  } else {
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();
  }

  // Wait for the redirect to land before branching, otherwise the URL is
  // still /admin/login and the wrong branch is taken.
  await page.waitForURL(/\/admin\/login\/(enrol|code)/);

  if (page.url().includes("/enrol")) {
    await expect(page.getByRole("heading", { name: "Set up two step" })).toBeVisible();
    await page.getByLabel("Code from the app").fill(await currentCode());
    await page.getByRole("button", { name: "Turn on two step" }).click();

    // Recovery codes are shown exactly once, here.
    await expect(page).toHaveURL(/\/admin\/recovery-codes/);
    await page.getByRole("link", { name: "I have saved them" }).click();
  } else {
    await page.getByLabel("Six digit code").fill(await currentCode());
    await page.getByRole("button", { name: "Sign in" }).click();
  }

  await expect(page).toHaveURL(/\/admin\/jobs/);
}

test.describe("admin access", () => {
  test("is kept out of search", async ({ page, request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");

    const response = await page.goto("/admin/login");
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("redirects a signed out visitor to the login page", async ({ page }) => {
    await page.goto("/admin/jobs");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("creates the first account, enrols an authenticator, then signs in", async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole("heading", { name: "Live roles" })).toBeVisible();

    // Two step is now on, and the password alone no longer gets you in.
    await page.goto("/admin/jobs");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/admin\/login\/code/);

    // The half finished sign in cannot reach the admin on its own.
    await page.goto("/admin/jobs");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("rejects a wrong password without saying which part was wrong", async ({ page }) => {
    await ensureAccount(page);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("That email and password did not match.")).toBeVisible();

    // An unknown address gets the identical message, so this cannot be used to
    // find out who has an account.
    await page.getByLabel("Email").fill("stranger@example.com");
    await page.getByLabel("Password").fill("whatever-it-is");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("That email and password did not match.")).toBeVisible();
  });

  test("rejects a wrong authenticator code", async ({ page }) => {
    await ensureAccount(page);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/admin\/login\/code/);

    await page.getByLabel("Six digit code").fill("000000");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/That code is not right/)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login\/code/);
  });

  test("rejects a forged session cookie", async ({ page, context, baseURL }) => {
    await context.addCookies([
      {
        name: "uphold_admin",
        value: `${Buffer.from(
          JSON.stringify({ email: EMAIL, stage: "full", exp: Date.now() + 3_600_000 }),
        ).toString("base64url")}.forged`,
        url: baseURL!,
      },
    ]);

    // Proxy lets this through, because a cookie exists, so reaching the login
    // page proves the real check runs next to the data, not at the edge.
    await page.goto("/admin/jobs");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("a pending cookie cannot be replayed as a finished session", async ({ page, context }) => {
    await ensureAccount(page);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/admin\/login\/code/);

    // Copy the half finished cookie into the full session slot. The stage is
    // inside the signed payload, so moving it changes nothing.
    const pending = (await context.cookies()).find((c) => c.name === "uphold_admin_pending")!;
    await context.addCookies([
      {
        name: "uphold_admin",
        value: pending.value,
        domain: pending.domain,
        path: pending.path,
      },
    ]);

    await page.goto("/admin/jobs");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("locks the account after five failed attempts", async ({ page }) => {
    await ensureAccount(page);
    await page.goto("/admin/login");

    // Wait for each attempt to be recorded. The error message stays on screen
    // between submissions, so asserting on it would pass before the round trip
    // finished and attempts would be lost.
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await page.getByLabel("Email").fill(EMAIL);
      await page.getByLabel("Password").fill(`wrong-${attempt}`);
      await page.getByRole("button", { name: "Continue" }).click();
      await expect
        .poll(async () => (await storedUser())?.failedAttempts ?? 0, { timeout: 10_000 })
        .toBe(attempt);
    }

    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Continue" }).click();

    // Even the correct password is refused while the lock stands.
    await expect(page.getByText(/Too many attempts/)).toBeVisible();

    // Put the account back, or everything after this signs in to a lock.
    await clearLock();
  });
});
