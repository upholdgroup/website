import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/labour-hire",
  "/labour-hire/casual-labour-hire",
  "/trades",
  "/trades/labourers",
  "/sydney",
  "/sydney/parramatta-western-sydney",
  "/jobs",
  "/workers",
  "/compliance",
  "/projects",
  "/request-labour",
  "/contact",
];

for (const route of ROUTES) {
  test(`no em-dashes in the copy on ${route}`, async ({ page }) => {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    expect(text).not.toContain("—");
  });
}

test("the whole site is set in one typeface", async ({ page }) => {
  await page.goto("/");
  await checkOneTypeface(page);
});

test("the admin is set in the same typeface", async ({ page }) => {
  await page.goto("/admin/login");
  await checkOneTypeface(page);
});

async function checkOneTypeface(page: import("@playwright/test").Page) {

  const families = await page.evaluate(() =>
    [...document.querySelectorAll("h1, h2, p, a, span, li, button")]
      .map((el) => getComputedStyle(el).fontFamily)
      .filter((value, index, all) => all.indexOf(value) === index),
  );

  expect(families.join(" ")).not.toMatch(/JetBrains|mono/i);
  for (const family of families) expect(family).toMatch(/Archivo|Helvetica|Arial/);
}

test.describe("motion", () => {
  test("animates the route change rather than cutting to the new page", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "uses the desktop pill nav");
    await page.goto("/");
    await page.evaluate(() => {
      (window as unknown as { __vt: number }).__vt = 0;
      const start = document.startViewTransition?.bind(document);
      if (!start) return;
      document.startViewTransition = ((...args: unknown[]) => {
        (window as unknown as { __vt: number }).__vt += 1;
        return (start as (...a: unknown[]) => unknown)(...args);
      }) as typeof document.startViewTransition;
    });

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Trades" }).click();
    await expect(page).toHaveURL(/\/trades$/);

    const started = await page.evaluate(() => (window as unknown as { __vt: number }).__vt);
    expect(started).toBeGreaterThan(0);
  });

  test("most of the page participates in the scroll reveal", async ({ page }) => {
    await page.goto("/");
    // A handful of hand picked tiles is not motion. Every band and the items
    // inside it should take part. Polled, because the attribute is only added
    // after mount.
    await expect
      .poll(() => page.locator("[data-reveal]").count(), { timeout: 10_000 })
      .toBeGreaterThan(40);
  });

  test("reveals sections as they scroll into view", async ({ page }) => {
    await page.goto("/");

    const tile = page.locator('[style*="transition-delay"]').first();
    await expect(tile).toHaveAttribute("data-reveal", "out");

    await tile.scrollIntoViewIfNeeded();
    await expect(tile).toHaveAttribute("data-reveal", "in");
  });

  test("counts the operational stats up to their real figures", async ({ page }) => {
    await page.goto("/");

    const stat = page.getByText("Sydney workers on the books").locator("..").locator("p").first();
    await stat.scrollIntoViewIfNeeded();
    await expect(stat).toHaveText("1,240");
  });

  test("shows everything at rest under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Nothing is left hidden behind a transition that will never run.
    const hidden = await page
      .locator("[data-reveal]")
      .evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).opacity !== "1").length);
    expect(hidden).toBe(0);

    await expect(page.getByRole("heading", { name: /Where we crew/ })).toBeVisible();
  });

  test("renders the full page with JavaScript off", async ({ browser }) => {
    // The reveal must never be the reason a crawler or a no-script reader
    // sees an empty page.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Crews That Turn Up/ })).toBeVisible();
    await expect(page.getByText("Sydney workers on the books")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where we crew" })).toBeVisible();
    await context.close();
  });
});
