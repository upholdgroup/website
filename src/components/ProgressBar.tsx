import { site } from "@/lib/site";

/**
 * Deliberately asymptotic: it eases toward ~68% and holds there. The site
 * genuinely isn't finished, so a bar that races to 100% would be a lie.
 */
export function ProgressBar() {
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-brand-soft"
      role="progressbar"
      aria-label={`${site.name} website build progress`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={68}
    >
      <div className="animate-progress h-full w-[4%] rounded-full bg-brand" />
    </div>
  );
}
