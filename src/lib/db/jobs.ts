import { unstable_cache, updateTag } from "next/cache";
import type { Job } from "@/lib/content/jobs";
import { assertWritable, driver, supabase } from "./client";
import { mutate, read } from "./local-store";

/**
 * Everything that renders a role is tagged with this, so publishing one job
 * refreshes the board, both `[slug]` route sets, the sitemap and the
 * JobPosting schema at once.
 *
 * Writes use `updateTag` rather than `revalidateTag`: the desk needs to see
 * the role it just posted, and `revalidateTag` is stale-while-revalidate, so
 * the first look back at the board would still show the old list.
 */
export const JOBS_TAG = "jobs";

/** Postgres is snake_case; the app is camelCase. One place to translate. */
type Row = {
  id: string;
  slug: string;
  title: string;
  positions: number;
  suburb: string;
  region: string;
  trade: string;
  employment_type: Job["employmentType"];
  duration: string;
  note: string;
  posted: string;
  valid_through: string;
  summary: string;
  requirements: string[];
};

const fromRow = (row: Row): Job => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  positions: row.positions,
  suburb: row.suburb,
  region: row.region,
  trade: row.trade,
  employmentType: row.employment_type,
  duration: row.duration,
  note: row.note,
  posted: row.posted,
  validThrough: row.valid_through,
  summary: row.summary,
  requirements: row.requirements,
});

const toRow = (job: Job): Row => ({
  id: job.id,
  slug: job.slug,
  title: job.title,
  positions: job.positions,
  suburb: job.suburb,
  region: job.region,
  trade: job.trade,
  employment_type: job.employmentType,
  duration: job.duration,
  note: job.note,
  posted: job.posted,
  valid_through: job.validThrough,
  summary: job.summary,
  requirements: job.requirements,
});

async function fetchAll(): Promise<Job[]> {
  if (driver === "local") {
    return read((snapshot) => [...snapshot.jobs]);
  }

  const { data, error } = await supabase()
    .from("jobs")
    .select("*")
    .order("posted", { ascending: false });

  if (error) throw new Error(`Could not read jobs: ${error.message}`);
  return (data as Row[]).map(fromRow);
}

/**
 * Cached and tagged. `revalidate` is a backstop for the expiry boundary — a
 * role that lapses overnight drops out within the hour even though no write
 * happened to invalidate the tag.
 */
const cachedAll = unstable_cache(fetchAll, ["jobs-all"], {
  tags: [JOBS_TAG],
  revalidate: 3600,
});

/** Every role, expired included — for `generateStaticParams` and the admin. */
export async function getAllJobs(): Promise<Job[]> {
  return cachedAll();
}

/** Drops expired listings so stale JobPosting markup never reaches search. */
export async function getLiveJobs(now: Date = new Date()): Promise<Job[]> {
  const all = await cachedAll();
  return all.filter((job) => new Date(job.validThrough) >= now);
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const all = await cachedAll();
  return all.find((job) => job.slug === slug);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const all = await cachedAll();
  return all.find((job) => job.id === id);
}

/** Create or replace a role, then refresh everything that renders one. */
export async function upsertJob(job: Job): Promise<void> {
  assertWritable();

  if (driver === "local") {
    await mutate((snapshot) => {
      const index = snapshot.jobs.findIndex((existing) => existing.id === job.id);
      if (index >= 0) snapshot.jobs[index] = job;
      else snapshot.jobs.unshift(job);
    });
  } else {
    const { error } = await supabase().from("jobs").upsert(toRow(job), { onConflict: "id" });
    if (error) throw new Error(`Could not save the role: ${error.message}`);
  }

  updateTag(JOBS_TAG);
}

/**
 * Expiring is a date change, not a delete: the page keeps resolving for anyone
 * holding the link, it just stops carrying JobPosting markup and stops
 * appearing on the board and in the sitemap.
 */
export async function expireJob(id: string): Promise<void> {
  assertWritable();
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  if (driver === "local") {
    await mutate((snapshot) => {
      const job = snapshot.jobs.find((existing) => existing.id === id);
      if (job) job.validThrough = yesterday;
    });
  } else {
    const { error } = await supabase().from("jobs").update({ valid_through: yesterday }).eq("id", id);
    if (error) throw new Error(`Could not expire the role: ${error.message}`);
  }

  updateTag(JOBS_TAG);
}
