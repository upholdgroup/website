"use client";

import { useActionState, useState } from "react";
import { registerWorker } from "@/app/actions";
import { initialFormState } from "@/lib/form-state";
import { Button } from "@/components/ui/Button";
import { CollectionNotice } from "./CollectionNotice";
import { ChipInput, Field, Honeypot, NoScriptFallback, StepHeading, inputClass } from "./fields";
import type { Trade } from "@/lib/content/trades";
import type { Region } from "@/lib/content/regions";
import { collectionNotice } from "@/lib/content/privacy";
import { site, telHref } from "@/lib/site";

const TICKETS = [
  "White Card",
  "Working at heights",
  "Forklift (LF)",
  "EWP (WP)",
  "Dogging (DG)",
  "Rigging (RB/RI/RA)",
  "Scaffolding (SB/SI/SA)",
  "Traffic control (TCT)",
  "Confined space",
  "Asbestos awareness",
];

/**
 * 2 steps, no CV, no password.
 *
 * There is deliberately no ticket photo upload. One existed, but nothing was
 * stored: the image travelled to the server and was discarded, which meant a
 * worker photographed their licence, believed they had supplied it, and had
 * not. Tickets are sighted at the interview instead, and the chips below are
 * what tell the desk which ones to expect.
 */
type Values = { name: string; phone: string; trade: string; suburb: string; preferredRegion: string };

const EMPTY: Values = { name: "", phone: "", trade: "", suburb: "", preferredRegion: "" };

/** Which step owns which field, so an error can pull the visitor back to it. */
const STEP_FIELDS: Record<number, string[]> = {
  1: ["name", "phone", "trade"],
  2: ["suburb"],
};

function firstStepWithError(errors: Record<string, string>): number {
  return STEP_FIELDS[1].some((field) => field in errors) ? 1 : 2;
}

export function RegisterForm({
  trades,
  regions,
  role,
}: {
  trades: Trade[];
  regions: Region[];
  role?: string;
}) {
  const [state, formAction, pending] = useActionState(registerWorker, initialFormState);
  const [step, setStep] = useState(1);

  // Controlled for the same two reasons as the host form: a step re-render
  // clears uncontrolled inputs, and the form resets after the action runs.
  // The file input is the exception — it cannot be controlled, and losing a
  // photo selection on a validation error is the expected browser behaviour.
  const [values, setValues] = useState<Values>(EMPTY);
  const [tickets, setTickets] = useState<string[]>([]);

  // A rejected submission returns to the step that owns the error — see the
  // matching note in RequestLabourForm.
  const [handled, setHandled] = useState(state);
  if (handled !== state) {
    setHandled(state);
    if (state.status === "error") setStep(firstStepWithError(state.errors));
  }

  const set =
    <K extends keyof Values>(key: K) =>
    (value: string) =>
      setValues((current) => ({ ...current, [key]: value }));

  const errors = state.status === "error" ? state.errors : {};

  if (state.status === "success") {
    return <WorkerConfirmation reference={state.reference} consultant={state.consultant} />;
  }

  return (
    <form action={formAction} className="relative">
      <Honeypot />
      {role && <input type="hidden" name="role" value={role} />}

      <div className="mb-8">
        <NoScriptFallback phone={site.phone} email={site.workEmail} />
      </div>

      <ol className="mb-10 flex gap-2" aria-label="Progress">
        {[1, 2].map((n) => (
          <li
            key={n}
            aria-current={n === step ? "step" : undefined}
            className={`h-1 flex-1 rounded-full ${n <= step ? "bg-accent" : "bg-line"}`}
          />
        ))}
      </ol>

      <fieldset hidden={step !== 1} className="flex flex-col gap-8">
        <StepHeading step={1} total={2} title="Who are you and what do you do?">
          No CV, no password, no portal. We text you Sydney roles that match your tickets.
        </StepHeading>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" error={errors.name}>
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

          <Field label="Mobile" htmlFor="phone" error={errors.phone} hint="This is where we text you roles.">
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
        </div>

        <Field label="Trade you work in" htmlFor={`trade-${trades[0].slug}`} error={errors.trade}>
          <div className="flex flex-wrap gap-2">
            {trades.map((trade) => (
              <ChipInput
                key={trade.slug}
                name="trade"
                type="radio"
                value={trade.slug}
                label={trade.short}
                checked={values.trade === trade.slug}
                onChange={() => set("trade")(trade.slug)}
              />
            ))}
          </div>
        </Field>
      </fieldset>

      <fieldset hidden={step !== 2} className="flex flex-col gap-8">
        <StepHeading step={2} total={2} title="Where you live and what you hold">
          We roster people close to the site, so your suburb decides which roles we text you.
        </StepHeading>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your suburb" htmlFor="suburb" error={errors.suburb}>
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

          <Field label="Regions you can get to" htmlFor="regions-note" hint="Optional, tell us at the interview if it changes.">
            <select
              id="regions-note"
              name="preferredRegion"
              value={values.preferredRegion}
              onChange={(e) => set("preferredRegion")(e.target.value)}
              className={`${inputClass()} appearance-none`}
            >
              <option value="">Anywhere in Greater Sydney</option>
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Tickets you hold" htmlFor={`tickets-${TICKETS[0]}`}>
          <div className="flex flex-wrap gap-2">
            {TICKETS.map((ticket) => (
              <ChipInput
                key={ticket}
                name="tickets"
                value={ticket}
                label={ticket}
                checked={tickets.includes(ticket)}
                onChange={(on) =>
                  setTickets((current) =>
                    on ? [...current, ticket] : current.filter((t) => t !== ticket),
                  )
                }
              />
            ))}
          </div>
        </Field>

      </fieldset>

      {step === 2 && (
        <div className="mt-2 flex flex-col gap-4">
          <CollectionNotice>{collectionNotice.worker}</CollectionNotice>

          <label className="flex max-w-[62ch] cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              required
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)]"
            />
            <span className="text-[14px] leading-[1.6] text-ink-70">
              I agree to Uphold Group collecting and verifying my tickets and right to work, and
              to being contacted about Sydney roles by text and phone. I can stop the texts any
              time by replying STOP.
            </span>
          </label>
        </div>
      )}

      {state.status === "error" && (
        <p role="alert" className="mt-6 text-[15px] leading-[1.6] text-accent-press">
          {errors.form ?? "Check the highlighted field and send it again, or just call us."}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-8">
        {step > 1 && (
          <Button type="button" variant="quiet" onClick={() => setStep(1)}>
            Back
          </Button>
        )}

        {/* Distinct keys matter: without them React reuses one DOM node for
            both buttons and flips its `type` from "button" to "submit" while
            the click that advanced the step is still propagating, so reaching
            the last step submitted the form. */}
        {step < 2 ? (
          <Button key="continue" type="button" size="lg" onClick={() => setStep(2)}>
            Continue
          </Button>
        ) : (
          <Button key="submit" type="submit" size="lg" arrow disabled={pending}>
            {pending ? "Sending…" : "Register"}
          </Button>
        )}

        <Button href={telHref(site.phone)} size="lg" variant="outline">
          Call {site.phone}
        </Button>
      </div>
    </form>
  );
}

function WorkerConfirmation({ reference, consultant }: { reference: string; consultant: string }) {
  return (
    <div className="rounded-card bg-surface-2 p-8 md:p-10">
      <p className="eyebrow text-accent-press">Registered · {reference}</p>
      <h2 className="mt-4 text-[30px] leading-[1.05] font-bold tracking-[-0.03em] text-balance md:text-[40px]">
        {consultant} will text you within one business day.
      </h2>
      <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-ink-70 md:text-[17px]">
        Next is a short interview, in person, on site or by video, where we check your right
        to work, verify your tickets against the register, call two supervisors and agree your pay.
        After that we text you Sydney roles that match your tickets and your suburb. You reply yes
        or no; there is no app to check.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/jobs" size="lg" arrow>
          Browse live roles
        </Button>
        <Button href={telHref(site.phone)} size="lg" variant="outline">
          Call {site.phone}
        </Button>
      </div>
    </div>
  );
}
