import { expect, test } from "@playwright/test";

test.describe("host request — 3 steps", () => {
  test("validates, then confirms with a named consultant and a callback window", async ({
    page,
  }) => {
    await page.goto("/request-labour");

    // Step 1 — roles.
    await page.getByText("Labourers & TAs", { exact: true }).click();
    await page.getByLabel("How many workers").fill("6");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2 — site and start.
    await page.getByLabel("Site suburb").fill("Parramatta");
    await page.getByText("Tomorrow 6am", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3 — a bad phone number is caught server-side.
    await page.getByLabel("Your name").fill("Dean Marchetti");
    await page.getByLabel("Mobile", { exact: true }).fill("123");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Enter an Australian mobile or landline.")).toBeVisible();

    await page.getByLabel("Mobile", { exact: true }).fill("0412 345 678");
    await page.getByRole("button", { name: "Send request" }).click();

    // Confirmation names a consultant and a window — never a generic thanks.
    await expect(page.getByRole("heading", { name: /is calling you/ })).toBeVisible();
    await expect(page.getByText(/Request received · UG-H-/)).toBeVisible();
    // The promise of a written quote, made in the confirmation itself.
    await expect(page.getByText(/all-inclusive hourly rate per classification by email/)).toBeVisible();
  });

  test("keeps what you typed across steps and across a validation error", async ({ page }) => {
    await page.goto("/request-labour");

    await page.getByText("Labourers & TAs", { exact: true }).click();
    await page.getByLabel("How many workers").fill("4");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Site suburb").fill("Liverpool");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step back: the earlier answers are still there.
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Site suburb")).toHaveValue("Liverpool");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("How many workers")).toHaveValue("4");

    // Submit with a missing start date and nothing is lost on the way back.
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Your name").fill("Priya Raman");
    await page.getByLabel("Mobile", { exact: true }).fill("0412 345 678");
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("When do you need them to start?")).toBeVisible();
    await expect(page.getByLabel("Your name")).toHaveValue("Priya Raman");
  });

  test("click-to-call sits beside the primary action at every step", async ({ page }) => {
    await page.goto("/request-labour");
    await expect(page.locator('form a[href^="tel:"]')).toBeVisible();
  });
});

test.describe("worker registration — 2 steps", () => {
  test("registers without a CV or a password", async ({ page }) => {
    await page.goto("/workers/register");

    await expect(page.locator('input[type="password"]')).toHaveCount(0);

    await page.getByLabel("Full name").fill("Jai Thompson");
    await page.getByLabel("Mobile").fill("0455 111 222");
    await page.getByText("Labourers & TAs", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Your suburb").fill("Bankstown");
    await page.getByText("White Card", { exact: true }).click();

    // Ticket photos come from the camera roll, so the input takes images.
    await expect(page.getByLabel("Photos of your tickets")).toHaveAttribute("accept", "image/*");

    await page.getByRole("button", { name: "Register", exact: true }).click();
    await expect(page.getByRole("heading", { name: /will text you within one business day/ })).toBeVisible();
  });

  test("carries the role reference through from a job page", async ({ page }) => {
    await page.goto("/jobs/hoist-operator-parramatta-ug-2417");
    await page.getByRole("link", { name: /Register & apply/ }).click();
    await expect(page).toHaveURL(/\/workers\/register\?role=UG-2417/);
    await expect(page.getByText("Applying for role UG-2417")).toBeVisible();
  });
});
