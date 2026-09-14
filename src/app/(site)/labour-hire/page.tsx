import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBanner,
  FaqList,
  InclusionsCard,
  ProofChips,
  RegionTiles,
  StatGrid,
  StepList,
} from "@/components/blocks";
import { ArrowCircle, Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { regions } from "@/lib/content/regions";
import { services } from "@/lib/content/services";
import { complianceFaqs, hiringSteps } from "@/lib/content/site-facts";
import { trades } from "@/lib/content/trades";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Labour Hire Sydney | Casual, Contract & Permanent Crews",
  description:
    "Construction labour hire across Greater Sydney. Casual and short-notice crews, contract project crews, permanent recruitment and payroll on-hire. Most requests filled within four hours, quoted in writing the same day.",
  alternates: { canonical: "/labour-hire" },
};

export default function LabourHireHub() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Hire workers", href: "/labour-hire" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">For builders &amp; site managers</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[58px]">
                Labour hire for Sydney construction
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">
                Uphold Group supplies ticketed labourers, trades and civil crews to builders and
                subcontractors across Greater Sydney. We are the legal employer, so wages,
                superannuation, workers compensation and payroll tax sit with us. Most Sydney
                requests are filled within four hours, with a written rate the same day.
              </p>
              <ProofChips />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/request-labour" size="lg" arrow>
                  Request labour
                </Button>
                <Button href="/compliance" size="lg" variant="outline">
                  See our compliance
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <StatGrid />

      <Section tight>
        <Container>
          <SectionHeading
            eyebrow="Engagement types"
            title="Four ways to engage a crew"
            lead="Same verification, same weekly invoice, same replacement guarantee. What changes is how long you need the people and who carries the employment."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/labour-hire/${service.slug}`}
                  className="lift group flex h-full flex-col justify-between gap-8 rounded-card border border-line p-6 transition-colors duration-150 hover:border-ink md:p-7"
                >
                  <div>
                    <p className="eyebrow text-accent-press">{service.short}</p>
                    <h3 className="mt-3 text-[22px] leading-[1.25] font-medium tracking-[-0.02em] md:text-[24px]">
                      {service.name}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-ink-70">
                      {service.blurb}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2.5 text-[15px] font-medium">
                    How it works
                    <ArrowCircle />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <h2 className="text-[32px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[40px]">
                How hiring works
              </h2>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.55] text-ink-70">
                Three steps, no portal login, and a written quote before anyone is confirmed.
              </p>
            </div>
            <div className="lg:col-span-8">
              <StepList steps={hiringSteps} />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <h2 className="text-[32px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[40px]">
                One rate, everything in it
              </h2>
              <p className="mt-5 text-[16px] leading-[1.55] text-ink-70">
                We do not publish rates, because an honest rate depends on the classification, the
                site&rsquo;s EBA, the shift pattern and the duration, a table would mislead you.
                Tell us the crew and you get a single all-inclusive hourly rate in writing the same
                day.
              </p>
              <Button href="/request-labour" arrow className="mt-7">
                Request a written quote
              </Button>
            </div>
            <div className="lg:col-span-7">
              <InclusionsCard />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading
            title="Trades we supply"
            lead="Every trade page lists the tickets held, the typical scope and what to brief us on."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {trades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={`/trades/${trade.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] text-ink-70 transition-colors duration-150 hover:border-ink hover:text-ink"
                >
                  {trade.short}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <SectionHeading
              title="Where we crew"
              lead={`${site.serviceArea.area}, across the eight regions below, and never outsourced to anyone else.`}
            />
            <div className="mt-8">
              <RegionTiles regions={regions} />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading title="Compliance questions, answered" />
          <div className="mt-10">
            <FaqList faqs={complianceFaqs} />
          </div>
        </Container>
      </Section>

      <CtaBanner />

      <JsonLd data={faqSchema(complianceFaqs)} />
      <JsonLd
        data={serviceSchema({
          name: "Construction labour hire, Greater Sydney",
          description:
            "Casual, contract and permanent construction labour hire across Greater Sydney, with all statutory on-costs, insurance and a four-hour replacement guarantee included in one hourly charge rate.",
          path: "/labour-hire",
          serviceType: "Construction labour hire",
        })}
      />
    </>
  );
}
