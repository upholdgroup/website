import Link from "next/link";
import { ArrowCircle } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The two doors — the most important component on the site.
 *
 * Ink card = host path, warm grey card = worker path. Stacked host-first on
 * mobile. Never make one audience read the other's page.
 */
export function AudienceCards() {
  return (
    <Section tight>
      <Container>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <Door
            href="/request-labour"
            eyebrow="For builders & site managers"
            title="Need a crew"
            body="Tell us the roles, tickets and start date. Most Sydney requests are filled within four hours, and you get one weekly invoice."
              action="Request labour"
              tone="ink"
            />
          </Reveal>
          <Reveal delay={110}>
            <Door
            href="/jobs"
            eyebrow="For trades & labourers"
            title="Looking for work"
            body="Register in five minutes with your White Card and tickets. We text you shifts near your suburb, and you are paid weekly with super and portable LSL handled."
              action="See live jobs"
              tone="grey"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Door({
  href,
  eyebrow,
  title,
  body,
  action,
  tone,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  tone: "ink" | "grey";
}) {
  const ink = tone === "ink";

  return (
    <Link
      href={href}
      className={`lift group flex h-full min-h-[220px] flex-col justify-between gap-12 rounded-audience p-7 transition-colors duration-150 md:p-8 ${
        ink ? "bg-ink hover:bg-[#1c1c1c]" : "bg-surface-2 hover:bg-[#eeeeeb]"
      }`}
    >
      <div className="flex flex-col gap-2.5">
        <span className={`eyebrow ${ink ? "text-accent" : "text-accent-press"}`}>{eyebrow}</span>
        <h2
          className={`text-[26px] leading-[1.1] font-bold tracking-[-0.03em] md:text-[34px] ${
            ink ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        <p
          className={`max-w-[40ch] text-[15px] leading-[1.6] ${ink ? "text-on-ink-60" : "text-ink-70"}`}
        >
          {body}
        </p>
      </div>

      <span
        className={`mt-auto inline-flex items-center gap-2.5 text-[15px] font-medium ${
          ink ? "text-white" : "text-ink"
        }`}
      >
        {action}
        <ArrowCircle tone={ink ? "accent" : "accent"} />
      </span>
    </Link>
  );
}
