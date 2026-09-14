"use client";

import { useMemo, useState } from "react";
import { JobList } from "@/components/JobList";
import type { Job } from "@/lib/content/jobs";

type Option = { slug: string; label: string };

/** Filterable board: trade and Sydney region, the two axes workers scan by. */
export function JobBoard({
  jobs,
  tradeOptions,
  regionOptions,
}: {
  jobs: Job[];
  tradeOptions: Option[];
  regionOptions: Option[];
}) {
  const [trade, setTrade] = useState("all");
  const [region, setRegion] = useState("all");

  const filtered = useMemo(
    () =>
      jobs.filter(
        (job) =>
          (trade === "all" || job.trade === trade) && (region === "all" || job.region === region),
      ),
    [jobs, trade, region],
  );

  const regionLabel = (slug: string) =>
    regionOptions.find((option) => option.slug === slug)?.label ?? "Greater Sydney";

  return (
    <div>
      <div className="flex flex-col gap-5">
        <ChipRow
          legend="Filter by trade"
          value={trade}
          onChange={setTrade}
          options={[{ slug: "all", label: "All trades" }, ...tradeOptions]}
        />
        <ChipRow
          legend="Filter by Sydney region"
          value={region}
          onChange={setRegion}
          options={[{ slug: "all", label: "All Sydney" }, ...regionOptions]}
        />
      </div>

      <p aria-live="polite" className="eyebrow mt-8 text-ink-45">
        {filtered.length} {filtered.length === 1 ? "role" : "roles"} live
      </p>

      <div className="mt-4">
        <JobList jobs={filtered} regionName={regionLabel} />
      </div>
    </div>
  );
}

function ChipRow({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string;
  value: string;
  onChange: (slug: string) => void;
  options: Option[];
}) {
  return (
    <fieldset>
      <legend className="eyebrow text-ink-45">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.slug === value;
          return (
            <button
              key={option.slug}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.slug)}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[14px] transition-colors duration-150 ${
                active
                  ? "border-ink bg-ink font-medium text-white"
                  : "border-line text-ink-70 hover:border-ink hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
