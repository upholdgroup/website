import { MobileActionBar } from "@/components/MobileActionBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { RegionTiles } from "@/components/blocks";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { regions } from "@/lib/content/regions";
import { site, telHref } from "@/lib/site";

export const metadata = { title: "Page not found" };

/**
 * Sits outside the (site) route group, so it renders the chrome itself rather
 * than inheriting it. A 404 without navigation is a dead end.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <Section>
          <Container>
            <p className="eyebrow text-accent-press">404</p>
            <h1 className="mt-4 text-[40px] leading-[1] font-bold tracking-[-0.035em] text-balance md:text-[56px]">
              That page has been stood down.
            </h1>
            <p className="measure mt-5 text-[17px] leading-[1.55] text-ink-70">
              The link is broken or the role has closed. The hire desk is still answering ,{" "}
              {site.phone}, from 5:30am, or start from one of the paths below.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/request-labour" size="lg" arrow>
                Request labour
              </Button>
              <Button href="/jobs" size="lg" variant="secondary">
                Find work
              </Button>
              <Button href={telHref(site.phone)} size="lg" variant="outline">
                Call {site.phone}
              </Button>
            </div>

            <div className="mt-16">
              <SectionHeading title="Greater Sydney regions" />
              <div className="mt-8">
                <RegionTiles regions={regions} />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
