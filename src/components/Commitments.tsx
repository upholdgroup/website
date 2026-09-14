"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import type { Commitment } from "@/lib/content/commitments";

/**
 * Manual carousel, next card peeking. No autoplay: a card that moves on its
 * own is a card nobody finishes reading.
 *
 * Three things keep the sideways scroll from feeling unstable.
 *
 * `overscroll-behavior-x: contain` stops a swipe that reaches the end of the
 * track from leaking into the browser's back gesture, which is the worst of
 * them: you flick through the cards and land on the previous page.
 *
 * Snapping is proximity rather than mandatory, so the track settles near a
 * card instead of fighting the scroll and dragging it back.
 *
 * And the cards themselves do not scroll-reveal. They used to, which meant
 * everything to the right was invisible until it arrived: you scrolled into
 * blank space and the content popped in behind you. The block reveals once, as
 * a whole, and the cards are simply there.
 *
 * This was a testimonial carousel. The mechanics were sound and are unchanged;
 * what it carried was not, so the quote marks, the initials avatar and the
 * dateline are gone. Nothing here should read as a voice, because none of it
 * is one.
 */
export function Commitments({ items }: { items: Commitment[] }) {
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
      <ul
        ref={track}
        tabIndex={0}
        aria-label="What we commit to on every booking"
        className="-mx-5 flex snap-x snap-proximity items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="flex w-[300px] shrink-0 snap-start flex-col rounded-card bg-surface-2 p-6 sm:w-[380px] md:p-7"
          >
            <h3 className="text-[19px] leading-[1.25] font-semibold tracking-[-0.02em] text-ink md:text-[20px]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-ink-70 md:text-[16px]">
              {item.detail}
            </p>

            {/* Pushed to the bottom so the links line up across cards whatever
                length the detail runs to. Every claim points at the page that
                sets it out, which is what keeps it checkable rather than
                asserted. */}
            <div className="mt-6 border-t border-line pt-5 md:mt-auto">
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

      <div className="mt-6 flex gap-2">
        <CarouselButton
          label="Previous commitment"
          onClick={() => nudge(-1)}
          glyph="left"
          disabled={atStart}
        />
        <CarouselButton
          label="Next commitment"
          onClick={() => nudge(1)}
          glyph="right"
          disabled={atEnd}
        />
      </div>
    </Reveal>
  );
}

function CarouselButton({
  label,
  onClick,
  glyph,
  disabled,
}: {
  label: string;
  onClick: () => void;
  glyph: "left" | "right";
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-150 hover:border-ink hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-30"
    >
      <span className="sr-only">{label}</span>
      <Arrow direction={glyph} className="text-[15px]" />
    </button>
  );
}
