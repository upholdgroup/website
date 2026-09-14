import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("leads with the headline, the promise and both doors", async ({ page, isMobile }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Labour Hire Sydney/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Crews That Turn Up");

    // Greater Sydney is the qualifier, and it appears in the first paragraph.
    await expect(page.getByText(/Greater Sydney/).first()).toBeVisible();

    // The two doors, host first.
    const host = page.getByRole("link", { name: /Need a crew/ });
    const worker = page.getByRole("link", { name: /Looking for work/ });
    await expect(host).toBeVisible();
    await expect(worker).toBeVisible();
    await expect(host).toHaveAttribute("href", "/request-labour");
    await expect(worker).toHaveAttribute("href", "/jobs");

    // Host first. Side by side on desktop, so the ordering that matters is the
    // document order; stacked on mobile, where it is also a vertical position.
    const order = await page.evaluate(() => {
      const links = [...document.querySelectorAll("main a")];
      const text = links.map((l) => l.textContent ?? "");
      return {
        host: text.findIndex((t) => t.includes("Need a crew")),
        worker: text.findIndex((t) => t.includes("Looking for work")),
      };
    });
    expect(order.host).toBeLessThan(order.worker);

    if (isMobile) {
      // The reveal attribute sits on the wrapper, not the link, so wait out
      // the stagger and the transition before measuring position.
      await worker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      const hostBox = await host.boundingBox();
      const workerBox = await worker.boundingBox();
      expect(hostBox!.y).toBeLessThan(workerBox!.y);
    }
  });

  test("the trade accordion opens one row at a time and links to the trade page", async ({
    page,
  }) => {
    await page.goto("/");

    const rows = page.getByRole("button", { expanded: true });
    await expect(rows).toHaveCount(1);

    await page.getByRole("button", { name: "Traffic control & spotters" }).click();
    await expect(page.getByRole("button", { name: "Traffic control & spotters" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByRole("button", { expanded: true })).toHaveCount(1);

    await page
      .getByRole("link", { name: /Traffic control & spotters, see tickets/ })
      .click();
    await expect(page).toHaveURL(/\/trades\/traffic-control$/);
  });

  test("click-to-call is reachable and dials the one canonical number", async ({ page }) => {
    await page.goto("/");
    const tel = page.locator('a[href^="tel:"]').first();
    await expect(tel).toHaveAttribute("href", "tel:+611300874653");
  });

  test("never scrolls horizontally", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("logs no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/", { waitUntil: "networkidle" });
    expect(errors).toEqual([]);
  });
});
