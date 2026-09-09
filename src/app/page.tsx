import { ConstructionScene } from "@/components/ConstructionScene";
import { Logo } from "@/components/Logo";
import { ProgressBar } from "@/components/ProgressBar";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="animate-rise px-6 pt-8 sm:px-12 sm:pt-12">
        <Logo />
      </header>

      {/* Scene and copy are centred together as one block, so the whitespace
          above and below stays balanced from 390px up to ultrawide. */}
      <div className="flex flex-1 flex-col justify-center gap-12 py-12 sm:gap-16 lg:gap-20">
        <ConstructionScene />

        <section className="animate-rise px-6 [animation-delay:220ms] sm:px-12">
          <div className="mx-auto w-full max-w-xl text-center">
            <h1 className="font-serif text-[26px] leading-[1.15] tracking-[-0.01em] text-balance sm:text-[34px] lg:text-[40px]">
              {site.headline}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted text-balance">
              {site.subline}
            </p>

            <div className="mx-auto mt-8 max-w-sm sm:mt-9">
              <ProgressBar />
            </div>

            <p className="mt-8 text-[13px] text-muted sm:mt-9">
              In the meantime,{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-foreground underline decoration-brand decoration-2 underline-offset-4 transition-colors hover:text-brand"
              >
                {site.email}
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
