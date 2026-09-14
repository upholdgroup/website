import type { Metadata } from "next";
import { InclusionsCard, ProofChips, StepList } from "@/components/blocks";
import { RequestLabourForm } from "@/components/forms/RequestLabourForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container, Section } from "@/components/ui/Section";
import { hiringSteps, stats } from "@/lib/content/site-facts";
import { trades } from "@/lib/content/trades";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request Labour | Sydney Crews, Quoted in Writing Same Day",
  description:
    "Tell us the roles, tickets, suburb and start time. Most Greater Sydney requests are filled within four hours, with named workers and a written all-inclusive rate the same day.",
  alternates: { canonical: "/request-labour" },
  robots: { index: true, follow: true },
};

export default function RequestLabourPage() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Request labour", href: "/request-labour" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">Three steps · under 60 seconds</p>
              <h1 className="mt-4 text-[38px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[52px]">
                Request a crew
              </h1>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.55] text-ink-70">
                Six fields. You get named workers with ticket classes and expiry dates, plus a
                single all-inclusive hourly rate per classification in writing the same day. Nothing
                is confirmed until you say so.
              </p>

              <div className="mt-10">
                <RequestLabourForm trades={trades} />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-card bg-surface-2 p-6 md:p-7">
                <p className="eyebrow text-ink-45">Or skip the form</p>
                <a
                  href={telHref(site.phone)}
                  className="mt-3 inline-flex min-h-11 items-center text-[30px] leading-[1.1] font-bold tracking-[-0.03em] transition-colors duration-150 hover:text-accent md:text-[34px]"
                >
                  {site.phone}
                </a>
                <ul className="mt-4 space-y-1 text-[15px] leading-[1.6] text-ink-70">
                  {site.hours.map((h) => (
                    <li key={h.label}>
                      {h.label} · {h.value}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-line pt-5 text-[15px] leading-[1.6] text-ink-70">
                  At 6am the phone beats a form. A consultant answers, there is no queue and no
                  switchboard.
                </p>
              </div>

              <div className="mt-6">
                <ProofChips />
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <li key={stat.label} className="rounded-media border border-line p-5">
                    <p className="text-[24px] leading-none font-bold tracking-[-0.03em]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.4] text-ink-70">{stat.label}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <InclusionsCard />
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
            What happens after you send it
          </h2>
          <div className="mt-10">
            <StepList steps={hiringSteps} />
          </div>
        </Container>
      </Section>
    </>
  );
}
