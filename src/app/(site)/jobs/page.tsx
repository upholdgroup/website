import type { Metadata } from "next";
import { CtaBanner, FaqList } from "@/components/blocks";
import { JobBoard } from "@/components/JobBoard";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getLiveJobs } from "@/lib/db/jobs";
import { photos } from "@/lib/content/photos";
import { regions } from "@/lib/content/regions";
import { workerFaqs, workerSteps } from "@/lib/content/site-facts";
import { StepList } from "@/components/blocks";
import { trades } from "@/lib/content/trades";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Construction Jobs Sydney | Labouring & Trades Roles",
  description:
    "Live construction and labouring jobs across Greater Sydney, labourers, carpenters, scaffolders, traffic control, plant operators and warehouse roles. Register in five minutes and we text you roles near your suburb.",
  alternates: { canonical: "/jobs" },
};

export default async function JobsBoard() {
  const jobs = await getLiveJobs();

  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Find work", href: "/jobs" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">For trades &amp; labourers</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[58px]">
                Live Sydney roles this week
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">
                Every role below is live right now on a Greater Sydney site, with the suburb, the
                shift pattern and the duration on the card. Register once, five minutes, no CV, no
                password, and we text you matching roles near your suburb, usually before they
                reach the job boards. Pay is confirmed at your interview.
              </p>
              <Button href="/workers/register" size="lg" arrow className="self-start">
                Register for work
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <JobBoard
            jobs={jobs}
            tradeOptions={trades.map((t) => ({ slug: t.slug, label: t.short }))}
            regionOptions={regions.map((r) => ({ slug: r.slug, label: r.name }))}
          />
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <SectionHeading
            title="How you get your first shift"
            lead="Three steps from your phone on a Sunday night to a site on Tuesday morning."
          />
          <div className="mt-10">
            <StepList steps={workerSteps} />
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <SectionHeading title="Working with Uphold, common questions" />
          <div className="mt-10">
            <FaqList faqs={workerFaqs} />
          </div>
          <Button href="/workers" variant="outline" arrow className="mt-8">
            Pay, super, safety and inductions
          </Button>
        </Container>
      </Section>

      <CtaBanner
        title="Want the shift before it hits the boards?"
        body="Register in five minutes with your trade, your suburb and the tickets you hold. We text you Sydney roles that match, you reply yes or no, and you are paid weekly with super and portable long service leave handled."
        action={{ label: "Register for work", href: "/workers/register" }}
        photo={photos.worker}
      />

      <JsonLd data={faqSchema(workerFaqs)} />
    </>
  );
}
