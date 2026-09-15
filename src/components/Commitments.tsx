"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import type { Commitment } from "@/lib/content/commitments";

/**
 * Manual carousel, next card peeking, in the shape of the reference's stories:
 * heading on the left, the two arrows top right, the next one filled orange.
 *
 * No autoplay: a card that moves on its own is a card nobody finishes reading.
 * `overscroll-behavior-x: contain` stops a swipe at the end of the track leaking
 * into the browser's back gesture, and snapping is proximity so the track
 * settles near a card instead of dragging it back.
 *
 * This was a testimonial carousel. The quotes in it were invented, so the
 * quote marks, avatars and datelines are gone. Nothing here reads as a voice.
 */
export function Commitments({ items, title }: { items: Commitment[]; title: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const update = () => {
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <Reveal>
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-[32px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[40px]">
          {title}
        </h2>
        <div className="flex shrink-0 gap-2">
          <CarouselButton label="Previous" onClick={() => nudge(-1)} direction="left" disabled={atStart} />
          <CarouselButton label="Next" onClick={() => nudge(1)} direction="right" disabled={atEnd} primary />
        </div>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label="What we commit to on every booking"
        className="-mx-5 mt-10 flex snap-x snap-proximity items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="card-surface flex w-[300px] shrink-0 snap-start flex-col rounded-card bg-surface-2 p-7 sm:w-[440px] md:p-8"
          >
            <h3 className="text-[20px] leading-[1.25] font-semibold tracking-[-0.02em] text-ink md:text-[22px]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-ink-70 md:text-[16px]">{item.detail}</p>

            <div className="mt-8 md:mt-auto md:pt-10">
              <Link
                href={item.href}
                className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-ink transition-colors duration-150 hover:text-accent"
              >
                {item.linkLabel}
                <Arrow direction="right" className="arrow-nudge text-accent" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function CarouselButton({
  label,
  onClick,
  direction,
  disabled,
  primary = false,
}: {
  label: string;
  onClick: () => void;
  direction: "left" | "right";
  disabled: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 disabled:pointer-events-none disabled:opacity-30 ${
        primary
          ? "bg-accent text-white hover:bg-accent-press"
          : "border border-line-strong text-ink hover:border-ink hover:bg-surface-2"
      }`}
    >
      <span className="sr-only">{label}</span>
      <Arrow direction={direction} className="text-[15px]" />
    </button>
  );
}
