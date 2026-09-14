import type { Metadata } from "next";
import { ProofChips } from "@/components/blocks";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { organisationSchema } from "@/lib/schema";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Uphold Group | Sydney Labour Hire Desk",
  description: `Call ${site.phone}. The hire desk answers from 5:30am to 8pm weekdays and 6am to 4pm weekends, for crews anywhere in ${site.serviceArea.area}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Contact", href: "/contact" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">{site.serviceArea.short}</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[56px]">
                Talk to the hire desk
              </h1>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.55] text-ink-70">
                A consultant answers, there is no queue, no switchboard and no interstate call
                centre. At 6am, when a crew has not turned up, the phone beats every form on this
                site.
              </p>

              <a
                href={telHref(site.phone)}
                className="mt-8 inline-flex min-h-11 items-center text-[40px] leading-[1.1] font-bold tracking-[-0.035em] transition-colors duration-150 hover:text-accent md:text-[52px]"
              >
                {site.phone}
              </a>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/request-labour" size="lg" arrow>
                  Request labour
                </Button>
                <Button href="/workers/register" size="lg" variant="outline">
                  Register for work
                </Button>
              </div>

              <div className="mt-10">
                <ProofChips />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-card bg-surface-2 p-6 md:p-7">
                <h2 className="eyebrow text-ink-45">Hire desk hours</h2>
                <ul className="mt-4 space-y-1 text-[16px] leading-[1.7]">
                  {site.hours.map((h) => (
                    <li key={h.label}>
                      <span className="text-ink-45">{h.label}</span> {h.value}
                    </li>
                  ))}
                </ul>

                <h2 className="eyebrow mt-8 text-ink-45">Email</h2>
                <ul className="mt-4 space-y-2 text-[16px]">
                  <li>
                    <a
                      href={`mailto:${site.hireEmail}`}
                      className="underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
                    >
                      {site.hireEmail}
                    </a>{" "}
                    <span className="text-ink-45">for hosts</span>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.workEmail}`}
                      className="underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
                    >
                      {site.workEmail}
                    </a>{" "}
                    <span className="text-ink-45">for workers</span>
                  </li>
                </ul>

                <h2 className="eyebrow mt-8 text-ink-45">Where we work</h2>
                <p className="mt-4 text-[16px] leading-[1.7]">{site.serviceArea.short}</p>
                <p className="mt-4 text-[15px] leading-[1.6] text-ink-70">
                  We run mobile rather than from a shopfront, so there is no counter to walk
                  up to. Interviews and ticket checks are arranged to suit you: in person, on
                  site, or by video. Bring the physical ticket cards either way.
                </p>
                {site.abn && (
                  <p className="eyebrow mt-6 border-t border-line pt-5 text-ink-45">
                    ABN {site.abn}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading
            title="Where we work"
            lead={`The eight ${site.serviceArea.area} regions listed across this site. ${site.serviceArea.caveat}`}
          />
        </Container>
      </Section>

      <JsonLd data={organisationSchema()} />
    </>
  );
}
