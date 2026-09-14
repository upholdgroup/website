import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { seedJobs, type Job } from "@/lib/content/jobs";
import type { AdminUser, StoredEnquiry } from "./types";

/**
 * The development and CI store: one JSON file, seeded from the job data that
 * used to be the whole content layer.
 *
 * Deliberately dependency-free and deliberately unsophisticated — writes are
 * serialised through a single promise chain, which is enough for one developer
 * and a Playwright run, and nowhere near enough for production. See
 * `assertWritable` in ./client.
 */
export type Snapshot = {
  jobs: Job[];
  enquiries: StoredEnquiry[];
  users: AdminUser[];
};

const FILE = join(process.cwd(), ".data", "uphold.json");

const empty = (): Snapshot => ({ jobs: [...seedJobs], enquiries: [], users: [] });

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Snapshot> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Snapshot>;
    return {
      jobs: parsed.jobs ?? [...seedJobs],
      enquiries: parsed.enquiries ?? [],
      users: parsed.users ?? [],
    };
  } catch {
    // No file yet, or a truncated one — start from the seed rather than fail
    // the page render.
    return empty();
  }
}

export async function read<T>(select: (snapshot: Snapshot) => T): Promise<T> {
  return select(await load());
}

/** Serialised read-modify-write, so two concurrent writes cannot clobber each other. */
export async function mutate<T>(change: (snapshot: Snapshot) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const snapshot = await load();
    const result = await change(snapshot);
    await mkdir(dirname(FILE), { recursive: true });
    await writeFile(FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    return result;
  });
  // Keep the chain alive even if this write rejects.
  queue = run.catch(() => undefined);
  return run;
}
