import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobList } from "@/components/JobList";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getAllJobs, getJobBySlug, getLiveJobs } from "@/lib/db/jobs";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { jobPostingSchema } from "@/lib/schema";
import { site, telHref } from "@/lib/site";

export async function generateStaticParams() {
  return (await getAllJobs()).map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};

  return {
    title: `${job.title}, ${job.suburb}, Sydney | ${job.employmentType} Role`,
    description: job.summary,
    alternates: { canonical: `/jobs/${job.slug}` },
  };
}

export default async function JobPage({ params }: PageProps<"/jobs/[slug]">) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const region = regions.find((r) => r.slug === job.region);
  const trade = trades.find((t) => t.slug === job.trade);
  const regionName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "Greater Sydney";
  const similar = (await getLiveJobs())
    .filter((other) => other.slug !== job.slug && (other.trade === job.trade || other.region === job.region))
    .slice(0, 3);

  const expired = new Date(job.validThrough) < new Date();

  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            { label: "Find work", href: "/jobs" },
            { label: job.title, href: `/jobs/${job.slug}` },
          ]}
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">
                {job.employmentType} · {job.duration} · Ref {job.id}
              </p>
              <h1 className="mt-4 text-[36px] leading-[1.02] font-bold tracking-[-0.035em] text-balance md:text-[52px]">
                {job.title}
                {job.positions > 1 && <span className="text-ink-45"> ×{job.positions}</span>}
              </h1>
              <p className="mt-4 text-[17px] text-ink-70">
                {job.suburb}
                {region && (
                  <>
                    {" · "}
                    <Link
                      href={`/sydney/${region.slug}`}
                      className="underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
                    >
                      {region.name}
                    </Link>
                  </>
                )}
              </p>

              {expired ? (
                <p className="mt-8 rounded-media border border-line bg-surface-2 p-5 text-[15px] leading-[1.6] text-ink-70">
                  This role has closed. Register anyway, we text matching Sydney roles as they come
                  in, usually before they reach the job boards.
                </p>
              ) : (
                <p className="mt-8 text-[16px] leading-[1.6] text-ink-70 md:text-[17px]">
                  {job.summary}
                </p>
              )}

              <h2 className="mt-10 text-[24px] leading-[1.15] font-bold tracking-[-0.03em] md:text-[28px]">
                What you need
              </h2>
              <ul className="mt-5">
                {job.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-start gap-4 border-b border-line py-4 text-[16px] leading-[1.5] first:pt-0 last:border-b-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-[12px] text-accent-press"
                    >
                      ✓
                    </span>
                    {requirement}
                  </li>
                ))}
              </ul>

              {trade && (
                <p className="mt-8 text-[15px] leading-[1.6] text-ink-70">
                  More about this trade:{" "}
                  <Link
                    href={`/trades/${trade.slug}`}
                    className="text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-150 hover:text-accent"
                  >
                    {trade.name}
                  </Link>
                </p>
              )}
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-card bg-surface-2 p-6 md:p-7 lg:sticky lg:top-28">
                <h2 className="text-[22px] leading-[1.25] font-medium tracking-[-0.02em]">
                  Apply for this role
                </h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">
                  Register once with your trade, your suburb and the tickets you hold. It takes
                  about five minutes and there is no CV, no password and no portal.
                </p>

                <dl className="mt-6 space-y-3 border-y border-line py-5 text-[15px]">
                  <Row label="Engagement" value={`${job.employmentType} · ${job.duration}`} />
                  <Row label="Shift" value={job.note} />
                  <Row label="Suburb" value={job.suburb} />
                  <Row label="Pay" value="Confirmed at your interview" />
                </dl>

                <div className="mt-6 flex flex-col gap-3">
                  <Button href={`/workers/register?role=${job.id}`} size="lg" arrow>
                    Register &amp; apply
                  </Button>
                  <Button href={telHref(site.phone)} size="lg" variant="outline">
                    Call {site.phone}
                  </Button>
                </div>

                <p className="eyebrow mt-6 text-ink-45">
                  Hire desk {site.hours[0].label} {site.hours[0].value}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {similar.length > 0 && (
        <Section tight className="border-t border-line">
          <Container>
            <SectionHeading title="Similar Sydney roles" />
            <div className="mt-8">
              <JobList jobs={similar} regionName={regionName} />
            </div>
          </Container>
        </Section>
      )}

      {/* Expired roles keep their page for anyone holding the link, but the
          JobPosting markup is withheld so stale listings never reach search. */}
      {!expired && <JsonLd data={jobPostingSchema(job)} />}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-45">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
