# Deploying Uphold Group

Everything needed to take this from a laptop to a live site, and to keep the
data on it safe once it is there.

- [1. What this is](#1-what-this-is)
- [2. Environment variables](#2-environment-variables)
- [3. The database](#3-the-database)
- [4. Email](#4-email)
- [5. Deploying](#5-deploying)
- [6. The first hire desk account](#6-the-first-hire-desk-account)
- [7. After every deploy](#7-after-every-deploy)
- [8. Backups](#8-backups)
- [9. Retention, and what must never be deleted](#9-retention-and-what-must-never-be-deleted)
- [10. Restoring](#10-restoring)
- [11. Rotating secrets](#11-rotating-secrets)
- [12. Still outstanding](#12-still-outstanding)

---

## 1. What this is

Next.js 16 (App Router) on Node, Tailwind v4, Supabase Postgres, Resend for
email. 57 routes, almost all statically generated; the admin and the forms are
dynamic.

There is no separate API. Forms post to Server Actions, and the admin reads and
writes Postgres from server components. Nothing in a browser ever holds a
database key.

**Two drivers, one interface.** `src/lib/db/client.ts` picks the store from the
environment: Supabase when `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are both
set, otherwise a JSON file at `.data/uphold.json`. The JSON store is for
development only and refuses writes on a managed host, because that filesystem
does not survive the request. If the site is live and enquiries are vanishing,
this is the first thing to check: `npm run db:check`.

---

## 2. Environment variables

Copy `.env.example` to `.env.local` for development. On Vercel, set the same
keys under **Project Settings → Environment Variables**, for Production and
Preview both.

> The current live values are transcribed in **`DEPLOYMENT-SECRETS.md`**, ready
> to paste. That file is gitignored and deliberately not part of this guide:
> this one is meant to be committed, and a secret that reaches git history
> stays there even after it is deleted. Remove the secrets file once the host
> is configured — `rm DEPLOYMENT-SECRETS.md`.

### The fast way to enter them

```bash
npm run env:copy
```

Puts the whole block on your clipboard. Then in Vercel → Project Settings →
Environment Variables → **Add New**, paste it into the **Key** field: the form
parses a `.env` block and splits it into one row per variable, so it is a
single paste rather than seven. Tick **Production** and **Preview**, save.

The script prints variable names only, never values — a terminal scrollback is
a log, and these keys can read every enquiry in the database.

Two things to check after pasting:

- **`NEXT_PUBLIC_SITE_URL`** must match the live domain exactly, `www` included
  or excluded as appropriate. It is the one value that should differ between
  Production and Preview.
- **`EMAIL_FROM`** contains spaces and angle brackets. Confirm Vercel kept it
  as one value and did not trim the quotes.

Going the other way, `vercel env pull .env.local` writes the host's values back
to your machine, which is the quickest way to check the two match.

| Variable | Required | Where it comes from |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Your canonical origin, e.g. `https://www.upholdgroup.com.au`. Drives `robots.txt`, `sitemap.xml`, canonical tags and JSON-LD. Wrong value = wrong URLs in Google. |
| `SUPABASE_URL` | Production | Supabase → Project Settings → Data API → Project URL. |
| `SUPABASE_SECRET_KEY` | Production | Supabase → Project Settings → API Keys → **Secret keys**, starts `sb_secret_`. Never the publishable key: RLS is on with no policies, so a publishable key reads nothing. |
| `RESEND_API_KEY` | Production | Resend → API Keys. Without it, enquiry emails are written to the server log instead of sent, and the admin shows a banner saying so. |
| `EMAIL_FROM` | Production | Must be an address on a **verified** Resend domain, e.g. `Uphold Group <admin@upholdgroup.com.au>`. |
| `ADMIN_EMAILS` | Once | The address allowed to claim the first hire desk account. Only usable while no accounts exist. |
| `ADMIN_SESSION_SECRET` | Production | `openssl rand -hex 32`. Signs the admin session cookie. **The admin refuses to serve without it in production** rather than defaulting to something guessable. |
| `TELEGRAM_BOT_TOKEN` | Optional | From @BotFather in Telegram. Alerts the desk the moment an enquiry lands. See §4. |
| `TELEGRAM_CHAT_ID` | Optional | The chat or group to alert. `npm run telegram:check` finds it for you. |

`ALLOW_LOCAL_STORE=1` exists to force the JSON store on a managed host. It is
for debugging only, and it will lose data. Do not set it in production.

---

## 3. The database

Once per project:

1. Supabase → **SQL Editor** → paste all of `supabase/schema.sql` → Run.
   It is idempotent (`create table if not exists`, `add column if not exists`),
   so running it again after a schema change is safe.
2. Optionally seed the job board: `supabase/seed-jobs.sql`.
3. Verify from your machine:

   ```bash
   npm run db:check
   ```

   It connects exactly as the app does, confirms every table **and every
   expected column** exists, and reports row counts. It writes nothing.

### Migrations

`supabase/schema.sql` is the full current shape, for a fresh project. An
**existing** database needs the files in `supabase/migrations/` instead, run in
order, in the SQL editor.

> **Run before the next deploy:** `supabase/migrations/001-archive-enquiries.sql`
>
> Adds `enquiries.deleted_at`. The application filters on it, so until this
> runs the admin enquiries list fails with *"column enquiries.deleted_at does
> not exist"*. Adding a nullable column touches no existing data.

Run migrations **before** deploying the code that needs them — the old code
ignores a column it does not know about, but new code cannot invent one. And
run `npm run db:backup` first, always.

After any migration, confirm with `npm run db:check`; it fails loudly on a
missing column rather than leaving you to find it through a broken page.

**Row level security is on for all three tables, with no policies at all.**
That is deliberate, not an oversight. The service-role key bypasses RLS; anon
and authenticated roles get nothing. No browser queries these tables directly,
so there is no policy to write. If you ever expose a table to the client, that
decision changes and you must add policies first.

---

## 4. Email

Enquiries are saved to the database **before** they are emailed, and a mail
failure is logged rather than thrown. A visitor never loses a submission
because Resend was down. But nobody is notified either, so this matters.

1. Resend → **Domains** → add `upholdgroup.com.au`.
2. Add the DKIM, SPF and DMARC records Resend gives you at your DNS host.
3. Wait for **Verified**.
4. Test end to end:

   ```bash
   npm run email:check -- you@example.com
   ```

Until the domain is verified, Resend will only deliver to the address that owns
the account, and real enquiries will reach nobody.

---

### Telegram alerts

Email is the record the desk works from. Telegram is the thing that gets
someone to the phone: a builder ringing at 5:50am is comparing you against
whoever answers first, and an email in a shared inbox does not win that.

Free at any volume, unlike SMS, and a group chat means the whole desk sees the
same alert rather than one person being a single point of failure.

1. In Telegram, message **@BotFather** → `/newbot` → name it → it returns a
   token. Put that in `TELEGRAM_BOT_TOKEN`.
2. Create a group for the desk and add the bot to it, then send any message in
   it. (A direct chat with the bot works too, if it is only ever you.)
3. Find the chat id:

   ```bash
   npm run telegram:check
   ```

   With the token set and the chat id not, it lists every chat the bot can see
   and their ids. Put the right one in `TELEGRAM_CHAT_ID`.
4. Run it again with both set and it sends a real alert, formatted exactly as
   an enquiry will be.
5. Set both in Vercel and redeploy.

Unset, this no-ops: the site runs identically and the enquiry still saves and
emails. The two channels are settled independently, so neither can delay or
suppress the other, and neither can hold up the visitor waiting on the form.

## 5. Deploying

Vercel is the path of least resistance for this stack.

1. Push to GitHub, import the repo in Vercel.
2. Framework preset: **Next.js**. Build command and output directory are
   detected; do not override them.
3. Add every variable from section 2 to Production and Preview.
4. Deploy.
5. Add the custom domain, and set `NEXT_PUBLIC_SITE_URL` to match it exactly,
   including `www` or its absence. A mismatch produces canonical tags pointing
   at a domain that redirects.

**Node version**: Vercel defaults to a current LTS, which is correct. Pin it
in Project Settings only if a dependency forces you to.

Anywhere else that runs a Node server works too (`npm run build && npm start`).
The only hard requirement is a real Node runtime: the admin uses `node:crypto`
for scrypt password hashing and TOTP, which a pure edge runtime does not have.

---

## 6. The first hire desk account

1. Set `ADMIN_EMAILS` to the address that will own the first account.
2. Visit `/admin`. With no accounts in the database it offers to create one.
3. Set a password, then enrol an authenticator app (TOTP).
4. **Save the recovery codes.** They are shown once and stored only as hashes.
   Losing both the phone and the codes means editing the database by hand.

After that first account exists, `ADMIN_EMAILS` stops mattering. The
`admin_users` table is the only list that counts, and access is removed by
removing the user, not by editing the variable.

Two roles: `admin` can do anything including managing people; `manager` is the
recruiter seat, which reads and writes roles and enquiries but cannot manage
users or archive records.

---

## 7. After every deploy

```bash
npm run db:check      # tables and columns present, driver is supabase
```

Then by hand, once:

- Submit the labour request form. Confirm the row appears in `/admin/enquiries`
  and the email arrives.
- Submit the worker registration form. Same check.
- Sign in to `/admin`, post a job, confirm it appears on `/jobs`, on its trade
  page, on its region page, and in `/sitemap.xml`.
- Load `/robots.txt` and `/sitemap.xml` and confirm the domain is right.
- Confirm `/admin` returns `X-Robots-Tag: noindex` and is not in the sitemap.

---

## 8. Backups

**Supabase's free plan takes daily backups and has no point-in-time recovery.**
Anything written after the last daily snapshot is unrecoverable. These tables
are the only record of who asked for a crew and who registered for work.

```bash
npm run db:backup
```

Writes every row of every table to `backups/uphold-<timestamp>.json`. Reads
only, so it is safe against production at any time. It writes the file only
after every table has been read successfully: a partial file that looks like a
backup is worse than no file.

The directory is gitignored. **The file contains personal information and
password hashes** — treat it like the database itself.

Run it:

- before running any retention query,
- before a schema change,
- on a schedule you actually keep.

If this data matters commercially, the Supabase Pro plan adds point-in-time
recovery, which is the real answer. This script is the floor, not the ceiling.

---

## 9. Retention, and what must never be deleted

**Nothing in the application deletes an enquiry.** The admin's "Archive" sets
`deleted_at`, hides the row from the inbox, and offers it back under
**View → Archive**. Permanent removal happens only by running SQL against the
database, deliberately, after a backup.

That is a direct response to two obligations that pull against each other:

- **Privacy Act 1988 (Cth), APP 11.2** — personal information must be destroyed
  or de-identified once it is no longer needed. Keeping everything forever is
  not compliant.
- **Fair Work Act 2009 (Cth), s535** — employee records must be kept **seven
  years**. A worker you have placed is your employee. Their records are not
  yours to clear on a 12-month cycle.

So a blanket purge is wrong in both directions. The queries at the foot of
`supabase/schema.sql` cover only rows that are neither: enquiries archived in
the admin more than 90 days ago, and closed enquiries over 12 months old that
never became a placement — and that second list should be read before it is
run, not piped straight into a `delete`.

Never run an unfiltered `delete` against `enquiries`. A `delete ... where
reference != ''` destroyed live rows on this project once already.

---

## 10. Restoring

**A single enquiry**: `/admin/enquiries?view=archived` → open it → Restore.

**From a backup file**: the snapshot is plain JSON, one array per table, in the
column shape Postgres expects. To put rows back, use the Supabase SQL editor or
the Table Editor's import. There is deliberately no automated restore script:
restoring is rare, destructive if wrong, and should be done by someone looking
at what they are about to overwrite.

Before restoring anything into a live table, take a fresh backup first. You are
about to change the thing you might need to go back to.

---

## 11. Rotating secrets

Any key that has been pasted into a chat, an email or a ticket is compromised
and should be rotated. Both of the keys used to build this site have been.

- **Supabase**: Project Settings → API Keys → revoke and issue a new secret
  key. Update `SUPABASE_SECRET_KEY` in Vercel, redeploy.
- **Resend**: API Keys → revoke, create, update `RESEND_API_KEY`, redeploy.
- **`ADMIN_SESSION_SECRET`**: generate a new one. Every signed-in session ends
  immediately, which is the point when you are rotating it after an incident.

---

## 12. Still outstanding

Live items at the time of writing, each of which changes copy already on the
site:

- **Phone number.** `1300 874 653` in `src/lib/site.ts` is not confirmed.
  It appears in the header, footer, contact page, forms, the mega menu and the
  `EmploymentAgency` structured data.
- **Resend domain not verified.** Until it is, enquiry emails reach nobody.
- **Insurance.** `icare workers compensation` and public liability are marked
  *Being established* / *Being arranged* on `/compliance`. The day each policy
  binds, update `src/app/(site)/compliance/page.tsx` and the compliance FAQ in
  `src/lib/content/site-facts.ts`, and consider putting the cover back into the
  hero proof chips in `src/lib/site.ts`.
- **Operational stats.** `1,240 workers`, `98.4% shifts filled`, `0 LTI over 24
  months` and `4hrs average fill` in `src/lib/content/site-facts.ts` were
  written as placeholders and are presented as measured figures. The safety
  record is the one least worth defending unmeasured.
- **Region detail.** Each region in `src/lib/content/regions.ts` carries a
  `project` line describing local work. These are illustrative, not real.
- **Four `CONFIRM` markers** in `src/lib/content/privacy.ts`: the Supabase
  region, the retention period, the cookie claim and annual turnover (which
  determines whether the Privacy Act applies to you at all).
- **NSW Security Master Licence number**, if the security service is offered.
