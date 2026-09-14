import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner, ProofChips } from "@/components/blocks";
import { ArrowCircle, Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Labour Hire Across Greater Sydney | Regions We Crew",
  description:
    "Uphold Group crews eight Greater Sydney regions: CBD, Inner West, Parramatta and the Greater West, North Shore and Hills, Northern Beaches, Eastern Suburbs, South West and Liverpool, Sutherland and St George.",
  alternates: { canonical: "/sydney" },
};

export default function RegionIndex() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Sydney regions", href: "/sydney" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">{site.serviceArea.short}</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[58px]">
                Eight regions, one Sydney office
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">
                Every Uphold worker is interviewed and inducted before they are sent to any of
                the eight Greater Sydney regions below. No outsourced call centre, and no claims about places we do not yet
                crew: if a suburb is not on this page, we will say so on the call.
              </p>
              <ProofChips />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {regions.map((region) => (
              <li key={region.slug}>
                <Link
                  href={`/sydney/${region.slug}`}
                  className="lift group flex h-full flex-col justify-between gap-8 rounded-card border border-line p-6 transition-colors duration-150 hover:border-ink md:p-7"
                >
                  <div>
                    <h2 className="text-[22px] leading-[1.25] font-medium tracking-[-0.02em] md:text-[24px]">
                      {region.name}
                    </h2>
                    <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">
                      {region.suburbs.join(" · ")}
                    </p>
                    <p className="eyebrow mt-4 text-ink-45">{region.project.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-2.5 text-[15px] font-medium">
                    Crews in this region
                    <ArrowCircle />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <SectionHeading
            title="Every trade, in every region"
            lead="Tickets held, typical scope and what to brief us on, one page per trade."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {trades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={`/trades/${trade.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] text-ink-70 transition-colors duration-150 hover:border-ink hover:text-ink"
                >
                  {trade.short}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/labour-hire" variant="outline" arrow className="mt-8">
            How engagements work
          </Button>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
