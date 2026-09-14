import Link from "next/link";
import { AudienceCards } from "@/components/AudienceCards";
import {
  CtaBanner,
  FaqList,
  InclusionsCard,
  ProofChips,
  RegionTiles,
  StatGrid,
  StepList,
} from "@/components/blocks";
import { JobList } from "@/components/JobList";
import { SitePhoto } from "@/components/SitePhoto";
import { photos } from "@/lib/content/photos";
import { Commitments } from "@/components/Commitments";
import { TradeAccordion } from "@/components/TradeAccordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  Container,
  Section,
  SectionHeading,
  SplitSection,
  TwoToneLead,
} from "@/components/ui/Section";
import { getLiveJobs } from "@/lib/db/jobs";
import { regions } from "@/lib/content/regions";
import { complianceFaqs, hiringSteps } from "@/lib/content/site-facts";
import { commitments } from "@/lib/content/commitments";
import { trades } from "@/lib/content/trades";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const jobs = (await getLiveJobs()).slice(0, 3);
  const regionName = (slug: string) => regions.find((r) => r.slug === slug)?.name ?? "Greater Sydney";

  return (
    <>
      {/*
        2 + 3. The hero is one <section>, not a container followed by one.

        That matters for snapping: sections are the snap targets, so a hero
        that was not one meant the first target sat 772px down the page and
        mandatory snapping jumped there on load, taking the photo off screen
        entirely. As a section its snap position clamps to the top of the
        document, so the page opens where it should.
      */}
      <section className="pt-5 md:pt-6">
        <Container>
          <SitePhoto
            caption={photos.hero.alt}
            src={photos.hero.src}
            alt={photos.hero.alt}
            position={photos.hero.position}
            priority
            /* The shot is 2.36:1 and cinematic, so the slot widens rather
               than cropping it back to 16:9 on a phone: at 16:9 a quarter of
               the frame goes, taking the Opera House and the bridge with it.
               2:1 on a phone keeps them and still stands 195px tall at 390px
               wide, which is enough presence for a hero. */
            className="aspect-[2/1] w-full sm:aspect-[2.2/1] lg:aspect-[2.4/1]"
          />
        </Container>

        <Container className="py-10 md:py-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            {/* Two masked lines, each pushed up into place from under its own
                baseline a beat apart. The <br/> is gone: the lines are real
                blocks now, which is what gives each one an edge to rise from.
                It still reads as one heading to a screen reader. */}
            <h1 className="text-[44px] leading-[0.98] font-bold tracking-[-0.035em] sm:text-[56px] lg:col-span-6 lg:text-[64px]">
              <span className="line-mask">
                <span>Crews That Turn Up.</span>
              </span>
              <span className="line-mask">
                <span className="[animation-delay:110ms]">On Time.</span>
              </span>
            </h1>

            {/* Last in, after both headline lines have landed. */}
            <div className="enter flex flex-col gap-6 [animation-delay:340ms] lg:col-span-6 lg:pt-2">
              <p className="text-[17px] leading-[1.55] text-ink-70 md:text-[18px]">
                Uphold Group is a Sydney construction contracting, labour hire and recruitment
                company. We supply ticketed labourers, trades and civil crews to builders and
                subcontractors across Greater Sydney, and take on packages of work with our own
                crew, on a casual, contract or permanent basis.
              </p>
              <ProofChips />
            </div>
          </div>
        </Container>
      </section>

      {/* 4. The two doors. */}
      <AudienceCards />

      {/* 5. Verification promise, two-tone. Once per page. */}
      <Section tight className="border-y border-line bg-surface-1">
        <Container>
          <Reveal>
            <TwoToneLead
            lead="Every worker is interviewed, ticket-checked and site-inducted before they reach your gate,"
              tail="so the crew that shows up is the crew you were promised."
            />
          </Reveal>
        </Container>
      </Section>

      {/* 6. Trades accordion. The site's main internal SEO link path. */}
      <SplitSection
        id="trades"
        label="What we supply"
        lead="Trades and labour across commercial construction, civil and infrastructure, fitout and warehousing, plus site cleaning and licensed security, all of it in Greater Sydney. Every trade below has its own page with tickets held and typical scope."
        aside={
          <Button href="/trades" variant="outline" arrow>
            All trades &amp; classifications
          </Button>
        }
      >
        <TradeAccordion trades={trades} />
      </SplitSection>

      {/* 7. Operational stats. */}
      <StatGrid />

      {/* 8. How hiring works. */}
      <SplitSection
        label="How hiring works"
        lead="Three steps, no portal login, and a written quote before anyone is confirmed."
      >
        <StepList steps={hiringSteps} />
      </SplitSection>

      {/* 9. What one rate includes. Where a price would sit. */}
      <SplitSection
        label="One rate, everything in it"
        lead="We quote a single hourly charge rate per classification, in writing, the same day you ask. No sign-on fees, no charge for replacements, no surprise line items at the end of the month."
        aside={
          <Button href="/request-labour" arrow>
            Request a written quote
          </Button>
        }
      >
        <InclusionsCard />
      </SplitSection>

      {/* 10. Sydney regions. */}
      <Section id="regions" tight className="bg-surface-1">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={site.serviceArea.short}
              title="Where we crew"
              lead="We send crews to all eight Greater Sydney regions below, and never hand the job to another agency."
            />
          </Reveal>
          <div className="mt-10">
            <RegionTiles regions={regions} />
          </div>
        </Container>
      </Section>

      {/* 12. Live jobs. No rate column. */}
      <SplitSection
        id="jobs"
        label="Live jobs this week"
        lead="Register once and we text you Sydney roles that match your tickets, usually before they hit the job boards. Pay rates are confirmed at your interview."
        aside={
          <Button href="/workers/register" variant="secondary" arrow>
            Register for work
          </Button>
        }
      >
        <JobList jobs={jobs} regionName={regionName} />
        <Link
          href="/jobs"
          className="mt-6 inline-flex min-h-11 items-center text-[15px] font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-150 hover:text-accent"
        >
          See every live Sydney role
        </Link>
      </SplitSection>

      {/* 13. What we commit to. This was a testimonial carousel until the
          quotes in it turned out to be invented; see commitments.ts. */}
      <Section tight className="bg-surface-1">
        <Container>
          <Reveal>
            <SectionHeading
              title="What we commit to"
              lead="The same terms on every booking, whatever the trade or the suburb. Each one is set out in full on the page it links to."
            />
          </Reveal>
          <div className="mt-10">
            <Commitments items={commitments} />
          </div>
        </Container>
      </Section>

      {/* 14. Compliance FAQ. Objection handled immediately before the ask. */}
      <Section id="faq" tight>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Compliance"
              title="Compliance questions, answered"
              lead="The questions builders actually ask before they book, answered straight."
            />
          </Reveal>
          <div className="mt-10">
            <FaqList faqs={complianceFaqs} />
          </div>
          <Button href="/compliance" variant="outline" arrow className="mt-8">
            Full compliance detail
          </Button>
        </Container>
      </Section>

      {/* 15. CTA banner. */}
      <CtaBanner />

      <JsonLd data={faqSchema(complianceFaqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          publisher: { "@id": `${site.url}/#organisation` },
        }}
      />
    </>
  );
}
