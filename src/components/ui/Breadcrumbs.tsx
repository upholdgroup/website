import Link from "next/link";
import { site } from "@/lib/site";
import { JsonLd } from "./JsonLd";

export type Crumb = { label: string; href: string };

/** Visible trail plus BreadcrumbList — both reinforce the trade/region hierarchy. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const items = [{ label: "Home", href: "/" }, ...trail];

  return (
    <>
      <nav aria-label="Breadcrumb" className="pt-6 md:pt-8">
        <ol className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-45">
          {items.map((crumb, i) => {
            const last = i === items.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    /* A breadcrumb is navigation, so it carries the 44px
                       minimum target even though the label is 11px. */
                    href={crumb.href}
                    className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            item: `${site.url}${crumb.href === "/" ? "" : crumb.href}`,
          })),
        }}
      />
    </>
  );
}
