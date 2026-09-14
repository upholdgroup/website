import { expect, test } from "@playwright/test";

/**
 * The single hardest commitment in the design system: no published rates,
 * anywhere — including alt text, FAQ answers and job listings. A rate-shaped
 * figure appearing on any route is a content bug, so it is a test.
 */
const ROUTES = [
  "/",
  "/labour-hire",
  "/labour-hire/casual-labour-hire",
  "/labour-hire/contract-crews",
  "/labour-hire/permanent-recruitment",
  "/labour-hire/payroll-on-hire",
  "/trades",
  "/trades/labourers",
  "/trades/traffic-control",
  "/sydney",
  "/sydney/parramatta-western-sydney",
  "/jobs",
  "/jobs/hoist-operator-parramatta-ug-2417",
  "/workers",
  "/workers/register",
  "/compliance",
  "/projects",
  "/request-labour",
  "/contact",
];

/** "$45", "$45.50/hr", "$45 per hour", "45 per hour" — any of it fails. */
const RATE = /\$\s?\d{1,4}(?:\.\d{2})?\s*(?:\/|per\s+)?\s*(?:hr|hour)|\$\s?\d{1,3}(?:\.\d{2})?\b(?!\s?(?:M|m|million))/;

for (const route of ROUTES) {
  test(`no rate figures on ${route}`, async ({ page }) => {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    const match = text.match(RATE);
    expect(match?.[0] ?? null).toBeNull();
  });
}

test("insurance limits are still stated, so the rule is not just an empty page", async ({
  page,
}) => {
  await page.goto("/compliance");
  await expect(page.getByText(/\$20M public liability/i).first()).toBeVisible();
});

test("job listings carry no pay column", async ({ page }) => {
  await page.goto("/jobs/hoist-operator-parramatta-ug-2417");
  await expect(page.getByText("Confirmed at your interview")).toBeVisible();

  const ld = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((n) => n.textContent ?? ""));
  expect(ld.join(" ")).not.toContain("baseSalary");
});
