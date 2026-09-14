import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Section";
import { site, telHref } from "@/lib/site";

const hireLinks = [
  { label: "Hire workers", href: "/labour-hire" },
  { label: "Trades & classifications", href: "/trades" },
  { label: "Insurance & compliance", href: "/compliance" },
  { label: "Sydney regions", href: "/sydney" },
  { label: "Request labour", href: "/request-labour" },
];

const workerLinks = [
  { label: "Live jobs", href: "/jobs" },
  { label: "Register for work", href: "/workers/register" },
  { label: "Pay, super & portable LSL", href: "/workers#pay" },
  { label: "Worker safety & WHS", href: "/workers#safety" },
  { label: "Contact us", href: "/contact" },
];

export function SiteFooter() {
  return (
    /* pb clears the fixed mobile action bar so the last link is never under it. */
    <footer className="border-t border-line bg-surface-2 pb-24 lg:pb-0">
      <Container>
        <div className="grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 text-[15px] leading-[1.7] text-ink-70">
              {site.serviceArea.state}, {site.countryName}
            </p>
            {/* Rendered only once there is a real ABN. An empty label reading
                "ABN" with nothing after it is worse than no label. */}
            {site.abn && <p className="eyebrow mt-4 text-ink-45">ABN {site.abn}</p>}
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-ink-45">Hire desk</h2>
            <ul className="mt-4 space-y-1 text-[15px] leading-[1.7] text-ink-70">
              {site.hours.map((h) => (
                <li key={h.label}>
                  {h.label} · {h.value}
                </li>
              ))}
            </ul>
            {/* Both are standalone tap targets, so they carry the 44px
                minimum rather than only their text height. The phone is the
                single most important target on the site. */}
            <p className="mt-3 flex flex-col text-[15px] font-semibold">
              <a
                href={telHref(site.phone)}
                className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-accent"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.hireEmail}`}
                className="inline-flex min-h-11 items-center font-normal text-ink-70 transition-colors duration-150 hover:text-accent"
              >
                {site.hireEmail}
              </a>
            </p>
          </div>

          <nav className="lg:col-span-2" aria-label="Hire workers">
            <h2 className="eyebrow text-ink-45">Hire workers</h2>
            <FooterList links={hireLinks} />
          </nav>

          <nav className="lg:col-span-3" aria-label="Find work">
            <h2 className="eyebrow text-ink-45">Find work</h2>
            <FooterList links={workerLinks} />
          </nav>
        </div>

        <div className="border-t border-line py-8">
          <div className="eyebrow flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-45">
            <span>© {new Date().getFullYear()} {site.legalName.toUpperCase()}</span>
            <span>Servicing {site.serviceArea.short}</span>
            {/* The legal row is 11px type, so the links carry the 44px
                minimum target rather than only their line height. */}
            <Link
              href="/compliance"
              className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-ink"
            >
              WHS policy
            </Link>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-ink"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-ink"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-[15px] leading-[1.4] text-ink-70 transition-colors duration-150 hover:text-accent"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
