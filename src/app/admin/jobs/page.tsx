import Link from "next/link";
import { expireJobAction } from "../actions";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { requireUser } from "@/lib/permissions";
import { regions } from "@/lib/content/regions";
import type { Job } from "@/lib/content/jobs";
import { getAllJobs } from "@/lib/db/jobs";

export const metadata = { title: "Roles", robots: { index: false, follow: false } };

/** Outside the component: reading the clock during render is not pure. */
function splitByExpiry(all: Job[]) {
  const now = Date.now();
  const isLive = (job: Job) => new Date(job.validThrough).getTime() >= now;
  return {
    live: all.filter(isLive),
    closed: all.filter((job) => !isLive(job)),
    isLive,
  };
}

export default async function AdminJobs({ searchParams }: PageProps<"/admin/jobs">) {
  // Defence in depth: proxy.ts already redirected, this is the real check.
  await requireUser();

  const { saved, expired } = await searchParams;
  const all = await getAllJobs();
  const { live, closed, isLive } = splitByExpiry(all);

  const regionName = (slug: string) => regions.find((r) => r.slug === slug)?.name ?? slug;

  return (
    <Container>
      <div className="py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[36px]">
              Live roles
            </h1>
            <p className="mt-2 text-[15px] text-ink-70">
              {live.length} live · {closed.length} closed
            </p>
          </div>
          <Button href="/admin/jobs/new" size="lg">
            Post a role
          </Button>
        </div>

        {typeof saved === "string" && (
          <p className="mt-6 rounded-input border border-line bg-surface-1 p-4 text-[15px]">
            Saved <strong>{saved}</strong>. It is on the board now.
          </p>
        )}
        {typeof expired === "string" && (
          <p className="mt-6 rounded-input border border-line bg-surface-1 p-4 text-[15px]">
            <strong>{expired}</strong> has been closed and removed from the board and sitemap.
          </p>
        )}

        <ul className="mt-8 flex flex-col gap-3">
          {[...live, ...closed].map((job) => {
            const open = isLive(job);
            return (
              <li
                key={job.id}
                className="rounded-media bg-surface-1 p-5 md:flex md:items-center md:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[17px] font-semibold tracking-[-0.01em]">
                      {job.title}
                      {job.positions > 1 && <span className="text-ink-45"> ×{job.positions}</span>}
                    </span>
                    <span
                      className={`eyebrow rounded-full px-2.5 py-1 ${
                        open ? "bg-accent-tint text-accent-press" : "bg-surface-2 text-ink-45"
                      }`}
                    >
                      {open ? `Closes ${job.validThrough}` : "Closed"}
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] text-ink-70">
                    {job.suburb} · {regionName(job.region)} · {job.employmentType} · {job.duration}
                    <span className="text-ink-45"> · {job.id}</span>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-0">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full px-4 text-[14px] text-ink-70 transition-colors duration-150 hover:text-ink"
                  >
                    View
                  </Link>
                  <Button href={`/admin/jobs/${job.id}`} variant="outline" size="sm">
                    Edit
                  </Button>
                  {open && (
                    <form action={expireJobAction}>
                      <input type="hidden" name="id" value={job.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center rounded-full px-4 text-[14px] text-accent-press transition-colors duration-150 hover:underline"
                      >
                        Close
                      </button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}
