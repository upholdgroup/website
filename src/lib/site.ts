const FALLBACK_URL = "https://www.upholdgroup.com";

/**
 * Resolves the canonical origin from the first usable candidate.
 *
 * Environment variables are strings, so a variable that is declared but left
 * blank arrives as `""` rather than `undefined` — `??` would pass that straight
 * to `new URL()` and fail the build. Vercel also supplies its domains without a
 * scheme (`my-app.vercel.app`), so one is added when missing.
 */
export function resolveSiteUrl(
  candidates: readonly (string | undefined)[],
  fallback: string = FALLBACK_URL,
): string {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // Malformed value — try the next candidate rather than break the build.
    }
  }
  return fallback;
}

export const site = {
  name: "Uphold Group",
  wordmark: { top: "UPHOLD", bottom: "GROUP" },
  headline: "We are building something for you",
  subline: "Our new home is under construction. It won't be long.",
  email: "hello@upholdgroup.com",
  description:
    "Uphold Group is building a new home on the web. Our site is under construction — reach us in the meantime.",
  url: resolveSiteUrl([
    process.env.NEXT_PUBLIC_SITE_URL,
    // Set automatically by Vercel: the stable production domain, then the
    // per-deployment URL so previews get correct absolute links too.
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ]),
} as const;
