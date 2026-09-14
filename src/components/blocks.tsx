import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import Image from "next/image";
import { photos } from "@/lib/content/photos";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import type { Faq } from "@/lib/content/trades";
import type { Region } from "@/lib/content/regions";
import { inclusions, stats } from "@/lib/content/site-facts";
import { site, telHref } from "@/lib/site";

/** Insurance and verification evidence, above the fold for hosts. */
export function ProofChips({ items = site.proof }: { items?: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((chip) => (
        <li
          key={chip}
          className="eyebrow inline-flex min-h-8 items-center rounded-full border border-line bg-surface-1 px-3.5 py-1.5 text-ink-70"
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}

/** Operational metrics, four across. Never dollars. */
export function StatGrid() {
  return (
    <Section tight>
      <Container>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal as="li" key={stat.label} delay={i * 70} className="rounded-card bg-surface-2 p-6 md:p-7">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-tint text-accent-press"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M2 12.5 6.5 8l3.5 3.5L16 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="mt-7 text-[30px] leading-none font-bold tracking-[-0.03em] md:text-[34px]">
                <Counter value={stat.value} />
              </p>
              <p className="mt-2 text-[13px] leading-[1.4] text-ink-70">{stat.label}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function StepList({
  steps,
}: {
  steps: { eyebrow: string; title: string; body: string }[];
}) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 90} className="rounded-card border border-line p-6 md:p-7">
          <p className="eyebrow text-accent-press">{step.eyebrow}</p>
          <h3 className="mt-4 text-[20px] leading-[1.25] font-medium tracking-[-0.02em] md:text-[22px]">
            {step.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{step.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Replaces any rate table — what the hour buys, never what it costs. */
export function InclusionsCard() {
  return (
    <div className="rounded-card border border-line">
      <p className="eyebrow border-b border-line px-6 py-4 text-ink-45">
        Included in every hour charged
      </p>
      <ul className="px-6 py-2">
        {inclusions.map((item, i) => (
          <Reveal
            as="li"
            key={item}
            delay={i * 60}
            className="flex items-start gap-3 border-b border-line py-3.5 text-[15px] leading-[1.5] text-ink-70 last:border-b-0 md:text-[16px]"
          >
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </Reveal>
        ))}
      </ul>
      <p className="eyebrow border-t border-line px-6 py-4 text-ink-45">
        Quoted per site and per classification · never published
      </p>
    </div>
  );
}

/** Eight tiles, one per Greater Sydney region — the local SEO engine. */
export function RegionTiles({ regions }: { regions: Region[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {regions.map((region, i) => (
        <Reveal as="li" key={region.slug} delay={(i % 4) * 60}>
          <Link
            href={`/sydney/${region.slug}`}
            className="lift flex h-full flex-col rounded-media bg-surface-2 p-5 transition-colors duration-150 hover:bg-[#eeeeeb]"
          >
            <span className="text-[18px] leading-[1.3] font-semibold tracking-[-0.02em]">
              {region.name}
            </span>
            <span className="mt-2 text-[13px] leading-[1.5] text-ink-45">{region.headline}</span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

/** Answers written as standalone paragraphs so they lift whole into AI summaries. */
export function FaqList({ faqs, columns = 2 }: { faqs: Faq[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-4 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {faqs.map((faq, i) => (
        <Reveal as="li" key={faq.q} delay={(i % 2) * 70} className="rounded-card border border-line p-6 md:p-7">
          <h3 className="text-[17px] leading-[1.35] font-semibold tracking-[-0.01em] md:text-[18px]">
            {faq.q}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{faq.a}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * Full width crew photo with the copy laid over it.
 *
 * The photo runs the whole width rather than sitting in a right hand panel,
 * and dark gradients hold both edges: a heavy one on the left so the headline
 * and buttons have something to sit on, a lighter one on the right so the
 * frame closes instead of stopping dead. That is the design system's scrim
 * rule, which is what makes overlay text legible on a photo that changes.
 */
export function CtaBanner({
  title = "Short a crew for Monday?",
  body = "Send the roles and tickets you need. We answer from 5:30am to 8pm, seven days, and you get named Sydney workers plus a written rate the same day.",
  action = { label: "Request labour", href: "/request-labour" },
  photo = photos.crewOnSite,
}: {
  title?: string;
  body?: string;
  action?: { label: string; href: string };
  photo?: { src: string; alt: string; position?: string };
}) {
  return (
    <Section tight>
      <Container>
        <div className="relative overflow-hidden rounded-hero bg-ink">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1280px) 1240px, 100vw"
            style={photo.position ? { objectPosition: photo.position } : undefined}
            className="object-cover"
          />

          {/* Left scrim carries the text. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent md:via-ink/70 md:to-ink/5"
          />
          {/* Right and bottom edges, so the photo closes rather than stops. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-l from-ink/70 via-transparent to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent"
          />

          <div className="relative p-8 md:p-12 lg:p-14 lg:pr-[45%]">
            <h2 className="max-w-[14ch] text-[32px] leading-[1.02] font-bold tracking-[-0.035em] text-white text-balance md:text-[44px]">
              {title}
            </h2>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.6] text-white/75 md:text-[17px]">
              {body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={action.href} size="lg" arrow>
                {action.label}
              </Button>
              <Button href={telHref(site.phone)} size="lg" variant="on-ink">
                Call {site.phone}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Claim → proof → action, at the foot of a page that is not the homepage. */
export function PageCta({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Section tight className="border-t border-line">
      <Container>
        <SectionHeading title={title} lead={body} />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={primary.href} size="lg" arrow>
            {primary.label}
          </Button>
          <Button href={secondary?.href ?? telHref(site.phone)} size="lg" variant="outline">
            {secondary?.label ?? `Call ${site.phone}`}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
