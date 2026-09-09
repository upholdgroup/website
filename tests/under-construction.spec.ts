import { expect, test } from "@playwright/test";

test.describe("under construction page", () => {
  test("renders the wordmark, headline and contact", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Uphold Group/i);
    await expect(page.getByText("UPHOLD", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("building");
    await expect(page.getByRole("link", { name: /@/ })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  });

  test("the scene pans and the progress bar fills", async ({ page }) => {
    await page.goto("/");

    const track = page.locator(".animate-pan").first();
    const at = async () =>
      track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

    const start = await at();
    await page.waitForTimeout(1500);
    expect(await at()).toBeLessThan(start);

    const fill = page.locator('[role="progressbar"] > div');
    const width = async () => fill.evaluate((el) => el.getBoundingClientRect().width);

    const initial = await width();
    await page.waitForTimeout(2500);
    expect(await width()).toBeGreaterThan(initial);
  });

  test("honours prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const track = page.locator(".animate-pan").first();
    await expect(track).toHaveCSS("animation-name", "none");

    // The bar still shows its resting value rather than an empty sliver.
    const fill = page.locator('[role="progressbar"] > div');
    const bar = page.locator('[role="progressbar"]');
    const ratio =
      (await fill.evaluate((el) => el.getBoundingClientRect().width)) /
      (await bar.evaluate((el) => el.getBoundingClientRect().width));
    expect(ratio).toBeGreaterThan(0.5);
  });

  test("never scrolls horizontally", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  test("logs no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/", { waitUntil: "networkidle" });
    expect(errors).toEqual([]);
  });
});
