import type { ReactNode } from "react";

/** 1240px measure, 20–24px page margin. Every band on the site sits in one. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 md:px-6 ${className}`}>{children}</div>;
}

/**
 * Section rhythm 96 / 112.
 *
 * Deliberately does not animate. An earlier version faded every band in as
 * well as its contents, so a single navigation fired the route transition, a
 * band fade and an item stagger on top of each other. One motion per thing.
 */
export function Section({
  children,
  className = "",
  id,
  tight = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${tight ? "py-14 md:py-20" : "py-16 md:py-24 lg:py-28"} ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Split section: 4 / 8 — label left, content right (design-system.md §4).
 * Stacks on anything below lg.
 */
export function SplitSection({
  label,
  lead,
  aside,
  children,
  id,
  className = "",
}: {
  label: string;
  lead?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <Section id={id} className={className}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Pinned while its content scrolls past, so a long band keeps its
              heading in view instead of leaving the reader unanchored. */}
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <h2 className="text-[32px] leading-[1.05] font-bold tracking-[-0.03em] text-balance md:text-[40px]">
              {label}
            </h2>
            {lead && <div className="mt-5 max-w-[46ch] text-[16px] leading-[1.55] text-ink-70">{lead}</div>}
            {aside && <div className="mt-7">{aside}</div>}
          </div>
          <div className="lg:col-span-8">{children}</div>
        </div>
      </Container>
    </Section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow text-ink-45">{eyebrow}</p>}
      <h2 className="mt-3 text-[32px] leading-[1.05] font-bold tracking-[-0.03em] text-balance md:text-[40px]">
        {title}
      </h2>
      {lead && <p className="measure mt-5 text-[16px] leading-[1.55] text-ink-70 md:text-[17px]">{lead}</p>}
    </div>
  );
}

/**
 * Two-tone lead — first clause in ink, remainder in ink-45. Once per page,
 * reserved for the verification promise.
 */
export function TwoToneLead({ lead, tail }: { lead: string; tail: string }) {
  return (
    <p className="mx-auto max-w-[26ch] text-center text-[26px] leading-[1.35] font-medium tracking-[-0.02em] text-balance md:max-w-[34ch] md:text-[32px]">
      {lead} <span className="text-ink-45">{tail}</span>
    </p>
  );
}
