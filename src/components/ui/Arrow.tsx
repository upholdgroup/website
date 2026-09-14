/**
 * Arrows drawn, not typed.
 *
 * These were the characters ← → ↗ until iOS Safari showed what that costs.
 * Archivo has no glyph for any of them, so the browser walks the font stack;
 * on iOS that ends at Apple Color Emoji, and U+2197 has an emoji form, so the
 * arrow inside every orange button rendered as a blue-and-white emoji tile.
 *
 * The other two have no emoji form and so did not announce themselves, but
 * they were falling back too: rendered by whatever font the system chose, in
 * a weight and a width nobody designed.
 *
 * Drawn as SVG, an arrow inherits `currentColor`, scales with `font-size`
 * because it is sized in `em`, and looks identical on every device. It also
 * cannot be read aloud, which is right: these are decoration beside a label
 * that already says where the link goes.
 */
const paths = {
  right: "M2.5 8h11M9 3.5 13.5 8 9 12.5",
  left: "M13.5 8h-11M7 3.5 2.5 8 7 12.5",
  /** The outbound/action arrow, on conversion buttons. */
  "up-right": "M4 12 12.5 3.5M5.5 3.5h7v7",
} as const;

export function Arrow({
  direction = "right",
  className = "",
}: {
  direction?: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      fill="none"
      /* 1em square, so it tracks the type it sits beside rather than needing a
         size at every call site. `shrink-0` stops flex containers squashing it
         when the label is long. */
      className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`}
    >
      <path
        d={paths[direction]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
