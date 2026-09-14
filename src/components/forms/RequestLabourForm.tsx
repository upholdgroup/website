"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { requestLabour } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { CollectionNotice } from "./CollectionNotice";
import { ChipInput, Field, Honeypot, NoScriptFallback, StepHeading, inputClass } from "./fields";
import type { Trade } from "@/lib/content/trades";
import { initialFormState } from "@/lib/form-state";
import { collectionNotice } from "@/lib/content/privacy";
import { site, telHref } from "@/lib/site";

const STARTS = [
  { value: "tomorrow-6am", label: "Tomorrow 6am" },
  { value: "this-week", label: "This week" },
  { value: "ongoing", label: "Ongoing / not urgent" },
];

/** Which step owns which field, so an error can pull the visitor back to it. */
const STEP_FIELDS: Record<number, string[]> = {
  1: ["trades", "workers"],
  2: ["suburb", "start"],
  3: ["name", "phone"],
};

function firstStepWithError(errors: Record<string, string>): number {
  for (const step of [1, 2, 3]) {
    if (STEP_FIELDS[step].some((field) => field in errors)) return step;
  }
  return 3;
}

type Values = {
  workers: string;
  suburb: string;
  start: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  notes: string;
};

const EMPTY: Values = {
  workers: "1",
  suburb: "",
  start: "",
  name: "",
  phone: "",
  company: "",
  email: "",
  notes: "",
};

/**
 * 3 steps × 2 fields. Under 60 seconds, one-handed, in sunlight.
 *
 * Every field is controlled. Uncontrolled inputs lose their value twice over
 * here: React clears them when the step re-render toggles a fieldset's
 * `hidden`, and `<form action={…}>` resets the form after the action runs — so
 * a server-side validation error would hand the visitor an empty form. Holding
 * the values in state fixes both.
 */
export function RequestLabourForm({ trades }: { trades: Trade[] }) {
  const [state, formAction, pending] = useActionState(requestLabour, initialFormState);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [picked, setPicked] = useState<string[]>([]);

  // An error on step 2 is invisible while the visitor sits on step 3, so a
  // rejected submission pulls them back to the first step that has one.
  // Adjusted during render rather than in an effect, so the correct step
  // paints on the first frame after the action resolves.
  const [handled, setHandled] = useState(state);
  if (handled !== state) {
    setHandled(state);
    if (state.status === "error") setStep(firstStepWithError(state.errors));
  }

  const set = <K extends keyof Values>(key: K) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const errors = state.status === "error" ? state.errors : {};

  if (state.status === "success") {
    return (
      <HostConfirmation
        reference={state.reference}
        consultant={state.consultant}
        callback={state.callback}
      />
    );
  }

  return (
    <form action={formAction} className="relative">
      <Honeypot />

      <div className="mb-8">
        <NoScriptFallback phone={site.phone} email={site.hireEmail} />
      </div>

      <ol className="mb-10 flex gap-2" aria-label="Progress">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            aria-current={n === step ? "step" : undefined}
            className={`h-1 flex-1 rounded-full ${n <= step ? "bg-accent" : "bg-line"}`}
          />
        ))}
      </ol>

      {/* Step 1, roles */}
      <fieldset hidden={step !== 1} className="flex flex-col gap-8">
        <StepHeading step={1} total={3} title="What roles do you need?">
          Pick the trades and tell us how many. If you need a mix, choose more than one.
        </StepHeading>

        <Field label="Trades required" htmlFor="trades-labourers" error={errors.trades}>
          <div className="flex flex-wrap gap-2">
            {trades.map((trade) => (
              <ChipInput
                key={trade.slug}
                name="trades"
                value={trade.slug}
                label={trade.short}
                checked={picked.includes(trade.slug)}
                onChange={(on) =>
                  setPicked((current) =>
                    on ? [...current, trade.slug] : current.filter((s) => s !== trade.slug),
                  )
                }
              />
            ))}
          </div>
        </Field>

        <Field label="How many workers" htmlFor="workers" error={errors.workers}>
          <input
            id="workers"
            name="workers"
            type="number"
            inputMode="numeric"
            min={1}
            max={200}
            value={values.workers}
            onChange={(e) => set("workers")(e.target.value)}
            className={`${inputClass(errors.workers)} max-w-[140px]`}
            aria-describedby={errors.workers ? "workers-error" : undefined}
          />
        </Field>
      </fieldset>

      {/* Step 2, site & start */}
      <fieldset hidden={step !== 2} className="flex flex-col gap-8">
        <StepHeading step={2} total={3} title="Where and when?">
          We crew across Greater Sydney. If the site is outside the regions we cover we will tell
          you straight away rather than take the booking.
        </StepHeading>

        <Field
          label="Site suburb"
          htmlFor="suburb"
          error={errors.suburb}
          hint="e.g. Parramatta, Alexandria, Liverpool"
        >
          <input
            id="suburb"
            name="suburb"
            type="text"
            autoComplete="address-level2"
            placeholder="Suburb"
            value={values.suburb}
            onChange={(e) => set("suburb")(e.target.value)}
            className={inputClass(errors.suburb)}
            aria-describedby={errors.suburb ? "suburb-error" : undefined}
          />
        </Field>

        <Field label="Start" htmlFor="start-tomorrow-6am" error={errors.start}>
          <div className="flex flex-wrap gap-2">
            {STARTS.map((option) => (
              <ChipInput
                key={option.value}
                name="start"
                type="radio"
                value={option.value}
                label={option.label}
                checked={values.start === option.value}
                onChange={() => set("start")(option.value)}
              />
            ))}
          </div>
        </Field>
      </fieldset>

      {/* Step 3, who to call */}
      <fieldset hidden={step !== 3} className="flex flex-col gap-8">
        <StepHeading step={3} total={3} title="Who do we call back?">
          One call to confirm the crew, then a written all-inclusive rate by email the same day.
        </StepHeading>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
              className={inputClass(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>

          <Field label="Mobile" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="04__ ___ ___"
              value={values.phone}
              onChange={(e) => set("phone")(e.target.value)}
              className={inputClass(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </Field>

          <Field label="Company (optional)" htmlFor="company">
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={values.company}
              onChange={(e) => set("company")(e.target.value)}
              className={inputClass()}
            />
          </Field>

          <Field label="Email for the quote (optional)" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              className={inputClass()}
            />
          </Field>
        </div>

        <Field
          label="Anything else (optional)"
          htmlFor="notes"
          hint="Site EBA, tickets beyond the standard, gate and parking, supervisor name."
        >
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={values.notes}
            onChange={(e) => set("notes")(e.target.value)}
            className="w-full rounded-input border border-line-strong bg-surface-1 p-4 text-[16px] transition-colors duration-150 focus:border-ink"
          />
        </Field>
      </fieldset>

      {state.status === "error" && (
        <p role="alert" className="mt-6 text-[15px] leading-[1.6] text-accent-press">
          {errors.form ?? "Check the highlighted field and send it again, or just call us."}
        </p>
      )}

      {step === 3 && (
        <div className="mt-8">
          <CollectionNotice>{collectionNotice.host}</CollectionNotice>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-8">
        {step > 1 && (
          <Button type="button" variant="quiet" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}

        {/* Distinct keys matter: without them React reuses one DOM node for
            both buttons and flips its `type` from "button" to "submit" while
            the click that advanced the step is still propagating, so reaching
            the last step submitted the form. */}
        {step < 3 ? (
          <Button key="continue" type="button" size="lg" onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button key="submit" type="submit" size="lg" arrow disabled={pending}>
            {pending ? "Sending…" : "Send request"}
          </Button>
        )}

        {/* Click-to-call is a first-class button, always beside the primary CTA. */}
        <Button href={telHref(site.phone)} size="lg" variant="outline">
          Call {site.phone}
        </Button>
      </div>
    </form>
  );
}

/** Names the consultant, the callback window and the written quote. Never a generic thanks. */
function HostConfirmation({
  reference,
  consultant,
  callback,
}: {
  reference: string;
  consultant: string;
  callback: string;
}) {
  return (
    <div className="rounded-card bg-ink p-8 text-white md:p-10">
      <p className="eyebrow text-accent">Request received · {reference}</p>
      <h2 className="mt-4 text-[30px] leading-[1.05] font-bold tracking-[-0.03em] text-balance md:text-[40px]">
        {consultant} is calling you {callback}.
      </h2>
      <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-on-ink-60 md:text-[17px]">
        You will get named workers with their ticket classes and expiry dates, and a single
        all-inclusive hourly rate per classification by email the same day. Nothing is confirmed
        until you say so.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={telHref(site.phone)} size="lg" variant="on-ink">
          Call {site.phone} now
        </Button>
        <Link
          href="/compliance"
          className="inline-flex h-13 items-center justify-center rounded-full px-5 text-[16px] font-medium text-white underline decoration-accent decoration-2 underline-offset-4"
        >
          See our insurance &amp; verification
        </Link>
      </div>
    </div>
  );
}
