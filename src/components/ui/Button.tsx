import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "quiet" | "on-ink";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-colors duration-150 ease-out select-none " +
  "disabled:pointer-events-none disabled:opacity-40";

/* 44px is the floor everywhere — phones, sunlight, gloves. */
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-[16px]",
};

/*
 * Each variant carries a press state, and on a touch device it is the only
 * feedback there is: globals.css suppresses the iOS tap highlight, because on
 * a filled button that highlight read as the whole thing going dark and
 * swallowing its own text. Suppressing it without replacing it left a tap
 * confirming nothing at all, which is worse than the highlight was.
 *
 * Colour only, no scale. A button that shrinks under the thumb is the kind of
 * motion this site has repeatedly been told it does not want.
 */
const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-press active:bg-accent-press",
  secondary: "bg-ink text-white hover:bg-ink/85 active:bg-ink/70",
  outline: "border border-line-strong text-ink hover:border-ink hover:bg-surface-2 active:bg-line",
  quiet: "text-ink hover:bg-surface-2 active:bg-line",
  /* Outline sitting on an ink surface — the phone button beside a CTA. */
  "on-ink":
    "border border-white/25 text-white hover:border-white hover:bg-white/10 active:bg-white/20",
};

type Props = {
  variant?: Variant;
  size?: Size;
  /** Adds ↗ — reserve it for conversion actions. */
  arrow?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className="text-[0.8em] leading-none">
          ↗
        </span>
      )}
    </>
  );

  if (href) {
    // tel:, mailto: and #anchors are plain anchors; routes go through Link so
    // they prefetch.
    const external = /^(tel:|mailto:|https?:|#)/.test(href);
    return external ? (
      <a href={href} className={classes}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

/** The 34–44px orange circle that carries an arrow affordance on cards and rows. */
export function ArrowCircle({
  size = 34,
  tone = "accent",
}: {
  size?: number;
  tone?: "accent" | "ink" | "outline";
}) {
  const tones = {
    accent: "bg-accent text-white",
    ink: "bg-ink text-white",
    outline: "border border-line-strong text-ink",
  } as const;

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`arrow-nudge inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${tones[tone]}`}
    >
      →
    </span>
  );
}
