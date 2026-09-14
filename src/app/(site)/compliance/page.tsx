import type { Metadata } from "next";
import { CtaBanner, FaqList, ProofChips } from "@/components/blocks";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { complianceFaqs } from "@/lib/content/site-facts";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insurance, Compliance & Worker Verification | Uphold Group NSW",
  description:
    "What Uphold Group holds, what is still being put in place, and how we verify workers: WHS plan, ticket verification against the SafeWork NSW register, right-to-work checks and our insurance position, in plain sentences.",
  alternates: { canonical: "/compliance" },
};

const LAST_REVIEWED = "2 September 2026";

const holdings = [
  {
    title: "icare workers compensation",
    status: "Being established",
    body: "We are the legal employer, so a NSW workers compensation policy with icare is not optional for us and not something we would ask you to take on trust. The policy is being established now. No Uphold worker will be placed on your site before it is active, and the certificate of currency goes out with your engagement pack the day it issues.",
  },
  {
    title: "Public liability",
    status: "Being arranged",
    body: "Public and products liability cover is being arranged ahead of our first placement. We have not put a limit on this page because the policy is not bound yet and we would rather show you the certificate than a number. Tell us at quote stage what limit your principal requires and we will confirm in writing before you book.",
  },
  {
    title: "Fair Work compliance",
    body: "Award and enterprise agreement classifications, allowances, penalties and casual conversion obligations are administered by us. We ask which agreement your site runs under before we quote, because getting the classification wrong is the most common cause of a rate dispute in this industry.",
  },
  {
    title: "WHS management plan",
    body: "A documented WHS management plan covering induction, ticket verification, incident reporting, stop-work authority and return-to-work. It is a document we will send you, not a claim on a webpage.",
  },
  {
    title: "Portable long service leave",
    body: "NSW portable long service leave contributions are registered and paid for eligible workers, so service accrues across sites. This is a worker entitlement that quietly goes missing at less careful providers.",
  },
  {
    title: "ABN and business registration",
    body: `${site.legalName}${site.abn ? `, ABN ${site.abn}` : ""}, operating across ${site.serviceArea.area}, ${site.serviceArea.state}. One entity, no labour-supply chain behind us: the crew on your site is employed by the business that invoices you.`,
  },
];

const verification = [
  {
    step: "01",
    title: "We meet every worker",
    body: "Every worker is interviewed before they are placed, in person, on site, or by video. We meet the person who will be on your site, no worker reaches a booking as a name on a spreadsheet.",
  },
  {
    step: "02",
    title: "Right to work",
    body: "Citizenship, residency or visa status is verified through VEVO, and visa conditions and expiry dates are recorded. Where a visa restricts hours, that restriction is enforced in our rostering rather than left to the worker.",
  },
  {
    step: "03",
    title: "Tickets and licences",
    body: "White Cards and high-risk work licences are checked against the SafeWork NSW register, not accepted from a photo alone. The class and expiry of every ticket is recorded and tracked, and a worker is stood down before an expiry rather than after it.",
  },
  {
    step: "04",
    title: "Two supervisor references",
    body: "We call the last two supervisors, not two friends. Attendance and attitude are what we ask about, because those are what fail on a site, competence is usually the easier part to verify.",
  },
  {
    step: "05",
    title: "Induction",
    body: "Our own induction before the first placement, then the site-specific induction on arrival. Induction time is included in the hourly charge rate rather than billed separately.",
  },
];

export default function CompliancePage() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Compliance", href: "/compliance" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">Insurance · compliance · verification</p>
              <h1 className="mt-4 text-[38px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[54px]">
                What we hold, and how we check
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">
                We employ every worker we place. Their pay, their superannuation, their
                insurance and their safety are our obligation, not yours, and this page
                accounts for every one of them. Ask for the evidence pack and it is in your
                inbox the same day, dated.
              </p>
              <ProofChips />
              <p className="eyebrow text-ink-45">Last reviewed {LAST_REVIEWED}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <SectionHeading title="What Uphold Group holds" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {holdings.map((item) => (
              <li key={item.title} className="rounded-card border border-line p-6 md:p-7">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <h3 className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  {/* Only the items that are not yet in force carry a label.
                      A compliance page that says which of its claims are live
                      and which are pending is worth more than one that asserts
                      everything equally: the first can be checked. */}
                  {"status" in item && item.status && (
                    <span className="eyebrow rounded-full bg-accent-tint px-2.5 py-1 text-accent-press">
                      {item.status}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <SectionHeading
            title="How we verify a worker"
            lead="Five steps, every worker, before they are offered to you. The evidence for any of them is available the same day you ask."
          />
          <ol className="mt-10 space-y-3">
            {verification.map((item) => (
              <li
                key={item.step}
                className="flex flex-col gap-3 rounded-card bg-surface-1 p-6 md:flex-row md:gap-8 md:p-7"
              >
                <span className="eyebrow shrink-0 text-accent-press md:w-16 md:pt-1">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-ink-70 md:text-[16px]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                How to check any labour hire provider
              </h2>
              <p className="mt-5 text-[16px] leading-[1.55] text-ink-70">
                Use this on us, and on whoever else you are considering. A provider that cannot
                produce these within a day is telling you something.
              </p>
              <Button href="/request-labour" arrow className="mt-7">
                Ask us for the pack
              </Button>
            </div>

            <ul className="lg:col-span-7">
              {[
                "Certificate of currency for workers compensation, in the provider's own entity name.",
                "Certificate of currency for public liability, with the limit stated.",
                "The ABN, checked on ABN Lookup against the name on the invoice.",
                "Their written WHS management plan, not a policy statement.",
                "How they verify high-risk work licences, against the register, or from a photo?",
                "Whether portable long service leave contributions are actually being paid.",
                "What the hourly charge rate includes, itemised, in writing.",
              ].map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-b border-line py-4 text-[16px] leading-[1.5] first:pt-0 last:border-b-0"
                >
                  <span className="eyebrow mt-1 shrink-0 text-ink-45">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading title="Compliance questions, answered" />
          <div className="mt-10">
            <FaqList faqs={complianceFaqs} />
          </div>
          <p className="eyebrow mt-8 text-ink-45">Last reviewed {LAST_REVIEWED}</p>
        </Container>
      </Section>

      <CtaBanner
        title="Want the evidence pack?"
        body="Certificates of currency, our WHS management plan and a sample worker verification record, in your inbox the same day you ask."
      />

      <JsonLd data={faqSchema(complianceFaqs)} />
    </>
  );
}
