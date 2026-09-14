import { Arrow } from "@/components/ui/Arrow";
import { site, telHref } from "@/lib/site";

/**
 * Fixed bottom bar, mobile only. The conversion path rule: a CTA reachable
 * within one screen at all times. Click-to-call sits beside the form action
 * because at 6am the phone wins.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-1 lg:hidden">
      <div className="flex gap-2 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <a
          href="/request-labour"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-medium text-white"
        >
          Request labour
          <Arrow direction="up-right" className="text-[13px]" />
        </a>
        <a
          href={telHref(site.phone)}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-line-strong text-[15px] font-medium text-ink"
        >
          Call now
        </a>
      </div>
    </div>
  );
}
