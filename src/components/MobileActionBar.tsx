import { Arrow } from "@/components/ui/Arrow";
import { site, telHref } from "@/lib/site";

/**
 * Fixed bottom bar, mobile only. The conversion path rule: a CTA reachable
 * within one screen at all times. Click-to-call sits beside the form action
 * because at 6am the phone wins.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-surface-1 shadow-[0_-1px_0_rgb(17_17_17/0.06)] lg:hidden">
      <div className="flex gap-2 px-3 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <a
          href="/request-labour"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[14px] font-medium text-white"
        >
          Request labour
          <Arrow direction="up-right" className="text-[13px]" />
        </a>
        <a
          href={telHref(site.phone)}
          /* Sized to its label rather than half the bar, so the orange
             action leads and the pair reads as one control, not two slabs. */
          className="inline-flex h-11 items-center justify-center rounded-full border border-line-strong px-5 text-[14px] font-medium text-ink"
        >
          Call now
        </a>
      </div>
    </div>
  );
}
