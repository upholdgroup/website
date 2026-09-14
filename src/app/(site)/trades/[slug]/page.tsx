import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, FaqList, ProofChips, RegionTiles } from "@/components/blocks";
import { JobList } from "@/components/JobList";
import { SitePhoto } from "@/components/SitePhoto";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getLiveJobs } from "@/lib/db/jobs";
import { regions } from "@/lib/content/regions";
import { trades, tradeBySlug } from "@/lib/content/trades";
import { photos } from "@/lib/content/photos";
import { faqSchema, serviceSchema } from "@/lib/schema";

export function generateStaticParams() {
  return trades.map((trade) => ({ slug: trade.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trades/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const trade = tradeBySlug(slug);
  if (!trade) return {};

  return {
    // Most trades read well as "<trade> Labour Hire Sydney". Cleaning and
    // security do not, so those carry their own title.
    title: trade.title ?? `${trade.short} Labour Hire Sydney | Tickets & Scope`,
    description: `${trade.blurb} Uphold Group covers ${trade.short.toLowerCase()} across Greater Sydney, most requests filled within four hours.`,
    alternates: { canonical: `/trades/${trade.slug}` },
  };
}

export default async function TradePage({ params }: PageProps<"/trades/[slug]">) {
  const { slug } = await params;
  const trade = tradeBySlug(slug);
  if (!trade) notFound();

  const jobs = (await getLiveJobs()).filter((job) => job.trade === trade.slug);
  const regionName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "Greater Sydney";
  const others = trades.filter((t) => t.slug !== trade.slug);

  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            { label: "Trades", href: "/trades" },
            { label: trade.short, href: `/trades/${trade.slug}` },
          ]}
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">Labour hire · Greater Sydney</p>
              <h1 className="mt-4 text-[36px] leading-[1.02] font-bold tracking-[-0.035em] text-balance md:text-[52px]">
                {trade.h1}
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">{trade.intro}</p>
              <ProofChips />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/request-labour" arrow>
                  Request this crew
                </Button>
                <Button href="/workers/register" variant="outline">
                  I work in this trade
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Container>
        <SitePhoto
          caption={photos[trade.photo].alt}
          src={photos[trade.photo].src}
          alt={photos[trade.photo].alt}
          position={photos[trade.photo].position}
          radius="rounded-card"
          className="aspect-[16/9] w-full md:aspect-[2/1]"
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                Tickets held
              </h2>
              <p className="mt-4 text-[15px] leading-[1.6] text-ink-70">
                Verified against the issuing register before a worker is offered, with the class and
                expiry sent to you in writing. Expiries are tracked and a worker is stood down before
                a ticket lapses.
              </p>
            </div>

            <ul className="lg:col-span-8">
              {trade.tickets.map((ticket) => (
                <li
                  key={ticket}
                  className="flex items-start gap-4 border-b border-line py-4 text-[16px] leading-[1.5] first:pt-0 last:border-b-0 md:text-[17px]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-[12px] text-accent-press"
                  >
                    ✓
                  </span>
                  {ticket}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                Typical scope
              </h2>
              <ul className="mt-6 space-y-3">
                {trade.scope.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-[1.6] text-ink-70 md:text-[16px]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                What to brief us
              </h2>
              <p className="mt-4 text-[15px] leading-[1.6] text-ink-70">
                Three things decide whether a booking is filled in four hours or four days.
              </p>
              <ol className="mt-6 space-y-4">
                {trade.brief.map((item, i) => (
                  <li key={item} className="flex items-start gap-4 rounded-media bg-surface-1 p-4">
                    <span className="eyebrow mt-0.5 text-accent-press">0{i + 1}</span>
                    <span className="text-[15px] leading-[1.55] md:text-[16px]">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <SectionHeading title={`Live ${trade.short.toLowerCase()} roles`} />
          <div className="mt-8">
            <JobList jobs={jobs} regionName={regionName} />
          </div>
          <Button href="/jobs" variant="outline" arrow className="mt-8">
            Every live Sydney role
          </Button>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading title={`${trade.short}, common questions`} />
          <div className="mt-10">
            <FaqList faqs={trade.faqs} />
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading
            title="Where we supply this trade"
            lead="Eight Greater Sydney regions. Each page names its suburbs and the work we actually crew there."
          />
          <div className="mt-10">
            <RegionTiles regions={regions} />
          </div>

          <div className="mt-12">
            <h3 className="eyebrow text-ink-45">Other trades</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/trades/${other.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] text-ink-70 transition-colors duration-150 hover:border-ink hover:text-ink"
                  >
                    {other.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBanner
        title={`Need ${trade.short.toLowerCase()} this week?`}
        body="Send the roles, tickets and start time. We answer from 5:30am to 8pm, seven days, and you get named Sydney workers plus a written rate the same day."
      />

      <JsonLd data={faqSchema(trade.faqs)} />
      <JsonLd
        data={serviceSchema({
          name: trade.h1,
          description: trade.blurb,
          path: `/trades/${trade.slug}`,
          serviceType: `${trade.short} labour hire`,
        })}
      />
    </>
  );
}
