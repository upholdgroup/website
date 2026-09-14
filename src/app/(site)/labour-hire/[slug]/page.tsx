import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, FaqList, InclusionsCard, ProofChips, StepList } from "@/components/blocks";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { services, serviceBySlug } from "@/lib/content/services";
import { hiringSteps } from "@/lib/content/site-facts";
import { trades } from "@/lib/content/trades";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/labour-hire/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.name} | Sydney Construction Crews`,
    description: `${service.blurb} Across ${site.serviceArea.area}, quoted in writing the same day.`,
    alternates: { canonical: `/labour-hire/${service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/labour-hire/[slug]">) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            { label: "Hire workers", href: "/labour-hire" },
            { label: service.short, href: `/labour-hire/${service.slug}` },
          ]}
        />
      </Container>

      <Section tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent-press">Engagement type · Greater Sydney</p>
              <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[56px]">
                {service.h1}
              </h1>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:pt-4">
              <p className="text-[17px] leading-[1.55] text-ink-70">{service.intro}</p>
              <ProofChips />
              <Button href="/request-labour" size="lg" arrow className="self-start">
                Request labour
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {service.points.map((point) => (
              <li key={point.title} className="rounded-card bg-surface-2 p-6 md:p-7">
                <h2 className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em] md:text-[22px]">
                  {point.title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{point.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <h2 className="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[34px]">
                Best used for
              </h2>
              <ul className="mt-6 space-y-3">
                {service.bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[16px] leading-[1.55] text-ink-70 md:text-[17px]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <InclusionsCard />
            </div>
          </div>
        </Container>
      </Section>

      <Section tight className="bg-surface-2">
        <Container>
          <SectionHeading title="How hiring works" />
          <div className="mt-10">
            <StepList steps={hiringSteps} />
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <SectionHeading title={`${service.short}, common questions`} />
          <div className="mt-10">
            <FaqList faqs={service.faqs} />
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <h2 className="eyebrow text-ink-45">Other engagement types</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/labour-hire/${other.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] text-ink-70 transition-colors duration-150 hover:border-ink hover:text-ink"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="eyebrow mt-10 text-ink-45">Trades</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
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
        </Container>
      </Section>

      <CtaBanner />

      <JsonLd data={faqSchema(service.faqs)} />
      <JsonLd
        data={serviceSchema({
          name: service.h1,
          description: service.blurb,
          path: `/labour-hire/${service.slug}`,
          serviceType: service.name,
        })}
      />
    </>
  );
}
