# Uphold Group — under construction

A single-page holding site for Uphold Group: a line-art construction scene that
pans slowly across the horizon, with a headline and a build-progress bar.

Design reference: [Under Construction Loader by Hill Motion](https://dribbble.com/shots/22033552-Under-Construction-Loader).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- Playwright for browser tests

The page ships **zero client-side JavaScript**. Everything — the panning scene,
the progress bar, the entrance transitions — is inline SVG plus CSS keyframes,
so the whole route prerenders to static HTML.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm test             # Playwright, Chromium + WebKit
```

First test run needs browsers: `npx playwright install chromium webkit`.

## Deploying to Vercel

The project is a stock Next.js app, so Vercel needs no extra configuration.

```bash
npx vercel           # preview
npx vercel --prod    # production
```

Or import the repository at [vercel.com/new](https://vercel.com/new) — the
framework preset, build command and output directory are all detected.

### Canonical URL

`robots.txt`, `sitemap.xml` and the Open Graph tags need an absolute origin.
`resolveSiteUrl` in `src/lib/site.ts` takes the first usable value from:

1. `NEXT_PUBLIC_SITE_URL` — set this to the production origin (see `.env.example`)
2. `VERCEL_PROJECT_PRODUCTION_URL` — supplied by Vercel, the stable domain
3. `VERCEL_URL` — supplied by Vercel, the per-deployment URL, so previews are correct
4. the hard-coded fallback in `src/lib/site.ts`

Blank values are skipped rather than used. A variable declared in the Vercel
dashboard with no value arrives as `""`, not `undefined`, so `??` is not enough
to guard this — that mistake fails the build with `TypeError: Invalid URL`.
Bare hostnames get an `https://` prefix, since Vercel supplies its domains
without a scheme.

## Customising

| What | Where |
| --- | --- |
| Company name, headline, subline, contact email | `src/lib/site.ts` |
| Colours (light + dark) and animation timings | `src/app/globals.css` |
| The construction artwork | `src/components/ConstructionScene.tsx` |
| Wordmark and logo mark | `src/components/Logo.tsx` |
| Social card | `src/app/opengraph-image.tsx` |

The palette hangs off three tokens — `--brand`, `--brand-line` and
`--brand-soft` — declared once for light mode and again under
`prefers-color-scheme: dark`. Changing those three re-skins the entire page,
scene included.

### How the scene loops

Each pan track holds three identical tiles laid out in a row. Translating the
track by exactly `-33.3333%` moves it by one whole tile, so the loop is seamless
at any viewport size without hard-coding pixel widths. A second, slower track of
smaller planting sits behind it for parallax.

Every symbol is drawn with its origin on the ground line (`y = 0`, building
upward into negative `y`) and placed with `translate(x, GROUND)`. `GROUND` is
the bottom edge of the viewBox, so the tiles meet the container's bottom border,
which draws the horizon as one continuous line.

Symbols take an explicit `Palette` rather than reading CSS variables directly.
The live page passes the themed `cssPalette`; the Open Graph card passes literal
hex values, because satori cannot resolve custom properties. That lets the
social card reuse the exact same artwork instead of keeping a second copy.

## Accessibility

- The scene is a single labelled `role="img"`; its SVG tiles are `aria-hidden`.
- The progress bar exposes `role="progressbar"` with its current value.
- `prefers-reduced-motion: reduce` stops all motion and shows the bar at rest.

## Notes before going live

- `hello@upholdgroup.com` in `src/lib/site.ts` is a placeholder — swap it for a
  real inbox.
- The progress bar eases to 68% and stays there. It is decorative and
  deliberately never reaches 100%.
