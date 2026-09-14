"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal: a short fade and lift, once, as content arrives.
 *
 * Deliberately one-shot, and deliberately not on a `view()` scroll timeline.
 * A view timeline derives its progress from the element's own geometry, so an
 * element that changes size after revealing recomputes its progress and jumps:
 * opening a row of the trades accordion dropped it to 0.47 opacity and back
 * while it was turning black. Fired once and forgotten, that cannot happen,
 * whatever the content does afterwards.
 *
 * Three rules keep it out of the way.
 *
 * Anything already on screen when the component mounts is left alone. That is
 * the important one: on a fresh load or a route change, animating what the
 * reader is already looking at collides with the page transition and reads as
 * chaos. Only content that arrives later animates.
 *
 * The hidden state is applied only after mount, so server rendered HTML is
 * never hidden: a crawler, or a reader with JavaScript off, gets the finished
 * page. And it is skipped entirely under prefers-reduced-motion.
 */

/**
 * One observer for the whole page rather than one per element. A homepage
 * carries 43 of these, and 43 observers is 43 sets of bookkeeping for a
 * callback that fires once and is then done with that element forever.
 */
let observer: IntersectionObserver | null = null;

function watcher() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = "in";
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );
  return observer;
}

export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  as: Tag = "div",
  className = "",
  id,
}: {
  children: ReactNode;
  /** Milliseconds. Use with an index for a stagger. */
  delay?: number;
  variant?: "rise" | "fade";
  as?: "div" | "section" | "li" | "article";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Leave the element exactly as rendered: visible, no transition.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already in view? Then it is not arriving, and it should not animate.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    // Armed only now, so the server rendered markup is never the hidden state.
    node.dataset.reveal = "out";

    const io = watcher();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      data-variant={variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
