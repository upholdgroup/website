import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner, ProofChips } from "@/components/blocks";
import { ArrowCircle, Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { trades } from "@/lib/content/trades";
import { regions } from "@/lib/content/regions";
import { RegionTiles } from "@/components/blocks";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trades & Classifications We Supply | Labour Hire Sydney",
  description:
    "Every trade Uphold Group supplies across Greater Sydney: labourers, carpenters and formwork, scaffolders and riggers, traffic control, plant operators, warehouse and logistics. Tickets held and typical scope on every page.",
  alternates: { canonical: "/trades" },
};

export default function TradesIndex() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Trades", href: "/trades" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ink-45">{site.serviceArea.short}</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[56px]">
                Trades and classifications we supply
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">
                Uphold Group supplies ticketed workers to commercial construction, civil and
                infrastructure, fitout and warehousing sites across Greater Sydney, and covers the
                site cleaning and licensed security that go with them. Each page below lists the
                tickets held, the scope those workers typically cover and what to brief us on. Most
                Sydney requests are filled within four hours.
              </p>
              <ProofChips />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {trades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={`/trades/${trade.slug}`}
                  className="lift group flex h-full flex-col justify-between gap-8 rounded-card border border-line p-6 transition-colors duration-150 hover:border-ink md:p-7"
                >
                  <div>
                    <h2 className="text-[22px] leading-[1.25] font-medium tracking-[-0.02em] md:text-[24px]">
                      {trade.name}
                    </h2>
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-ink-70">
                      {trade.blurb}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2.5 text-[15px] font-medium">
                    Tickets &amp; scope
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
            title="Every trade, in every Sydney region"
            lead="We crew the eight Greater Sydney regions below. Region pages name their suburbs, list a local project and carry live local roles."
          />
          <div className="mt-10">
            <RegionTiles regions={regions} />
          </div>
          <Button href="/labour-hire" variant="outline" arrow className="mt-8">
            How engagements work
          </Button>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
