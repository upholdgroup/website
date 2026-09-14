"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveJob } from "@/app/admin/actions";
import { idleAdminState } from "@/lib/admin-state";
import { ChipInput, Field, inputClass } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import type { Job } from "@/lib/content/jobs";
import type { Region } from "@/lib/content/regions";
import type { Trade } from "@/lib/content/trades";

const ENGAGEMENTS: Job["employmentType"][] = ["Casual", "Contract", "Permanent"];

/** Default a new role to closing in 90 days rather than leaving it open-ended. */
const inDays = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

export function JobForm({
  job,
  trades,
  regions,
}: {
  job?: Job;
  trades: Trade[];
  regions: Region[];
}) {
  const [state, formAction, pending] = useActionState(saveJob, idleAdminState);
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-7">
      {job && <input type="hidden" name="id" value={job.id} />}

      <Field label="Role title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={job?.title}
          placeholder="Construction labourers"
          className={inputClass(errors.title)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="How many" htmlFor="positions" error={errors.positions}>
          <input
            id="positions"
            name="positions"
            type="number"
            min={1}
            max={200}
            defaultValue={job?.positions ?? 1}
            className={inputClass(errors.positions)}
          />
        </Field>

        <Field label="Suburb" htmlFor="suburb" error={errors.suburb}>
          <input
            id="suburb"
            name="suburb"
            type="text"
            required
            defaultValue={job?.suburb}
            placeholder="Parramatta"
            className={inputClass(errors.suburb)}
          />
        </Field>
      </div>

      {/* Pickers, not free text, a mistyped slug is a broken internal link. */}
      <Field label="Sydney region" htmlFor="region" error={errors.region}>
        <select
          id="region"
          name="region"
          defaultValue={job?.region ?? ""}
          className={`${inputClass(errors.region)} appearance-none`}
        >
          <option value="" disabled>
            Pick a region
          </option>
          {regions.map((region) => (
            <option key={region.slug} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Trade" htmlFor={`trade-${trades[0].slug}`} error={errors.trade}>
        <div className="flex flex-wrap gap-2">
          {trades.map((trade) => (
            <ChipInput
              key={trade.slug}
              name="trade"
              type="radio"
              value={trade.slug}
              label={trade.short}
              defaultChecked={job?.trade === trade.slug}
            />
          ))}
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Engagement" htmlFor={`employmentType-${ENGAGEMENTS[0]}`} error={errors.employmentType}>
          <div className="flex flex-wrap gap-2">
            {ENGAGEMENTS.map((type) => (
              <ChipInput
                key={type}
                name="employmentType"
                type="radio"
                value={type}
                label={type}
                defaultChecked={(job?.employmentType ?? "Casual") === type}
              />
            ))}
          </div>
        </Field>

        <Field label="Duration" htmlFor="duration" error={errors.duration}>
          <input
            id="duration"
            name="duration"
            type="text"
            required
            defaultValue={job?.duration}
            placeholder="ongoing"
            className={inputClass(errors.duration)}
          />
        </Field>
      </div>

      <Field
        label="Shift or ticket note"
        htmlFor="note"
        error={errors.note}
        hint="One line, shown on the card. e.g. “6am start, Mon–Fri”."
      >
        <input
          id="note"
          name="note"
          type="text"
          required
          defaultValue={job?.note}
          className={inputClass(errors.note)}
        />
      </Field>

      <Field
        label="Summary"
        htmlFor="summary"
        error={errors.summary}
        hint="Two or three sentences a worker can act on. No pay, that is agreed at interview."
      >
        <textarea
          id="summary"
          name="summary"
          rows={5}
          required
          defaultValue={job?.summary}
          className="w-full rounded-input border border-line-strong bg-surface-1 p-4 text-[16px] transition-colors duration-150 focus:border-ink"
        />
      </Field>

      <Field
        label="What you need"
        htmlFor="requirements"
        error={errors.requirements}
        hint="One per line."
      >
        <textarea
          id="requirements"
          name="requirements"
          rows={5}
          required
          defaultValue={job?.requirements.join("\n")}
          className="w-full rounded-input border border-line-strong bg-surface-1 p-4 text-[16px] transition-colors duration-150 focus:border-ink"
        />
      </Field>

      <Field
        label="Closes"
        htmlFor="validThrough"
        error={errors.validThrough}
        hint="After this date the role leaves the board, the sitemap and Google Jobs by itself."
      >
        <input
          id="validThrough"
          name="validThrough"
          type="date"
          required
          defaultValue={job?.validThrough ?? inDays(90)}
          className={`${inputClass(errors.validThrough)} max-w-[220px]`}
        />
      </Field>

      {errors.form && (
        <p role="alert" className="text-[15px] leading-[1.6] text-accent-press">
          {errors.form}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-7">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : job ? "Save changes" : "Post the role"}
        </Button>
        <Link
          href="/admin/jobs"
          className="inline-flex h-13 items-center rounded-full px-5 text-[16px] text-ink-70 transition-colors duration-150 hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
