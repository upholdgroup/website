import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, FaqList, ProofChips, RegionTiles, StepList } from "@/components/blocks";
import { JobList } from "@/components/JobList";
import { SitePhoto } from "@/components/SitePhoto";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getLiveJobs } from "@/lib/db/jobs";
import { regions, regionBySlug } from "@/lib/content/regions";
import { photos } from "@/lib/content/photos";
import { hiringSteps } from "@/lib/content/site-facts";
import { trades } from "@/lib/content/trades";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sydney/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const region = regionBySlug(slug);
  if (!region) return {};

  return {
    title: `Labour Hire ${region.name} | Construction Labourers & Trades`,
    description: `Construction labour hire across ${region.name}, ${region.suburbs.slice(0, 4).join(", ")}. Ticketed labourers, trades and civil crews, most requests filled within four hours.`,
    alternates: { canonical: `/sydney/${region.slug}` },
  };
}

export default async function RegionPage({ params }: PageProps<"/sydney/[slug]">) {
  const { slug } = await params;
  const region = regionBySlug(slug);
  if (!region) notFound();

  // A region page ships only with named suburbs, a local project and local
  // jobs. Falling back to the whole board would make it a doorway page.
  const jobs = (await getLiveJobs()).filter((job) => job.region === region.slug);
  const demandTrades = region.demand
    .map((s) => trades.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const regionName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "Greater Sydney";

  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            { label: "Sydney regions", href: "/sydney" },
            { label: region.name, href: `/sydney/${region.slug}` },
          ]}
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">Labour hire · Greater Sydney</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[56px]">
                Labour hire, {region.name}
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">{region.intro}</p>
              <ProofChips />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/request-labour" arrow>
                  Request a crew here
                </Button>
                <Button href="/jobs" variant="outline">
                  Jobs in this region
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Container>
        <SitePhoto
          caption={`An Uphold Group crew on site in ${region.name}`}
          src={photos.crewOnSite.src}
          alt={`An Uphold Group crew on a construction site in ${region.name}, Sydney`}
          position={photos.crewOnSite.position}
          radius="rounded-card"
          className="aspect-[16/9] w-full md:aspect-[2/1]"
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                What crewing {region.name} is actually like
              </h2>
              <p className="mt-5 text-[16px] leading-[1.6] text-ink-70 md:text-[17px]">
                {region.character}
              </p>
              <p className="mt-4 text-[16px] leading-[1.6] text-ink-70 md:text-[17px]">
                We supply workers across {region.suburbs.slice(0, -1).join(", ")} and{" "}
                {region.suburbs[region.suburbs.length - 1]}, and we roster people who live inside
                the catchment so a 6am start is sustainable across a long booking rather than only
                on day one.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-card bg-surface-2 p-6 md:p-7">
                <p className="eyebrow text-ink-45">Suburbs we crew here</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {region.suburbs.map((suburb) => (
                    <li
                      key={suburb}
                      className="inline-flex items-center rounded-full bg-surface-1 px-3.5 py-2 text-[14px] text-ink-70"
                    >
                      {suburb}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-line pt-5 text-[14px] leading-[1.6] text-ink-45">
                  Working somewhere nearby that is not listed? Call {site.phone}, if it is inside
                  Greater Sydney we almost certainly crew it.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <SectionHeading
            title={`Most in demand in ${region.name}`}
            lead="The three classifications we place most often in this region. Every trade page lists the tickets held and the typical scope."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {demandTrades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={`/trades/${trade.slug}`}
                  className="flex h-full flex-col rounded-card bg-surface-1 p-6 transition-colors duration-150 hover:bg-white md:p-7"
                >
                  <h3 className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em]">
                    {trade.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{trade.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-accent decoration-2 underline-offset-4">
                    Tickets &amp; scope
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ink-45">Local project</p>
              <h2 className="mt-3 text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                {region.project.title}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.6] text-ink-70">{region.project.detail}</p>

            </div>

            <div className="lg:col-span-7">
              <SitePhoto
                caption={region.project.title}
                src={photos.worker.src}
                alt={`Uphold Group on ${region.project.title}`}
                position={photos.worker.position}
                radius="rounded-card"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[16/10] w-full"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading
            title={`Live roles in ${region.name}`}
            lead="Pay rates are confirmed at your interview, never published. Register once and we text you matching roles near your suburb."
          />
          <div className="mt-8">
            <JobList jobs={jobs} regionName={regionName} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/workers/register" variant="secondary" arrow>
              Register for work
            </Button>
            <Button href="/jobs" variant="outline">
              Every live Sydney role
            </Button>
          </div>
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <SectionHeading title="How hiring works" />
          <div className="mt-10">
            <StepList steps={hiringSteps} />
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <SectionHeading title={`${region.name}, common questions`} />
          <div className="mt-10">
            <FaqList faqs={region.faqs} />
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <h2 className="eyebrow text-ink-45">Other Greater Sydney regions</h2>
          <div className="mt-6">
            <RegionTiles regions={regions.filter((r) => r.slug !== region.slug)} />
          </div>
        </Container>
      </Section>

      <CtaBanner
        title={`Short a crew in ${region.suburbs[0]}?`}
        body={`Send the roles and tickets you need. We answer from 5:30am to 8pm, seven days, and you get named workers who already crew ${region.name} plus a written rate the same day.`}
      />

      <JsonLd data={faqSchema(region.faqs)} />
      <JsonLd
        data={serviceSchema({
          name: `Labour hire, ${region.name}`,
          description: region.intro,
          path: `/sydney/${region.slug}`,
          serviceType: "Construction labour hire",
        })}
      />
    </>
  );
}
