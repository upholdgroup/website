import Image from "next/image";
import Link from "next/link";
import { AudienceCards } from "@/components/AudienceCards";
import { CtaBanner, RegionTiles, StatGrid } from "@/components/blocks";
import { Commitments } from "@/components/Commitments";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JobList } from "@/components/JobList";
import { TradeAccordion } from "@/components/TradeAccordion";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import {
  Container,
  Section,
  SectionHeading,
  SplitSection,
  TwoToneLead,
} from "@/components/ui/Section";
import { commitments } from "@/lib/content/commitments";
import { photos } from "@/lib/content/photos";
import { regions } from "@/lib/content/regions";
import { complianceFaqs } from "@/lib/content/site-facts";
import { trades } from "@/lib/content/trades";
import { getLiveJobs } from "@/lib/db/jobs";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

/**
 * The homepage, composed the way the reference is.
 *
 * The rule the order follows is rhythm: never two text sections in a row.
 * Photography, cards and accordions alternate, and sections are separated by
 * white space rather than divider lines, which is what stopped the page
 * reading as a document.
 *
 * How hiring works and One rate used to sit here as well. Both live in full
 * on the labour hire page, which is where a host deciding how to book goes.
 */
export default async function Home() {
  const jobs = (await getLiveJobs()).slice(0, 3);
  const regionName = (slug: string) => regions.find((r) => r.slug === slug)?.name ?? "Greater Sydney";

  return (
    <>
      {/* 1. Hero. A rounded photo inset from the edges of the screen, with the
          header floating over its top, then the headline on white below it. */}
      <section className="px-3 pt-3 md:px-4 md:pt-4">
        {/* A fixed shape that scales as a whole, rather than a width that
            follows the screen and a height that follows the window, which made
            the crop change with every browser size. 2.4:1 from lg is almost the
            photo's own 2.36:1, so nearly nothing is cut. Phones get a taller
            shape so the three workers are not a sliver, and a ceiling of 72% of
            the screen height keeps a short laptop window from losing the
            headline below the fold. */}
        <div className="relative mx-auto aspect-[5/4] max-h-[72svh] w-full max-w-[1728px] overflow-hidden rounded-[24px] bg-ink sm:aspect-[16/10] md:aspect-[2/1] md:rounded-[32px] lg:aspect-[2.4/1]">
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            priority
            sizes="100vw"
            /* The crew stand in the right of a very wide frame. On a narrow
               phone slot the window has to move right to keep all three. */
            className="object-cover object-[82%_50%] md:object-[58%_50%]"
          />
          {/* The header sits on this photo. A fade across the top edge gives the
              white logo and tagline something to read against without darkening
              the crew below it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/75 via-ink/30 to-transparent md:h-44 md:from-ink/60 md:via-ink/25"
          />
        </div>

        <Container className="pt-7 pb-8 md:pt-10 md:pb-20">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
            {/* Two masked lines, each rising from under its own baseline. The
                accent sits on the promise, the way the reference puts it on
                "Last." */}
            <h1 className="text-[40px] leading-[0.98] font-bold tracking-[-0.035em] sm:text-[56px] lg:col-span-7 lg:text-[68px]">
              {/* Balanced, so a phone breaks it "Crews That / Turn Up." rather
                  than stranding "Up." alone on its own line. */}
              <span className="line-mask">
                <span className="[text-wrap:balance]">Crews That Turn Up.</span>
              </span>
              <span className="line-mask">
                <span className="text-accent [animation-delay:110ms]">On Time.</span>
              </span>
            </h1>

            <p className="enter max-w-[40ch] text-[15px] leading-[1.6] text-ink-70 [animation-delay:340ms] lg:text-ink-45 md:text-[16px] lg:col-span-4 lg:col-start-9 lg:pt-3">
              Construction contracting, labour hire and recruitment across Greater Sydney.
              Ticketed crews on a casual, contract or permanent basis, most requests filled
              within four hours.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. The two doors: host and worker, before either reads a word more. */}
      <AudienceCards />

      {/* 3. Verification promise, two-tone. */}
      <Section>
        <Container>
          <Reveal>
            <TwoToneLead
              lead="Every worker is interviewed, ticket-checked and site-inducted before they reach your gate,"
              tail="so the crew that shows up is the crew you were promised."
            />
          </Reveal>
        </Container>
      </Section>

      {/* 4. What we supply. The site's main internal link path to trade pages. */}
      <SplitSection
        id="trades"
        label="What we supply"
        lead="Trades and labour across commercial construction, civil and infrastructure, fitout and warehousing, plus site cleaning and licensed security. Every trade has its own page with tickets held and typical scope."
        aside={
          <Button href="/trades" variant="outline" arrow>
            All trades &amp; classifications
          </Button>
        }
      >
        <TradeAccordion trades={trades} />
      </SplitSection>

      {/* 5. Operational figures. */}
      <StatGrid />

      {/* 7. Sydney regions. */}
      <Section id="regions">
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

      {/* 8. Live jobs. No rate column. */}
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

      {/* 9. What we commit to, in the shape of the reference's stories. */}
      <Section>
        <Container>
          <Commitments title="What we commit to" items={commitments} />
        </Container>
      </Section>

      {/* 10. Compliance FAQ, as an accordion rather than a wall of answers. */}
      <SplitSection
        id="faq"
        label="Compliance questions, answered"
        lead="The questions builders actually ask before they book, answered straight."
        aside={
          <Button href="/compliance" variant="outline" arrow>
            Full compliance detail
          </Button>
        }
      >
        <FaqAccordion faqs={complianceFaqs} />
      </SplitSection>

      {/* 11. Photo CTA. */}
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
