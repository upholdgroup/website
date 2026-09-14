"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DeskStatusCall, DeskStatusLine } from "@/components/DeskStatus";
import { Logo } from "@/components/Logo";
import { MegaMenu } from "@/components/MegaMenu";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { nav, site, telHref } from "@/lib/site";

const MEGA_ID = "trades-regions-panel";
const MEGA_TRIGGER = "trades-regions-trigger";

/**
 * Left aligned: logo, then the row immediately beside it, with the hire desk
 * and the CTA hard right.
 *
 * The previous header centred the nav in a pill group between the logo and the
 * buttons, which meant three blocks competing for a fixed middle and labels
 * wrapping to two lines between 1024 and 1150px. Left aligning removes the
 * contest and hands the whole right hand side to the phone, which is the one
 * thing a builder at 6am actually wants.
 */
export function SiteHeader() {
  const pathname = usePathname();

  // Both menus are remembered against the route they were opened on, so a
  // navigation (including back and forward) closes them during render rather
  // than in an effect, which would paint the old menu over the new page first.
  const [menu, setMenu] = useState({ sheet: false, mega: false, at: pathname });
  if ((menu.sheet || menu.mega) && menu.at !== pathname) {
    setMenu({ sheet: false, mega: false, at: pathname });
  }
  const sheetOpen = menu.sheet && menu.at === pathname;
  const megaOpen = menu.mega && menu.at === pathname;

  const closeAll = () => setMenu({ sheet: false, mega: false, at: pathname });
  const headerRef = useRef<HTMLElement>(null);

  // Escape closes whichever is open, and a click outside the header closes the
  // panel. Only bound while something is open, so the idle page carries no
  // document level listeners.
  useEffect(() => {
    if (!sheetOpen && !megaOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll();
        document.getElementById(megaOpen ? MEGA_TRIGGER : "menu-trigger")?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeAll();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen, megaOpen, pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // The panel trigger highlights while the reader is on any of its sixteen
  // leaf pages, not only on the two index pages.
  const inTradesOrRegions = isActive("/trades") || isActive("/sydney");
  const activeSlug =
    [...trades, ...regions]
      .map((entry) => entry.slug)
      .find((slug) => pathname.endsWith(`/${slug}`)) ?? null;

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => megaOpen && setMenu({ sheet: false, mega: false, at: pathname })}
      /* Opaque, and no backdrop-filter.
         A sticky element with a backdrop-filter is promoted to its own
         compositing layer and re-samples what is behind it every frame. That
         combination is the standard cause of a header that shimmers or
         flickers during momentum and overscroll on real hardware, and it is
         invisible in a headless browser, which composites differently. At 92%
         over a white page the blur was buying almost nothing to begin with. */
      className="sticky top-0 z-40 border-b border-line bg-surface-1"
    >
      <Container>
        <div className="flex h-[60px] items-center gap-4 sm:h-[68px] md:h-[76px] lg:gap-6">
          <Logo compactTagline />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) =>
                item.mega ? (
                  <li key={item.href}>
                    <button
                      id={MEGA_TRIGGER}
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls={MEGA_ID}
                      onClick={() =>
                        setMenu({ sheet: false, mega: !megaOpen, at: pathname })
                      }
                      onMouseEnter={() => setMenu({ sheet: false, mega: true, at: pathname })}
                      className={`inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[14px] whitespace-nowrap transition-colors duration-150 ${
                        megaOpen || inTradesOrRegions
                          ? "font-medium text-ink"
                          : "text-ink-70 hover:text-ink"
                      }`}
                    >
                      {item.label}
                      <Chevron open={megaOpen} />
                    </button>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onMouseEnter={() =>
                        megaOpen && setMenu({ sheet: false, mega: false, at: pathname })
                      }
                      className={`inline-flex h-11 items-center rounded-full px-3 text-[14px] whitespace-nowrap transition-colors duration-150 ${
                        isActive(item.href)
                          ? "font-medium text-ink"
                          : "text-ink-70 hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* ml-auto rather than justify-between: with the nav left aligned the
              right hand block has to be pushed, not spaced. */}
          <div className="ml-auto flex items-center gap-3 lg:gap-4">
            <DeskStatusCall className="hidden md:flex" />

            {/* Wrapped rather than given a `hidden` class: Button's own
                `inline-flex` would win the display cascade. Below sm the CTA
                lives in the fixed bottom bar instead. */}
            <div className="hidden sm:block">
              <Button href="/request-labour" arrow>
                Get a crew
              </Button>
            </div>

            <button
              id="menu-trigger"
              type="button"
              onClick={() => setMenu({ sheet: !sheetOpen, mega: false, at: pathname })}
              aria-expanded={sheetOpen}
              aria-controls="mobile-nav"
              /* Filled rather than outlined. A thin ring on an otherwise empty
                 header reads as a stray circle; a soft fill sits with the
                 rounded language and keeps the full 44px target. */
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink transition-colors duration-150 hover:bg-line lg:hidden"
            >
              <span className="sr-only">{sheetOpen ? "Close menu" : "Open menu"}</span>
              <MenuIcon open={sheetOpen} />
            </button>
          </div>
        </div>
      </Container>

      {megaOpen && (
        <MegaMenu
          id={MEGA_ID}
          labelledBy={MEGA_ID}
          activeSlug={activeSlug}
          onNavigate={closeAll}
        />
      )}

      {sheetOpen && (
        <div
          id="mobile-nav"
          /* Capped so the sheet ends above the fixed action bar rather than
             running under it: 60px header + 73px bar. A padded bottom would
             do the same job when the sheet is long, but leave a band of dead
             white under it when both groups are collapsed. */
          className="max-h-[calc(100dvh-133px)] overflow-y-auto border-t border-line bg-surface-1 sm:max-h-[calc(100dvh-141px)] lg:hidden"
        >
          <Container>
            <nav aria-label="Primary, mobile" className="py-3">
              <ul>
                {nav.map((item) =>
                  item.mega ? null : (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`flex h-12 items-center justify-between border-b border-line text-[16px] ${
                          isActive(item.href) ? "font-semibold text-ink" : "text-ink-70"
                        }`}
                      >
                        {item.label}
                        <span aria-hidden="true" className="text-ink-45">
                          →
                        </span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              {/* Sixteen links would bury the four above them, so on a phone
                  the panel becomes two native disclosures. No JavaScript, and
                  the browser handles the keyboard for us. */}
              <MobileGroup
                title="Trades"
                allHref="/trades"
                allLabel="All trades"
                open={isActive("/trades")}
                links={trades.map((t) => ({ href: `/trades/${t.slug}`, label: t.short }))}
              />
              <MobileGroup
                title="Sydney regions"
                allHref="/sydney"
                allLabel="All regions"
                open={isActive("/sydney")}
                links={regions.map((r) => ({ href: `/sydney/${r.slug}`, label: r.name }))}
              />

              {/* flex-1 only once the row is horizontal. In the stacked column
                  it is `flex: 1 1 0%` on the main axis, which beats the
                  button's own h-11 and collapsed both of these to 22px, half
                  the minimum tap target. Stacked, stretch already fills the
                  width. */}
              <div className="flex flex-col gap-3 py-4 sm:flex-row">
                <Button href="/request-labour" arrow className="sm:flex-1">
                  Request labour
                </Button>
                <Button href={telHref(site.phone)} variant="outline" className="sm:flex-1">
                  Call {site.phone}
                </Button>
              </div>
              <DeskStatusLine className="eyebrow pb-4 text-ink-45" />
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

function MobileGroup({
  title,
  allHref,
  allLabel,
  open,
  links,
}: {
  title: string;
  allHref: string;
  allLabel: string;
  open: boolean;
  links: { href: string; label: string }[];
}) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between text-[16px] text-ink-70 marker:hidden [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden="true"
          className="text-ink-45 transition-transform duration-200 group-open:rotate-180"
        >
          ⌄
        </span>
      </summary>
      <ul className="pb-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex h-11 items-center pl-4 text-[15px] text-ink-70 transition-colors duration-150 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={allHref}
            className="flex h-11 items-center pl-4 text-[15px] font-medium text-ink"
          >
            {allLabel}{" "}
            <span aria-hidden="true" className="ml-1.5 text-accent">
              →
            </span>
          </Link>
        </li>
      </ul>
    </details>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1l3.5 3.5L8 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
      {open ? (
        <path d="M2 2l14 10M16 2L2 12" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path
          d="M0 1.5h18M0 7h18M0 12.5h18"
          stroke="#111111"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
