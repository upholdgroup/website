/**
 * Checks the Supabase connection the way the app will use it.
 *
 * Run with `npm run db:check`. It reads .env.local, connects with the service
 * role key, confirms every table the app needs, and reports what is in them.
 * Nothing is written, so it is safe to run against a live database.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.trim();
// Supabase renamed service_role to a secret key (sb_secret_…). Accept either
// variable name so an older project and a new one both work.
const key = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

const tick = (ok) => (ok ? "[32mOK[0m  " : "[31mFAIL[0m");
const line = (label, ok, detail = "") => console.log(`${tick(ok)} ${label}${detail ? ` — ${detail}` : ""}`);

if (!url || !key) {
  console.log("\nNot configured. The app is using the local JSON store at .data/uphold.json.\n");
  line("SUPABASE_URL", Boolean(url), url ? "" : "missing from .env.local");
  line("SUPABASE_SECRET_KEY", Boolean(key), key ? "" : "missing from .env.local");
  console.log("\nAdd both to .env.local, then run this again.\n");
  process.exit(1);
}

// The publishable key connects happily and then sees nothing, because row
// level security is on with no policies. Catch it here rather than let it look
// like an empty database.
if (key.startsWith("sb_publishable_") || key.includes("anon")) {
  console.log("\nThat is the publishable key. Use the secret key instead, the one that");
  console.log("starts sb_secret_ and sits under \"Secret keys\" in Project Settings → API Keys.");
  console.log("The publishable key cannot read these tables: row level security is on");
  console.log("with no policies, which is what keeps them out of the browser.\n");
  process.exit(1);
}

console.log(`\nConnecting to ${url}\n`);

const db = createClient(url, key, { auth: { persistSession: false } });

const TABLES = [
  ["jobs", "job listings"],
  ["enquiries", "labour requests and worker registrations"],
  ["admin_users", "hire desk accounts"],
];

let failed = false;

for (const [table, what] of TABLES) {
  const { count, error } = await db.from(table).select("*", { count: "exact", head: true });

  if (error) {
    failed = true;
    const missing = /does not exist|schema cache/i.test(error.message);
    line(
      `table "${table}"`,
      false,
      missing ? "not found. Run supabase/schema.sql in the SQL editor" : error.message,
    );
  } else {
    line(`table "${table}"`, true, `${count ?? 0} ${what}`);
  }
}

/*
  Columns added after the first release. A table can exist and still be behind,
  and the failure that produces ("column ... does not exist") shows up as a
  broken admin page rather than as anything obviously about migrations.
*/
const COLUMNS = [
  ["enquiries", "deleted_at", "supabase/migrations/001-archive-enquiries.sql"],
];

for (const [table, column, migration] of COLUMNS) {
  const { error } = await db.from(table).select(column).limit(1);
  if (error) {
    failed = true;
    line(`${table}.${column}`, false, `missing. Run ${migration} in the SQL editor`);
  } else {
    line(`${table}.${column}`, true, "present");
  }
}

if (!failed) {
  const { count } = await db.from("admin_users").select("*", { count: "exact", head: true });
  console.log(
    count === 0
      ? "\nReady. No accounts yet, so /admin/login will offer to create the first one.\n"
      : "\nReady. Sign in at /admin/login.\n",
  );
}

process.exit(failed ? 1 : 0);
