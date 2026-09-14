import type { Metadata } from "next";
import { StepList } from "@/components/blocks";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container, Section } from "@/components/ui/Section";
import { regions } from "@/lib/content/regions";
import { workerSteps } from "@/lib/content/site-facts";
import { trades } from "@/lib/content/trades";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register for Construction Work in Sydney | 5 Minutes, No CV",
  description:
    "Register with Uphold Group in five minutes: name, mobile, trade, suburb and the tickets you hold. We text you Sydney roles near your suburb and you are paid weekly with super and portable long service leave handled.",
  alternates: { canonical: "/workers/register" },
};

export default async function RegisterPage({ searchParams }: PageProps<"/workers/register">) {
  const { role } = await searchParams;
  const roleRef = typeof role === "string" ? role : undefined;

  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            { label: "Find work", href: "/jobs" },
            { label: "Register", href: "/workers/register" },
          ]}
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">Two steps · about five minutes</p>
              <h1 className="mt-4 text-[38px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[52px]">
                Register for Sydney work
              </h1>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.55] text-ink-70">
                No CV, no password, no portal. Tell us your trade, your suburb and the tickets
                you hold. Bring the cards themselves to your interview, where we verify them
                against the register and agree your pay.
              </p>
              {roleRef && (
                <p className="eyebrow mt-6 inline-flex rounded-full bg-accent-tint px-4 py-2 text-accent-press">
                  Applying for role {roleRef}
                </p>
              )}

              <div className="mt-10">
                <RegisterForm trades={trades} regions={regions} role={roleRef} />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-card bg-ink p-6 text-white md:p-7">
                <p className="eyebrow text-accent">What you get</p>
                <ul className="mt-5 space-y-4 text-[15px] leading-[1.6] text-on-ink-60">
                  <li>
                    <strong className="block text-white">Roles by text, not by app</strong>
                    We text you Sydney roles that match your tickets and your suburb, usually
                    before they hit the job boards. Reply yes or no.
                  </li>
                  <li>
                    <strong className="block text-white">Paid weekly, super correct</strong>
                    Pay lands weekly, superannuation is paid at the legislated rate, and your NSW
                    portable long service leave is registered on your behalf.
                  </li>
                  <li>
                    <strong className="block text-white">Site details the night before</strong>
                    Address, gate, start time, supervisor name and the PPE that site needs, in one
                    SMS. Digital timesheet in the same thread.
                  </li>
                  <li>
                    <strong className="block text-white">A path to permanent</strong>
                    After 500 hours on a site there is no conversion fee, so a host can take you on
                    directly without it costing them.
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-card bg-surface-2 p-6 md:p-7">
                <p className="eyebrow text-ink-45">Prefer to call?</p>
                <a
                  href={telHref(site.phone)}
                  className="mt-3 inline-flex min-h-11 items-center text-[26px] leading-[1.1] font-bold tracking-[-0.03em] transition-colors duration-150 hover:text-accent"
                >
                  {site.phone}
                </a>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">
                  {site.hours[0].label} {site.hours[0].value} · {site.hours[1].label}{" "}
                  {site.hours[1].value}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
            What happens next
          </h2>
          <div className="mt-10">
            <StepList steps={workerSteps} />
          </div>
        </Container>
      </Section>
    </>
  );
}
