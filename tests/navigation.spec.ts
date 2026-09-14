import { expect, test } from "@playwright/test";

test.describe("navigation and conversion path", () => {
  test("desktop nav marks the active section", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "pill nav is desktop only");

    await page.goto("/trades/labourers");
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Trades" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("mobile keeps a CTA and click-to-call within one screen", async ({ page, isMobile }) => {
    test.skip(!isMobile, "sticky action bar is mobile only");

    await page.goto("/");
    const bar = page.locator("div").filter({ hasText: /^Request labour/ }).last();
    await expect(page.getByRole("link", { name: "Call now" })).toBeVisible();

    // Still visible after scrolling to the foot of the page.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("link", { name: "Call now" })).toBeInViewport();
    expect(await bar.count()).toBeGreaterThan(0);
  });

  test("mobile menu opens, navigates and closes itself", async ({ page, isMobile }) => {
    test.skip(!isMobile, "sheet is mobile only");

    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Primary, mobile" })
      .getByRole("link", { name: "Sydney regions" })
      .click();

    await expect(page).toHaveURL(/\/sydney$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("the region tiles reach every Greater Sydney region page", async ({ page }) => {
    await page.goto("/sydney");
    const links = page.locator('main a[href^="/sydney/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(8);
  });

  test("a skip link comes first for keyboard users", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "no keyboard on the mobile project");

    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("unknown routes return a usable 404, not a dead end", async ({ page }) => {
    const response = await page.goto("/trades/plumbers-we-do-not-supply");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("stood down");
    await expect(page.getByRole("link", { name: /Request labour/ }).first()).toBeVisible();
  });

  test("interactive targets clear 44px", async ({ page }) => {
    await page.goto("/jobs");

    const chips = page.getByRole("button", { name: "All trades" });
    const box = await chips.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
