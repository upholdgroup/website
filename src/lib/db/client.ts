import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isManagedHost } from "@/lib/platform";

/**
 * Which store is backing the repositories.
 *
 * `supabase` the moment both variables are present; `local` otherwise — a JSON
 * file seeded from `src/lib/content/jobs.ts`, so the site renders exactly what
 * it rendered before this layer existed and the whole write path is testable
 * before any account exists.
 *
 * `local` is a development and CI store only. A managed platform's filesystem
 * is ephemeral and read-only, so a write there throws rather than accepting a
 * job that would vanish on the next request.
 */
export type Driver = "supabase" | "local";

const url = process.env.SUPABASE_URL?.trim();

/**
 * Supabase renamed its keys: the old `service_role` JWT is now a **secret key**
 * (`sb_secret_…`), alongside a publishable key that replaces `anon`. Both
 * variable names are accepted so an older project and a new one work the same,
 * and either key does the same job: full access, bypassing row level security.
 */
const serviceKey = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

export const driver: Driver = url && serviceKey ? "supabase" : "local";

let client: SupabaseClient | null = null;

/** The service-role client. Server-only — it bypasses row level security. */
export function supabase(): SupabaseClient {
  if (driver !== "supabase") {
    throw new Error("Supabase is not configured. SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
  }
  client ??= createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/**
 * True while `next build` is prerendering.
 *
 * Set by Next itself (see PHASE_PRODUCTION_BUILD in its constants), and the
 * only way to tell a page being generated at build time from the same page
 * being rendered for a visitor. The two want opposite behaviour when the
 * database is unreachable, which is what `readWithRetry` below uses it for.
 */
export const isBuildPhase = (): boolean =>
  process.env.NEXT_PHASE === "phase-production-build";

/**
 * A read that survives a bad minute at the database.
 *
 * supabase-js returns a 504 as a value on `error`, not as a thrown exception,
 * so a single Gateway Timeout used to propagate straight out of a repository
 * and fail the whole deploy. A production build renders 58 pages and most of
 * them read jobs; one blip anywhere in that took the site down with it, and
 * blocked every unrelated change in the same push.
 *
 * So: retry transient failures, then diverge.
 *
 * At build time a still-failing read degrades to `fallback` and the deploy
 * completes. Shipping a sitemap briefly short of its job URLs is a small,
 * self-healing cost; a failed deploy is a total one, and it blocks everything
 * behind it. The next build, or the next tag invalidation, puts them back.
 *
 * At runtime it throws, because a visitor silently seeing an empty job board
 * is worse than an error the desk can see and act on.
 */
export async function readWithRetry<T>(
  what: string,
  /* PromiseLike, not Promise: a Supabase query builder is a thenable that
     only becomes a request when it is awaited. */
  read: () => PromiseLike<{ data: T | null; error: { message: string } | null }>,
  fallback: T,
): Promise<T> {
  const attempts = 3;
  let last = "";

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { data, error } = await read();
    if (!error) return data as T;

    last = error.message;
    // Only worth retrying what might succeed next time. A malformed query or
    // a missing column will fail identically three times and just slow the
    // build down while it does.
    const transient = /timeout|gateway|fetch failed|network|socket|ECONN|503|504|429/i.test(
      error.message,
    );
    if (!transient || attempt === attempts) break;

    await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** (attempt - 1)));
  }

  if (isBuildPhase()) {
    console.error(
      `[uphold] BUILD DEGRADED: could not read ${what} after ${attempts} attempts (${last}). ` +
        `Continuing with an empty result so the deploy is not blocked. ` +
        `This content will be missing until the next build or revalidation.`,
    );
    return fallback;
  }

  throw new Error(`Could not read ${what}: ${last}`);
}

/**
 * Guards every write to durable content.
 *
 * The test is the platform, not NODE_ENV: `next start` on a laptop and a CI
 * run are both NODE_ENV=production, and the local store is entirely legitimate
 * there. What is not legitimate is a managed host with an ephemeral disk,
 * where a posted job would vanish on the next request.
 *
 * `ALLOW_LOCAL_STORE=1` is the escape hatch for self-hosting on a box with a
 * real, persistent volume.
 */
export function assertWritable(): void {
  if (driver === "local" && isManagedHost() && process.env.ALLOW_LOCAL_STORE !== "1") {
    throw new Error(
      "Refusing to write to the local JSON store on a managed host, the file would not survive the request. Set SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }
}
