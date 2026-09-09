import { expect, test } from "@playwright/test";
import { resolveSiteUrl } from "../src/lib/site";

const FALLBACK = "https://fallback.example";

test.describe("resolveSiteUrl", () => {
  test("uses the first usable candidate", () => {
    expect(resolveSiteUrl(["https://a.example", "https://b.example"], FALLBACK)).toBe(
      "https://a.example",
    );
  });

  test("skips blank values, which is how Vercel reports an unset variable", () => {
    expect(resolveSiteUrl([""], FALLBACK)).toBe(FALLBACK);
    expect(resolveSiteUrl(["   "], FALLBACK)).toBe(FALLBACK);
    expect(resolveSiteUrl([undefined], FALLBACK)).toBe(FALLBACK);
    expect(resolveSiteUrl([], FALLBACK)).toBe(FALLBACK);
    expect(resolveSiteUrl(["", "https://b.example"], FALLBACK)).toBe("https://b.example");
  });

  test("adds a scheme to bare hostnames, as VERCEL_URL supplies them", () => {
    expect(resolveSiteUrl(["uphold-website.vercel.app"], FALLBACK)).toBe(
      "https://uphold-website.vercel.app",
    );
  });

  test("falls through malformed values instead of throwing", () => {
    expect(resolveSiteUrl(["http://", "https://good.example"], FALLBACK)).toBe(
      "https://good.example",
    );
    expect(resolveSiteUrl(["http://"], FALLBACK)).toBe(FALLBACK);
  });

  test("normalises to an origin, dropping any path or trailing slash", () => {
    expect(resolveSiteUrl(["https://a.example/"], FALLBACK)).toBe("https://a.example");
    expect(resolveSiteUrl(["https://a.example/some/path"], FALLBACK)).toBe("https://a.example");
  });
});
