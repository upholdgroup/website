"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { Faq } from "@/lib/content/trades";

/**
 * FAQs as rows, the same shape as What we supply, instead of four blocks of
 * paragraphs side by side.
 *
 * The answers stay in the document when a row is shut, so the FAQPage schema
 * still mirrors visible content and a search crawler reads every answer. The
 * panel animates open by grid rows, and its contents are hidden while the row
 * is shut: see `.panel` in globals.css.
 *
 * The open row is ink and switches colour in one frame, never by fading. A
 * fade drags the question and the answer through their own background colour
 * on the way, which is the flicker the trades accordion had.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(0);

  return (
    <Reveal className="flex flex-col gap-2">
      {faqs.map((faq, i) => {
        const active = i === open;
        const panelId = `faq-panel-${i}`;

        return (
          <div
            key={faq.q}
            className={`overflow-hidden rounded-media ${
              active ? "bg-ink text-white" : "bg-surface-2 text-ink hover:bg-[#eeeeeb]"
            }`}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(active ? -1 : i)}
                aria-expanded={active}
                aria-controls={panelId}
                className="flex min-h-11 w-full items-center justify-between gap-4 p-5 text-left text-[18px] leading-[1.3] font-medium tracking-[-0.02em] md:p-6 md:text-[20px]"
              >
                {faq.q}
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    active ? "bg-accent text-white" : "border border-line-strong text-ink"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`transition-transform duration-200 ${active ? "rotate-45" : ""}`}
                  >
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>

            <div id={panelId} className="panel" data-open={active} aria-hidden={!active}>
              <div>
                <p className="max-w-[62ch] px-5 pb-6 text-[15px] leading-[1.6] text-on-ink-60 md:px-6 md:text-[16px]">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
