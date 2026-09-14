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
