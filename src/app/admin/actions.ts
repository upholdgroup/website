"use server";

import { redirect } from "next/navigation";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import type { Job } from "@/lib/content/jobs";
import { expireJob, getAllJobs, upsertJob } from "@/lib/db/jobs";
import { requireUser } from "@/lib/permissions";
import { findRate } from "@/lib/no-rates";
import type { AdminState } from "@/lib/admin-state";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/* -------------------------------------------------------------------------- */
/* Jobs                                                                        */
/* -------------------------------------------------------------------------- */

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Every free-text field a consultant can type into. */
const FREE_TEXT = ["title", "note", "summary", "duration", "requirements"] as const;

export async function saveJob(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireUser();

  const existingId = text(formData, "id");
  const title = text(formData, "title");
  const suburb = text(formData, "suburb");
  const region = text(formData, "region");
  const trade = text(formData, "trade");
  const employmentType = text(formData, "employmentType") as Job["employmentType"];
  const duration = text(formData, "duration");
  const note = text(formData, "note");
  const summary = text(formData, "summary");
  const validThrough = text(formData, "validThrough");
  const positions = Number(text(formData, "positions") || "1");
  const requirements = text(formData, "requirements")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const errors: Record<string, string> = {};

  if (title.length < 3) errors.title = "Give the role a title.";
  if (suburb.length < 2) errors.suburb = "Which Sydney suburb is the site in?";
  if (!regions.some((r) => r.slug === region)) errors.region = "Pick a Greater Sydney region.";
  if (!trades.some((t) => t.slug === trade)) errors.trade = "Pick a trade.";
  if (!["Casual", "Contract", "Permanent"].includes(employmentType))
    errors.employmentType = "Pick an engagement type.";
  if (!duration) errors.duration = "How long is it, \"ongoing\", \"9 months\"?";
  if (!note) errors.note = "One line: the shift pattern or the ticket needed.";
  if (summary.length < 40) errors.summary = "Write a couple of sentences a worker can act on.";
  if (requirements.length === 0) errors.requirements = "List what they need, one per line.";
  if (!Number.isInteger(positions) || positions < 1 || positions > 200)
    errors.positions = "How many of this role are open?";

  if (!validThrough) {
    errors.validThrough = "Set a closing date, roles expire rather than go stale.";
  } else if (new Date(validThrough).getTime() <= Date.now()) {
    errors.validThrough = "The closing date has to be in the future.";
  }

  // The no-rates rule, enforced at the point a human could break it.
  const values: Record<string, string> = { title, note, summary, duration, requirements: requirements.join(" ") };
  for (const field of FREE_TEXT) {
    const offending = findRate(values[field] ?? "");
    if (offending) {
      errors[field] = `Remove "${offending}", we never publish rates. Say what the rate includes instead.`;
    }
  }

  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const all = await getAllJobs();
  const id = existingId || `UG-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const slug = `${slugify(`${title}-${suburb}`)}-${id.toLowerCase()}`;

  if (all.some((job) => job.slug === slug && job.id !== id)) {
    return { status: "error", errors: { title: "A role with this title and suburb already exists." } };
  }

  const previous = all.find((job) => job.id === id);

  await upsertJob({
    id,
    slug,
    title,
    positions,
    suburb,
    region,
    trade,
    employmentType,
    duration,
    note,
    posted: previous?.posted ?? new Date().toISOString().slice(0, 10),
    validThrough,
    summary,
    requirements,
  });

  redirect("/admin/jobs?saved=" + encodeURIComponent(id));
}

export async function expireJobAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = text(formData, "id");
  if (id) await expireJob(id);
  redirect("/admin/jobs?expired=" + encodeURIComponent(id));
}
