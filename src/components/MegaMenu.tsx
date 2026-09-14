"use client";

import Link from "next/link";
import { DeskStatusLine } from "@/components/DeskStatus";
import { Container } from "@/components/ui/Section";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { site, telHref } from "@/lib/site";

/**
 * The trades and regions panel.
 *
 * Sixteen leaf pages carry the search strategy: eight trades and eight Greater
 * Sydney regions. Before this they were reachable only from the homepage
 * accordion and two index pages, which meant most of the site linked to none
 * of them. They are now one click from the header of every page.
 *
 * Rendered by SiteHeader, which owns the open state and the outside handling,
 * because the panel spans the full header width rather than hanging off its
 * own trigger.
 */
export function MegaMenu({
  id,
  labelledBy,
  activeSlug,
  onNavigate,
}: {
  id: string;
  labelledBy: string;
  /** The trade or region currently being read, if any, so it can be marked. */
  activeSlug: string | null;
  onNavigate: () => void;
}) {
  return (
    <div
      id={id}
      /* absolute, so opening the panel never pushes the page down. */
      className="animate-mega absolute inset-x-0 top-full hidden border-b border-line bg-surface-1 shadow-[0_18px_40px_-24px_rgba(17,17,17,0.35)] lg:block"
    >
      <Container>
        <div className="grid gap-8 py-8 lg:grid-cols-12 lg:gap-6">
          <section className="lg:col-span-6 xl:col-span-5" aria-labelledby={`${labelledBy}-trades`}>
            <ColumnHead
              id={`${labelledBy}-trades`}
              title="Trades we crew"
              href="/trades"
              cta="All trades"
              onNavigate={onNavigate}
            />
            <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
              {trades.map((trade) => (
                <PanelLink
                  key={trade.slug}
                  href={`/trades/${trade.slug}`}
                  label={trade.short}
                  active={activeSlug === trade.slug}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </section>

          <section className="lg:col-span-6 xl:col-span-4" aria-labelledby={`${labelledBy}-regions`}>
            <ColumnHead
              id={`${labelledBy}-regions`}
              title="Greater Sydney"
              href="/sydney"
              cta="All regions"
              onNavigate={onNavigate}
            />
            <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
              {regions.map((region) => (
                <PanelLink
                  key={region.slug}
                  href={`/sydney/${region.slug}`}
                  label={region.name}
                  active={activeSlug === region.slug}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </section>

          {/* Above 1280 the two link lists leave a gap; the gap gets the phone,
              which is the thing this whole business wants a visitor to do.
              Below that there is no gap to fill, and squeezing the card in
              wraps every region name onto two lines. */}
          <div className="hidden xl:col-span-3 xl:block">
            <div className="rounded-card bg-ink p-5 text-white">
              <p className="eyebrow text-accent">Crew needed tomorrow?</p>
              <p className="mt-3 text-[14px] leading-[1.5] text-on-ink-60">
                Tell us the trade, the suburb and the start time. Most requests are
                filled within four hours.
              </p>
              <a
                href={telHref(site.phone)}
                onClick={onNavigate}
                className="mt-4 inline-flex min-h-11 items-center text-[22px] leading-[1.1] font-bold tracking-[-0.03em] transition-colors duration-150 hover:text-accent"
              >
                {site.phone}
              </a>
              <DeskStatusLine className="eyebrow mt-1 text-on-ink-60" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function ColumnHead({
  id,
  title,
  href,
  cta,
  onNavigate,
}: {
  id: string;
  title: string;
  href: string;
  cta: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <h2 id={id} className="eyebrow text-ink-45">
        {title}
      </h2>
      <Link
        href={href}
        onClick={onNavigate}
        className="group text-[13px] font-medium text-ink-70 transition-colors duration-150 hover:text-accent"
      >
        {cta}{" "}
        <span aria-hidden="true" className="arrow-nudge inline-block">
          →
        </span>
      </Link>
    </div>
  );
}

function PanelLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-9 items-center border-b border-line/70 py-1.5 text-[14px] leading-[1.35] transition-colors duration-150 hover:text-accent ${
          active ? "font-semibold text-ink" : "text-ink-70"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
