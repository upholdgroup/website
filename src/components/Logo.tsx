/**
 * Wordmark lockup: an outlined mark holding an upward chevron ("uphold"),
 * paired with a two-line, wide-tracked wordmark.
 */
export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.1"
          y="1.1"
          width="35.8"
          height="35.8"
          rx="7"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M9.5 23.5 19 13l9.5 10.5"
          stroke="var(--brand)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11.5 29h15" stroke="var(--brand)" strokeWidth="2.8" strokeLinecap="round" />
      </svg>

      <div className="leading-none">
        <div className="text-[19px] font-semibold tracking-[0.16em] sm:text-[22px]">UPHOLD</div>
        <div className="mt-[3px] text-[11px] font-medium tracking-[0.42em] text-brand sm:text-[12px]">
          GROUP
        </div>
      </div>
    </div>
  );
}
