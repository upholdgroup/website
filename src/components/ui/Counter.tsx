"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a stat up when it scrolls into view.
 *
 * It writes to the DOM node rather than to state. An earlier version kept the
 * displayed string in state and listed the parsed value in the effect's
 * dependencies; because parsing produces a fresh array on every render, the
 * effect re-ran on every render it had itself caused, which restarted the
 * animation forever. Nothing here re-renders, so that cannot happen again.
 *
 * The label is parsed rather than passed as a number so the content stays one
 * readable string: "1,240", "98.4%", "4hrs" and "0 LTI" all animate their
 * numeric part and keep whatever surrounds it.
 */
export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const decimals = digits.includes(".") ? 1 : 0;
    const grouped = digits.includes(",");

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const DURATION = 1100;
        const start = performance.now();

        const step = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          // Ease out cubic, so it decelerates into the real figure.
          const eased = 1 - (1 - progress) ** 3;
          const current = target * eased;
          const shown = grouped
            ? Math.round(current).toLocaleString("en-AU")
            : current.toFixed(decimals);

          node.textContent = `${prefix}${shown}${suffix}`;
          if (progress < 1) frame = requestAnimationFrame(step);
          else node.textContent = value;
        };

        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
