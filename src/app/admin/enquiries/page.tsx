import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { listArchivedEnquiries, listEnquiries } from "@/lib/db/enquiries";
import { requireUser } from "@/lib/permissions";

export const metadata = { title: "Enquiries", robots: { index: false, follow: false } };

const KINDS = [
  { value: "", label: "Everything" },
  { value: "host-request", label: "Labour requests" },
  { value: "worker-registration", label: "Registrations" },
];

const STATUSES = [
  { value: "", label: "Any status" },
  { value: "new", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "closed", label: "Closed" },
];

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  await requireUser();

  const params = await searchParams;
  const kind = String(params.kind ?? "");
  const status = String(params.status ?? "");
  const archived = String(params.archived ?? "");
  const restored = String(params.restored ?? "");
  // The archive is a view, not a separate page: ?view=archived.
  const view = String(params.view ?? "");

  const all = view === "archived" ? await listArchivedEnquiries() : await listEnquiries();
  const shown = all.filter(
    (enquiry) => (!kind || enquiry.kind === kind) && (!status || enquiry.status === status),
  );

  const href = (next: { kind?: string; status?: string }) => {
    const query = new URLSearchParams();
    const k = next.kind ?? kind;
    const s = next.status ?? status;
    if (k) query.set("kind", k);
    if (s) query.set("status", s);
    if (view) query.set("view", view);
    return `/admin/enquiries${query.size ? `?${query}` : ""}`;
  };

  return (
    <Container>
      <div className="py-10 md:py-14">
        <h1 className="text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[38px]">
          Enquiries
        </h1>
        <p className="mt-2 text-[15px] text-ink-70">
          {shown.length} of {all.length}
        </p>

        {archived && (
          <p className="mt-6 rounded-input bg-surface-1 p-4 text-[15px]">
            <strong>{archived}</strong> has been archived. Nothing was destroyed:{" "}
            <Link href="/admin/enquiries?view=archived" className="underline underline-offset-4">
              open the archive
            </Link>{" "}
            to put it back.
          </p>
        )}

        {restored && (
          <p className="mt-6 rounded-input bg-surface-1 p-4 text-[15px]">
            <strong>{restored}</strong> is back in the inbox.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4">
          <Filters legend="Type" options={KINDS} current={kind} build={(v) => href({ kind: v })} />
          <Filters legend="Status" options={STATUSES} current={status} build={(v) => href({ status: v })} />
          <Filters
            legend="View"
            options={[
              { value: "", label: "Inbox" },
              { value: "archived", label: "Archive" },
            ]}
            current={view}
            build={(v) => {
              const query = new URLSearchParams();
              if (kind) query.set("kind", kind);
              if (status) query.set("status", status);
              if (v) query.set("view", v);
              return `/admin/enquiries${query.size ? `?${query}` : ""}`;
            }}
          />
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 rounded-card bg-surface-1 p-6 text-[15px] text-ink-70">
            Nothing here. When a form is submitted it lands in this list straight away.
          </p>
        ) : (
          <ul className="mt-8 flex flex-col gap-3">
            {shown.map((enquiry) => (
              <li key={enquiry.reference}>
                <Link
                  href={`/admin/enquiries/${enquiry.reference}`}
                  className="lift grid gap-x-5 gap-y-2 rounded-media bg-surface-1 p-5 transition-colors duration-150 hover:bg-white md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.6fr)_minmax(0,1fr)_auto] md:items-center"
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold">
                      {String(enquiry.fields.name ?? "Someone")}
                    </span>
                    <span className="block text-[13px] text-ink-45">{enquiry.reference}</span>
                  </span>

                  <span className="min-w-0 text-[14px] text-ink-70">
                    {enquiry.kind === "host-request" ? "Labour request" : "Worker registration"}
                    {enquiry.fields.suburb && (
                      <span className="text-ink-45"> · {String(enquiry.fields.suburb)}</span>
                    )}
                  </span>

                  <span className="text-[14px] text-ink-70">
                    {new Date(enquiry.receivedAt).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      timeZone: "Australia/Sydney",
                    })}
                    {enquiry.assignedTo && (
                      <span className="block text-[13px] text-ink-45">{enquiry.assignedTo}</span>
                    )}
                  </span>

                  <StatusChip status={enquiry.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}

function Filters({
  legend,
  options,
  current,
  build,
}: {
  legend: string;
  options: { value: string; label: string }[];
  current: string;
  build: (value: string) => string;
}) {
  return (
    <div>
      <p className="eyebrow text-ink-45">{legend}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === current;
          return (
            <Link
              key={option.value || "all"}
              href={build(option.value)}
              aria-current={active ? "true" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[14px] transition-colors duration-150 ${
                active
                  ? "border-ink bg-ink font-medium text-white"
                  : "border-line text-ink-70 hover:border-ink hover:text-ink"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function StatusChip({ status }: { status: "new" | "assigned" | "closed" }) {
  const tones = {
    new: "bg-accent-tint text-accent-press",
    assigned: "bg-surface-2 text-ink-70",
    closed: "bg-surface-2 text-ink-45",
  } as const;

  return <span className={`eyebrow justify-self-start rounded-full px-3 py-1.5 ${tones[status]}`}>{status}</span>;
}
