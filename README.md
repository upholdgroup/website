# Uphold Group

Construction labour hire and recruitment across Greater Sydney. A two-sided
marketing site: **hosts** (builders who need a crew) and **workers** (trades and
labourers who need a shift), split at the hero and never mixed on one page.

Built to the supplied design system in `uphold-group/`:

- `design-system.md` — tokens, components, UX rules
- `seo-content-strategy.md` — keyword architecture, site map, structured data
- `Uphold Group Design System.dc.html` / `Wireframes.dc.html` / `Landing.dc.html`

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for environment variables, the database
and migrations, backups, data retention and the go-live checklist.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS v4, tokens declared once in `src/app/globals.css`
- Archivo via `next/font/google`, one typeface across the whole site
- Postgres via Supabase, with a local JSON fallback — see [Data](#data)
- Resend for transactional email
- Playwright, Chromium and iPhone 13 projects

Public routes prerender to static HTML. The only client components are the
header sheet, the trade accordion, the testimonial carousel, the job filters,
the two public forms and the admin forms.

## Data

`src/lib/db/` exposes repositories; one place decides what backs them:

| Condition | Driver |
| --- | --- |
| `SUPABASE_URL` + `SUPABASE_SECRET_KEY` set | Supabase Postgres |
| otherwise | local JSON at `.data/uphold.json`, seeded from `src/lib/content/jobs.ts` |

So a fresh checkout runs, and the whole write path is exercisable, with no
accounts. The local driver refuses writes on a managed host (`VERCEL`,
`NETLIFY`, Lambda) because the file would not survive the request — override
with `ALLOW_LOCAL_STORE=1` only if you self-host on a persistent disk.

### Switching to Supabase

1. Create a project at [supabase.com](https://supabase.com). Any region near
   Sydney. Save the database password it gives you, even though the app does
   not use it directly.
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, Run. It
   creates `jobs`, `enquiries` and `admin_users`, and enables row level
   security with no policies, which is deliberate: the app talks to these with
   the service role key from server code only, so the anon key gets nothing and
   no browser ever queries them directly.
3. Optionally run `supabase/seed-jobs.sql` as well, which fills the board with
   the same starter roles the local store uses. Without it the new database is
   empty and `/jobs` shows nothing until you post one.
4. **Project Settings → API Keys**: copy the Project URL and the **secret key**,
   the one starting `sb_secret_` under "Secret keys". Not the publishable key:
   that is the browser key and cannot read these tables, by design. Supabase
   renamed these recently, so an older project shows `service_role` instead;
   it is the same thing.

   The secret key bypasses row level security, so it belongs in server
   environment variables only. Never `NEXT_PUBLIC_`, never in the browser,
   never committed.
5. Put both in `.env.local`, and in Vercel's project environment variables for
   production:

   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

   `SUPABASE_SERVICE_ROLE_KEY` still works as a variable name if you prefer it.

6. `npm run db:check`. It connects exactly as the app does, confirms all three
   tables and reports what is in them. It writes nothing, so it is safe against
   a live database.
7. `npm run dev`, open `/admin`. The orange banner about the local store
   disappears once it is talking to Postgres.

The new database has no accounts, so the first thing you will see is "Create the
first account" again. That account is separate from anything in
`.data/uphold.json`; the local store is development data and is not migrated.

## Admin

Two seats, enforced in every action and not only in the markup
(`src/lib/permissions.ts`):

| | Recruiter (`manager`) | Admin |
| --- | --- | --- |
| Post, edit and close roles | yes | yes |
| Read enquiries, assign them, change status | yes | yes |
| Add and remove people, change roles | no | yes |
| Reset someone's two step | no | yes |
| Permanently delete a role or an enquiry | no | yes |

The role is read from the database on **every request**, not carried in the
session cookie, so a demotion or a removed account takes effect on the next
click rather than in eight hours.

Screens: `/admin` is the board (live roles, new enquiries, roles closing within
a fortnight), `/admin/jobs` posts and closes roles, `/admin/enquiries` is the
inbox with filters by type and status, and `/admin/people` is admin only.

**Adding someone:** an admin creates the account and gets a temporary password
shown once on screen. The new user must replace it before they can reach
anything, then enrol an authenticator. The temporary password never becomes a
standing credential.

`/admin` — sign in with a magic link, post, edit and expire roles. Mobile-first,
because the point is posting a role at 6am from a ute.

Sign-in is **email and password, then a six digit code from an authenticator
app**. Accounts live in the database; no third party identity provider is
involved.

- Passwords are **scrypt** hashes (`node:crypto`, parameters stored with the
  hash so the cost can be raised later without invalidating anyone).
- The second factor is **TOTP**, RFC 6238, enrolled by scanning a QR rendered
  on the server. Ten single-use **recovery codes** are shown once and stored
  only as hashes.
- Sign-in is **two staged**: the password sets a ten minute pending cookie, and
  only the code turns it into a session. The stage is inside the signed
  payload, so a pending cookie cannot be renamed into a finished one.
- **Five failed attempts locks the account for fifteen minutes.** An unknown
  address and a wrong password return the same message, and take comparable
  time, so the form cannot be used to find out who has an account.
- Sessions are HMAC-signed, `httpOnly`, eight hours. `secure` follows the
  actual connection, not `NODE_ENV`, because a production build served over
  plain HTTP would otherwise set a cookie the browser throws away.

The **first account** can be claimed at `/admin/login` only while the table is
empty, and only by an address named in `ADMIN_EMAILS`, and it becomes an admin.
After that the `admin_users` table is the only list that matters, `ADMIN_EMAILS`
stops being consulted, and access is granted and revoked at `/admin/people`.

Two layers, per the Next.js authentication guide: `src/proxy.ts` does the
optimistic cookie check, and `verifySession()` (`src/lib/auth.ts`) runs inside
every admin page and every admin action, next to the data. The allow-list is
re-checked on every request, so removing an address takes effect immediately
rather than in eight hours.

Publishing validates server-side — the slug is unique, the closing date is in
the future, the trade and region exist, and **no field contains a rate figure**.
That last one matters: the no-rates rule was previously guarded by a test over
static files, which stops being enough the moment a human can type free text.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm test             # Playwright, desktop + mobile
```

`npm test` builds and serves on port **3210** rather than 3000, so a dev server
for another project sitting on 3000 cannot be tested by accident. Override with
`PLAYWRIGHT_PORT`. First run needs browsers: `npx playwright install chromium webkit`.

To use `/admin` locally, put `ADMIN_EMAILS` and `ADMIN_SESSION_SECRET` in
`.env.local` (see `.env.example`), then open `/admin/login` and create the first
account. You will need an authenticator app to finish.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Home — hero, two doors, trades, stats, regions, jobs, FAQ |
| `/labour-hire` + `/labour-hire/[slug]` | Host hub and the four engagement types |
| `/trades` + `/trades/[slug]` | Six trade pages: tickets held, scope, brief, FAQs |
| `/sydney` + `/sydney/[slug]` | Eight Greater Sydney regions |
| `/jobs` + `/jobs/[slug]` | Filterable board and indexable role pages |
| `/workers`, `/workers/register` | Pay, super, safety, and the 2-step registration |
| `/compliance` | What we hold and how we verify — the AI-citable page |
| `/projects`, `/request-labour`, `/contact` | Proof, the 3-step host form, NAP |
| `/admin/*` | Hire desk. Signed in, `noindex`, outside the `(site)` chrome |

## The rules this build enforces

**No published rates, anywhere.** No pricing page, no rate tables, no rate
column on job rows, no `baseSalary` in `JobPosting`. Where a number would sit,
`InclusionsCard` states what the hour includes and offers a same-day written
quote. `tests/no-rates.spec.ts` walks nineteen routes and fails on any
rate-shaped figure, so the rule cannot quietly erode.

**Sydney, explicitly.** Every page names Greater Sydney; region pages name their
suburbs in body copy and each ships with a local project and a local role — a
region page without those is a doorway page.

**The two surfaces carry meaning.** Ink `#111111` is the host path, warm grey
`#F4F4F2` is the worker path. Holding that consistently is how a visitor tells
the two journeys apart at a glance, so do not swap them for variety.

**The phone is a first-class CTA.** Click-to-call sits beside every primary
button, and a fixed bottom bar keeps both within one screen on mobile.

**Stale jobs expire.** `getLiveJobs()` drops anything past its `validThrough`,
and `jobPostingSchema` is withheld on an expired role even though the page still
resolves for anyone holding the link.

## Content

All copy lives in `src/lib/content/` as typed data, not in JSX:

| File | What to edit |
| --- | --- |
| `trades.ts` | The six trades — accordion copy, tickets, scope, FAQs |
| `regions.ts` | The eight regions — suburbs, character, demand, local project |
| `services.ts` | Casual / contract / permanent / payroll |
| `jobs.ts` | The `Job` type and the seed a fresh store starts from — live roles are edited at `/admin` |
| `projects.ts`, `testimonials.ts`, `site-facts.ts` | Proof, quotes, stats, FAQs |
| `src/lib/site.ts` | NAP, phone, hire-desk hours, ABN, proof chips |

## Before going live

1. **Photography.** `SitePhoto` renders drawn line art with a mono caption
   naming the shot that belongs there — the design system forbids stock hi-vis,
   so nothing fake ships in the meantime. Pass `src` (a file in `/public`) and
   the placeholder is replaced by an optimised `next/image` with no layout
   change. The homepage hero is the LCP element: serve AVIF/WebP.
2. **Create the accounts and set the keys.** Supabase (run `supabase/schema.sql`),
   Resend (verify the `EMAIL_FROM` sender), then `ADMIN_EMAILS` and
   `ADMIN_SESSION_SECRET`. Until Supabase is set, a posted role lives in a
   local file; until Resend is set, enquiry emails are only logged. The admin
   shows a banner for both, so this cannot be missed by accident.
3. **Ticket photos are still discarded.** The registration form accepts them and
   only the filenames reach the enquiry — the desk email says so explicitly.
   Storing them means private object storage, signed URLs, a retention policy
   and role-based access, because they are licence and visa evidence.
4. **Real details.** Phone, ABN, address, hire-desk hours and consultant names
   in `src/lib/site.ts` and `src/lib/enquiries.ts` are placeholders.
5. **Set `NEXT_PUBLIC_SITE_URL`** — see `.env.example`. `resolveSiteUrl` skips
   blank values, because a Vercel variable declared with no value arrives as
   `""` rather than `undefined`, and `??` would pass that to `new URL()` and
   fail the build.
6. **Google Business Profile** for the Alexandria office, service areas set to
   the eight regions rather than "Australia" — per the SEO strategy this is the
   larger growth lever than sitewide rankings.

## Deploying

Stock Next.js, so Vercel needs no configuration:

```bash
npx vercel --prod
```

## Motion

**Between routes.** `PageTransition` wraps the site's `main` and is keyed on the
pathname, so React treats each route as an exit/enter pair and the browser's
View Transitions API crossfades and lifts the content. The header is pinned with
`viewTransitionName: "site-header"` so it never moves: the reader keeps one
fixed reference point. The active nav pill is a single named element, so it
glides to the new section instead of blinking off and on. The wrapper has to
live in the layout rather than in each page, but keyed, because an unkeyed
layout persists across navigation and would never fire.

**Down the page.** Every `Section` fades in as it arrives, and the items inside
it (cards, tiles, job rows, FAQ answers, accordion rows, inclusion lines,
testimonials) rise 26px on a stagger. The band fade is opacity only and quick
on purpose: two competing movements on the same content reads as lag rather
than polish. Operational stats count up to their real figures, cards lift on
hover on pointer devices, arrows nudge toward their link, and a hairline
progress bar tracks reading position under the header.

**On arrival.** The hero photo scales in and the headline and proof chips rise,
so the first screen is not static either.

Three rules keep it out of the way, all tested. The reveal attribute is applied
only **after mount**, so server rendered HTML is never the hidden state: a
crawler, or a reader with JavaScript off, gets the finished page. Under
`prefers-reduced-motion` nothing animates and nothing is left hidden behind a
transition that will not run. And `::view-transition { pointer-events: none }`
means a click during a route change is not swallowed by the overlay.

## Copy

Two house rules, both enforced by `tests/design.spec.ts` across every route:

- **No em-dashes.** Use a comma, a colon, a semicolon or a full stop.
- **One typeface.** Archivo everywhere, including `code` and form controls.
  Eyebrows read as their own layer through case, tracking and weight.

## Accessibility

44px minimum targets throughout (phones, sunlight, gloves), a 2px orange focus
ring at 2px offset, a skip link, gradient scrims under any overlay text, no
hover-only affordances, and `prefers-reduced-motion` honoured globally. Both
forms return to the step that owns a validation error rather than reporting it
inside a hidden fieldset.
