import type { Metadata } from "next";
import { PageCta } from "@/components/blocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container, Section } from "@/components/ui/Section";
import { policySections } from "@/lib/content/privacy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | How We Handle Your Information",
  description:
    "How Uphold Group collects, uses, stores and discloses personal information under the Privacy Act 1988 and the Australian Privacy Principles, including what we keep, for how long, and how to access or correct it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Container>
        <Breadcrumbs trail={[{ label: "Privacy", href: "/privacy" }]} />
      </Container>

      <Section tight>
        <Container>
          <div className="max-w-[68ch]">
            <p className="eyebrow text-accent-press">
              Version {site.privacy.version} · Effective {site.privacy.effective}
            </p>
            <h1 className="mt-4 text-[38px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[52px]">
              Privacy policy
            </h1>
            <p className="mt-5 text-[17px] leading-[1.55] text-ink-70">
              What we collect, why we collect it, who sees it and how long we keep it. Written to
              the Australian Privacy Principles, and in plain sentences rather than legalese,
              because a policy nobody reads protects nobody.
            </p>
          </div>
        </Container>
      </Section>

      <Section tight className="border-t border-line">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <nav aria-label="On this page" className="lg:col-span-4">
              <p className="eyebrow text-ink-45">On this page</p>
              <ol className="mt-4 lg:sticky lg:top-28">
                {policySections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${slug(section.heading)}`}
                      className="inline-flex min-h-11 items-center text-[15px] leading-[1.4] text-ink-70 transition-colors duration-150 hover:text-accent"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="lg:col-span-8">
              {policySections.map((section) => (
                <section
                  key={section.heading}
                  id={slug(section.heading)}
                  className="scroll-mt-28 border-b border-line pb-9 not-last:mb-9 last:border-b-0 last:pb-0"
                >
                  <h2 className="text-[24px] leading-[1.2] font-bold tracking-[-0.03em] md:text-[28px]">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 max-w-[64ch] text-[16px] leading-[1.65] text-ink-70"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <PageCta
        title="Questions about your information?"
        body={`Email ${site.privacy.email} or call ${site.phone}. We answer access and correction requests within thirty days, and there is no charge.`}
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Insurance & compliance", href: "/compliance" }}
      />
    </>
  );
}

const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
