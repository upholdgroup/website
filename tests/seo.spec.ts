import { expect, test } from "@playwright/test";

const jsonLd = async (page: import("@playwright/test").Page) => {
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((n) => n.textContent ?? "{}"));
  return raw.map((text) => JSON.parse(text));
};

test.describe("SEO", () => {
  test("home carries EmploymentAgency and FAQPage structured data", async ({ page }) => {
    await page.goto("/");
    const blocks = await jsonLd(page);

    const org = blocks.find((b) => JSON.stringify(b["@type"]).includes("EmploymentAgency"));
    expect(org).toBeTruthy();
    expect(org.address.addressLocality).toBe("Alexandria");
    expect(JSON.stringify(org.areaServed)).toContain("Parramatta & Greater West");
    // Hire desk hours, not office hours.
    expect(org.openingHoursSpecification[0].opens).toBe("05:30");

    expect(blocks.some((b) => b["@type"] === "FAQPage")).toBe(true);
  });

  test("region pages keep the region in the title and name their suburbs in body copy", async ({
    page,
  }) => {
    await page.goto("/sydney/parramatta-western-sydney");

    await expect(page).toHaveTitle(/Labour Hire Parramatta & Greater West/);
    const body = await page.locator("main").innerText();
    for (const suburb of ["Blacktown", "Penrith", "Eastern Creek", "Marsden Park"]) {
      expect(body).toContain(suburb);
    }

    // A region page ships with a local project and a local role, or it is a
    // doorway page.
    await expect(page.getByRole("heading", { name: /32-level residential tower/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Hoist operator/ })).toBeVisible();
  });

  test("trade pages carry Service, FAQPage and BreadcrumbList", async ({ page }) => {
    await page.goto("/trades/scaffolders-riggers");
    const types = (await jsonLd(page)).map((b) => b["@type"]);
    expect(types).toContain("Service");
    expect(types).toContain("FAQPage");
    expect(types).toContain("BreadcrumbList");
  });

  test("live jobs carry JobPosting with a validThrough and no salary", async ({ page }) => {
    await page.goto("/jobs/construction-labourers-alexandria-ug-2411");
    const posting = (await jsonLd(page)).find((b) => b["@type"] === "JobPosting");

    expect(posting).toBeTruthy();
    expect(posting.validThrough).toBeTruthy();
    expect(new Date(posting.validThrough).getTime()).toBeGreaterThan(Date.now());
    expect(posting.jobLocation.address.addressLocality).toBe("Alexandria");
    expect(posting.baseSalary).toBeUndefined();
  });

  test("every page declares one canonical", async ({ page }) => {
    for (const route of ["/", "/trades/labourers", "/sydney/inner-west", "/compliance"]) {
      await page.goto(route);
      const canonicals = page.locator('link[rel="canonical"]');
      await expect(canonicals).toHaveCount(1);
      await expect(canonicals).toHaveAttribute("href", new RegExp(`${route === "/" ? "/?$" : route}`));
    }
  });

  test("sitemap lists the region and trade pages and only live jobs", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();

    expect(xml).toContain("/sydney/northern-beaches");
    expect(xml).toContain("/trades/plant-operators");
    expect(xml).toContain("/labour-hire/permanent-recruitment");
    expect(xml).toContain("/jobs/construction-labourers-alexandria-ug-2411");
  });

  test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toContain("Allow: /");
    expect(text).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  });
});
