"use client";

import type { ReactNode } from "react";

/** Mono uppercase label, 8px radius, #D8D8D3 border. Errors take the accent. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow block text-ink-45">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-2 text-[13px] leading-[1.5] text-accent-press">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-[13px] leading-[1.5] text-ink-45">{hint}</p>
      ) : null}
    </div>
  );
}

export function inputClass(error?: string) {
  return `h-12 w-full rounded-input border bg-surface-1 px-4 text-[16px] text-ink placeholder:text-ink-45 transition-colors duration-150 focus:border-ink ${
    error ? "border-accent" : "border-line-strong"
  }`;
}

/**
 * Chips for trade selection, engagement type and start urgency.
 *
 * Controlled when given `checked`/`onChange` — the public forms need that,
 * because a step change would otherwise clear them (see RequestLabourForm).
 * The admin form is single-step and reloads on save, so it uses the
 * uncontrolled `defaultChecked` form instead.
 */
export function ChipInput({
  name,
  value,
  label,
  type = "checkbox",
  checked,
  onChange,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  type?: "checkbox" | "radio";
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}) {
  const id = `${name}-${value}`;
  const controlled =
    checked === undefined
      ? { defaultChecked }
      : { checked, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked) };

  return (
    <div>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        {...controlled}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        /*
          `peer-checked:hover:*` is not decoration, it is the fix for a chip
          that erased its own label.

          A selected chip is white on ink. `hover:text-ink` and
          `peer-checked:text-white` carry the same specificity, so which one
          wins is decided purely by the order Tailwind emits them, and hover
          is emitted last. Pointing at a chip you had already selected turned
          its text ink on an ink background: separation 0 of 255, the label
          simply gone, on both of the forms this site exists to collect.

          Stacking the two variants raises the specificity above the bare
          hover, so the checked colours hold whatever the emit order is.
        */
        className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-[14px] text-ink-70 transition-colors duration-150 select-none hover:border-ink hover:text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:font-medium peer-checked:text-white peer-checked:hover:border-ink peer-checked:hover:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        {label}
      </label>
    </div>
  );
}

export function StepHeading({
  step,
  total,
  title,
  children,
}: {
  step: number;
  total: number;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow text-accent-press">
        Step {step} of {total}
      </p>
      <h2 className="mt-3 text-[26px] leading-[1.15] font-bold tracking-[-0.03em] md:text-[32px]">
        {title}
      </h2>
      {children && <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">{children}</p>}
    </div>
  );
}

/** Honeypot — visually and programmatically hidden, filled only by bots. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company_website">Company website</label>
      <input id="company_website" type="text" name="company_website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function NoScriptFallback({ phone, email }: { phone: string; email: string }) {
  return (
    <noscript>
      <div className="rounded-media border border-line bg-surface-2 p-5 text-[15px] leading-[1.6] text-ink-70">
        This form needs JavaScript to step through. Call{" "}
        <strong className="text-ink">{phone}</strong>, the hire desk answers from 5:30am, or email{" "}
        <a href={`mailto:${email}`} className="text-ink underline underline-offset-4">
          {email}
        </a>{" "}
        with the roles, tickets, suburb and start time.
      </div>
    </noscript>
  );
}
