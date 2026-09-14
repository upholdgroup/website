"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowCircle } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Trade } from "@/lib/content/trades";

/**
 * One row open at a time. The orange circle is the internal link to that
 * trade page — the site's main SEO link path, so it is a real anchor rather
 * than a decorative affordance inside the toggle button.
 *
 * The reveal wraps the whole list, never the individual rows, and that is a
 * correctness constraint rather than a preference. A row that reveals owns an
 * opacity of its own, and this list moves under its own feet: opening a panel
 * resizes one row and shifts every row beneath it. Rows that had not revealed
 * yet were being pushed into view by a click rather than by a scroll, and
 * faded up in the middle of the interaction. Revealing the container once
 * means that after it has arrived, no row here is ever mid-animation again.
 */
export function TradeAccordion({ trades }: { trades: Trade[] }) {
  const [open, setOpen] = useState(0);

  return (
    <Reveal className="flex flex-col gap-2">
      {trades.map((trade, i) => {
        const active = i === open;
        const panelId = `trade-panel-${trade.slug}`;

        return (
          <div
            key={trade.slug}
            /* No colour transition here, deliberately. See "Swapping a
               surface between light and dark" in globals.css: interpolating
               this background drags the label and the panel copy through
               their own colour and both vanish on the way. The panel opening
               carries the motion instead. */
            className={`group overflow-hidden rounded-media ${
              active ? "bg-ink text-white" : "bg-surface-2 text-ink hover:bg-[#eeeeeb]"
            }`}
          >
            <div className="flex items-center gap-3 p-5 md:p-6">
              <h3 className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : i)}
                  aria-expanded={active}
                  aria-controls={panelId}
                  className="w-full min-h-11 text-left text-[20px] leading-[1.25] font-medium tracking-[-0.02em] md:text-[24px]"
                >
                  {trade.name}
                </button>
              </h3>

              <Link
                href={`/trades/${trade.slug}`}
                aria-label={`${trade.name}, see tickets, scope and FAQs`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                <ArrowCircle size={44} tone={active ? "accent" : "outline"} />
              </Link>
            </div>

            {/* Grid rows animate where height:auto cannot, so the panel
                opens smoothly without measuring anything. */}
            <div id={panelId} className="panel" data-open={active} aria-hidden={!active}>
              <div>
                <div className="px-5 pb-6 md:px-6">
                  <p className="max-w-[58ch] text-[15px] leading-[1.6] text-on-ink-60 md:text-[16px]">
                    {trade.blurb}
                  </p>
                  <Link
                    href={`/trades/${trade.slug}`}
                    tabIndex={active ? undefined : -1}
                    className="mt-4 inline-flex min-h-11 items-center text-[15px] font-medium text-white underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-150 hover:text-accent"
                  >
                    Tickets held, typical scope and FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
