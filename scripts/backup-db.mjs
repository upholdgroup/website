/**
 * Takes a full, restorable snapshot of the database to a local JSON file.
 *
 *   npm run db:backup
 *
 * Why this exists: Supabase's free plan keeps daily backups but has no
 * point-in-time recovery, so anything lost between snapshots is gone. These
 * tables are the only record of who asked for a crew, who registered for work,
 * and who can sign in. A row on this database has already been destroyed by
 * accident once on this project.
 *
 * Reads only. Safe to run against production at any time, and safe to run
 * before anything destructive — which is the point.
 *
 * Output: backups/uphold-YYYY-MM-DDTHH-mm-ss.json, gitignored, because it
 * contains personal information and password hashes. Treat the file the way
 * you would treat the database: do not email it, do not put it in Drive.
 */
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const url = process.env.SUPABASE_URL?.trim();
const key = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

if (!url || !key) {
  console.error(
    "\nNot configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.\n" +
      "If you are backing up production, use the production values, not your local ones.\n",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

/** Every table, including archived enquiries: a backup that filters is not a backup. */
const TABLES = ["jobs", "enquiries", "admin_users"];

/** Supabase caps a single select at 1000 rows, so page through. */
async function fetchAll(table) {
  const rows = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase.from(table).select("*").range(from, from + size - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < size) return rows;
  }
}

const snapshot = {
  takenAt: new Date().toISOString(),
  project: url,
  tables: {},
};

let total = 0;
for (const table of TABLES) {
  try {
    const rows = await fetchAll(table);
    snapshot.tables[table] = rows;
    total += rows.length;
    console.log(`  ${String(rows.length).padStart(5)}  ${table}`);
  } catch (error) {
    console.error(`\nFAILED reading ${table}: ${error.message}`);
    console.error("Nothing has been written. Fix the error and run again.\n");
    process.exit(1);
  }
}

// Only write once every table has been read. A partial file that looks like a
// backup is worse than no file at all.
const stamp = snapshot.takenAt.replace(/[:.]/g, "-").slice(0, 19);
const dir = join(process.cwd(), "backups");
const file = join(dir, `uphold-${stamp}.json`);
await mkdir(dir, { recursive: true });
await writeFile(file, JSON.stringify(snapshot, null, 2), "utf8");

console.log(`\n  ${total} rows written to backups/uphold-${stamp}.json`);
console.log("  Contains personal information and password hashes. Store it accordingly.\n");
