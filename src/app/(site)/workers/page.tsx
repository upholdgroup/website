import type { Metadata } from "next";
import { CtaBanner, FaqList, StepList } from "@/components/blocks";
import { JobList } from "@/components/JobList";
import { SitePhoto } from "@/components/SitePhoto";
import { photos } from "@/lib/content/photos";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getLiveJobs } from "@/lib/db/jobs";
import { regions } from "@/lib/content/regions";
import { workerFaqs, workerSteps } from "@/lib/content/site-facts";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Working With Uphold | Pay, Super, Tickets & Site Safety",
  description:
    "What it is like to work for Uphold Group in Sydney: weekly pay, correct superannuation, NSW portable long service leave, ticket verification, site inductions and WHS support.",
  alternates: { canonical: "/workers" },
};

const payPoints = [
  {
    title: "Paid weekly",
    body: "Pay lands in your account every week against a digital timesheet your site supervisor has approved. Nothing to post, nothing to chase, and the invoice your host receives matches the hours you worked.",
  },
  {
    title: "Superannuation, correctly",
    body: "Superannuation is paid at the legislated rate to the fund you nominate. You can see the contributions in your fund account, we do not hold them and we do not pay them late.",
  },
  {
    title: "Portable long service leave",
    body: "NSW portable long service leave contributions are registered on your behalf, so your service keeps accruing as you move between sites. It is your entitlement and it follows you.",
  },
  {
    title: "Allowances and penalties applied",
    body: "Award or EBA classifications, site allowances, overtime and penalty rates are interpreted by us as your employer. If you think a shift has been paid wrong, call and we will check it that day.",
  },
];

const safetyPoints = [
  {
    title: "Induction before your first shift",
    body: "You complete our induction before you are placed, and the site's own induction on arrival. Induction time is built into what the host is charged, so nobody argues about who pays for it on the first morning.",
  },
  {
    title: "Tickets tracked to expiry",
    body: "We record the class and expiry date of every ticket you hold and remind you before one lapses. You are stood down before an expiry, not after, which protects your licence as much as the site.",
  },
  {
    title: "PPE supplied",
    body: "We supply high-visibility clothing. You bring steel-cap boots, long sleeves and long pants; anything site-specific is named in the SMS you get the night before.",
  },
  {
    title: "Say something, and it stops",
    body: "If a site is unsafe, call us and stop work. We would rather lose a booking than have you hurt, and no worker has ever been taken off our books for refusing unsafe work.",
  },
];

export default async function WorkersPage() {
  const jobs = (await getLiveJobs()).slice(0, 4);
  const regionName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "Greater Sydney";

  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            { label: "Find work", href: "/jobs" },
            { label: "Working with Uphold", href: "/workers" },
          ]}
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">For trades &amp; labourers</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[56px]">
                Working with Uphold
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">
                We employ you. That means weekly pay, correct superannuation, workers compensation
                and NSW portable long service leave are our obligation, not something you have to
                chase. We crew right across Greater Sydney, so the roles we text you are near
                where you live.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/workers/register" size="lg" arrow>
                  Register in five minutes
                </Button>
                <Button href="/jobs" size="lg" variant="outline">
                  See live roles
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Container>
        <SitePhoto
          caption={photos.crewOnSite.alt}
          src={photos.crewOnSite.src}
          alt="Uphold Group workers at pre-start on a Sydney construction site"
          position={photos.crewOnSite.position}
          radius="rounded-card"
          className="aspect-[16/9] w-full md:aspect-[2/1]"
        />
      </Container>

      <Section tight>
        <Container>
          <SectionHeading title="How you get your first shift" />
          <div className="mt-10">
            <StepList steps={workerSteps} />
          </div>
        </Container>
      </Section>

      <Section id="pay" tight className="bg-surface-2">
        <Container>
          <SectionHeading
            eyebrow="Pay, super & entitlements"
            title="What lands in your account"
            lead="We are the legal employer, so every entitlement below is ours to get right."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {payPoints.map((point) => (
              <li key={point.title} className="rounded-card bg-surface-1 p-6 md:p-7">
                <h3 className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em]">
                  {point.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{point.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="safety" tight>
        <Container>
          <SectionHeading
            eyebrow="Safety & inductions"
            title="Getting you on site, and home again"
            lead="Zero lost-time injuries across twenty-four months is not luck, it is induction, ticket tracking and a phone number that answers."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {safetyPoints.map((point) => (
              <li key={point.title} className="rounded-card border border-line p-6 md:p-7">
                <h3 className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em]">
                  {point.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{point.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading title="Live roles right now" />
          <div className="mt-8">
            <JobList jobs={jobs} regionName={regionName} />
          </div>
          <Button href="/jobs" variant="outline" arrow className="mt-8">
            Every live Sydney role
          </Button>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <SectionHeading title="Questions workers ask us" />
          <div className="mt-10">
            <FaqList faqs={workerFaqs} />
          </div>
          <p className="mt-8 text-[15px] leading-[1.6] text-ink-70">
            Anything else, call {site.phone} or email{" "}
            <a
              href={`mailto:${site.workEmail}`}
              className="text-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              {site.workEmail}
            </a>
            .
          </p>
        </Container>
      </Section>

      <CtaBanner
        title="Register once. We text you the rest."
        body="Five minutes, no CV, no password. Tell us your trade, your suburb and the tickets you hold, and we take it from there. Bring the cards themselves to your interview."
        action={{ label: "Register for work", href: "/workers/register" }}
        photo={photos.worker}
      />

      <JsonLd data={faqSchema(workerFaqs)} />
    </>
  );
}
