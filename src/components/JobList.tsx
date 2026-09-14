import Link from "next/link";
import { ArrowCircle } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Job } from "@/lib/content/jobs";

/**
 * Job row: role · suburb + region · engagement type · shift or ticket note.
 * No rate column — pay is confirmed at interview.
 *
 * Laid out as a grid rather than a nowrap flex row: the columns share the
 * available width by ratio and every cell can shrink, so a long region name
 * reflows instead of pushing the Apply pill past the viewport.
 */
export function JobList({ jobs, regionName }: { jobs: Job[]; regionName?: (slug: string) => string }) {
  if (jobs.length === 0) {
    return (
      <p className="rounded-media bg-surface-2 p-6 text-[15px] leading-[1.6] text-ink-70">
        No roles are live in this category right now. Register anyway, we text matching Sydney roles
        as they come in, usually before they reach the job boards.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {jobs.map((job, i) => (
        <Reveal as="li" key={job.id} delay={i * 80}>
          <Link
            href={`/jobs/${job.slug}`}
            className="lift group grid grid-cols-1 items-center gap-x-5 gap-y-2 rounded-media bg-surface-2 p-5 transition-colors duration-150 hover:bg-[#eeeeeb] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.3fr)_auto] md:p-6"
          >
            <span className="min-w-0 text-[17px] leading-[1.3] font-semibold tracking-[-0.01em]">
              {job.title}
              {job.positions > 1 && <span className="text-ink-45"> ×{job.positions}</span>}
            </span>

            <span className="min-w-0 text-[14px] text-ink-70">
              {job.suburb}
              {regionName && <span className="text-ink-45"> · {regionName(job.region)}</span>}
            </span>

            <span className="min-w-0 text-[14px] text-ink-70">
              {job.employmentType} · {job.duration}
              <span className="eyebrow mt-1 block text-ink-45">{job.note}</span>
            </span>

            <span className="inline-flex items-center gap-2 justify-self-start text-[15px] font-medium text-ink md:justify-self-end">
              Apply
              <ArrowCircle size={36} />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
