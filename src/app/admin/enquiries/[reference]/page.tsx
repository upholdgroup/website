import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusChip } from "../page";
import { assignEnquiry, putEnquiryBack, removeEnquiry, setEnquiryStatus } from "@/app/admin/enquiry-actions";
import { Container } from "@/components/ui/Section";
import { getEnquiry } from "@/lib/db/enquiries";
import { listUsers } from "@/lib/db/users";
import { isAdmin, requireUser } from "@/lib/permissions";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { site, telHref } from "@/lib/site";

export const metadata = { title: "Enquiry", robots: { index: false, follow: false } };

const LABELS: Record<string, string> = {
  trades: "Trades",
  workers: "How many",
  suburb: "Suburb",
  start: "Start",
  name: "Name",
  phone: "Mobile",
  company: "Company",
  email: "Email",
  notes: "Notes",
  trade: "Trade",
  tickets: "Tickets held",
  preferredRegion: "Preferred region",
  role: "Applying for role",
};

const STARTS: Record<string, string> = {
  "tomorrow-6am": "Tomorrow 6am",
  "this-week": "This week",
  ongoing: "Ongoing, not urgent",
};

/** Slugs are for URLs. A consultant reading this at 5:50am gets words. */
function readable(key: string, value: string): string {
  if (key === "trades" || key === "trade") return trades.find((t) => t.slug === value)?.name ?? value;
  if (key === "preferredRegion") return regions.find((r) => r.slug === value)?.name ?? value;
  if (key === "start") return STARTS[value] ?? value;
  return value;
}

export default async function EnquiryPage({ params, searchParams }: PageProps<"/admin/enquiries/[reference]">) {
  const user = await requireUser();
  const { reference } = await params;
  const { saved } = await searchParams;

  const enquiry = await getEnquiry(reference);
  if (!enquiry) notFound();

  const people = await listUsers();
  const phone = String(enquiry.fields.phone ?? "");
  const email = String(enquiry.fields.email ?? "");

  return (
    <Container>
      <div className="mx-auto max-w-[840px] py-10 md:py-14">
        <Link href="/admin/enquiries" className="text-[14px] text-ink-70 underline underline-offset-4 hover:text-ink">
          Back to the inbox
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[36px]">
            {String(enquiry.fields.name ?? "Someone")}
          </h1>
          <StatusChip status={enquiry.status} />
        </div>

        <p className="mt-2 text-[15px] text-ink-70">
          {enquiry.kind === "host-request" ? "Labour request" : "Worker registration"} ·{" "}
          {enquiry.reference} ·{" "}
          {new Date(enquiry.receivedAt).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
        </p>

        {saved && (
          <p className="mt-6 rounded-input bg-surface-1 p-4 text-[15px]">Saved.</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {phone && (
            <a
              href={telHref(phone)}
              className="inline-flex h-12 items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-accent-press"
            >
              Call {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-[15px] font-medium transition-colors duration-150 hover:border-ink"
            >
              Email {email}
            </a>
          )}
        </div>

        <section className="mt-9 rounded-card bg-surface-1 p-6 md:p-7">
          <h2 className="text-[20px] font-medium tracking-[-0.02em]">What they sent</h2>
          <dl className="mt-5">
            {Object.entries(enquiry.fields)
              .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== ""))
              .map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 border-b border-line py-3.5 last:border-b-0 sm:flex-row sm:gap-6">
                  <dt className="eyebrow text-ink-45 sm:w-[180px] sm:shrink-0 sm:pt-1">
                    {LABELS[key] ?? key}
                  </dt>
                  <dd className="text-[15px] leading-[1.55]">
                    {Array.isArray(value)
                      ? value.map((entry) => readable(key, entry)).join(", ")
                      : readable(key, value)}
                  </dd>
                </div>
              ))}
          </dl>

          {enquiry.attachments.length > 0 && (
            <p className="mt-5 rounded-input bg-accent-tint p-4 text-[14px] leading-[1.6] text-accent-press">
              {enquiry.attachments.length} ticket photo
              {enquiry.attachments.length === 1 ? " was" : "s were"} selected on the form but{" "}
              <strong>not stored</strong>. Ask for them at the interview.
            </p>
          )}
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-card bg-surface-1 p-6 md:p-7">
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">Who is on it</h2>
            <form action={assignEnquiry} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="reference" value={enquiry.reference} />
              <select
                name="assignedTo"
                defaultValue={enquiry.assignedTo ?? ""}
                aria-label="Assign to"
                className="h-12 w-full rounded-input border border-line-strong bg-surface-1 px-4 text-[15px]"
              >
                <option value="">Nobody yet</option>
                {people.map((person) => (
                  <option key={person.email} value={person.email}>
                    {person.email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-[15px] font-medium text-white"
              >
                Save assignment
              </button>
            </form>
          </section>

          <section className="rounded-card bg-surface-1 p-6 md:p-7">
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">Status</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["new", "assigned", "closed"] as const).map((status) => (
                <form key={status} action={setEnquiryStatus}>
                  <input type="hidden" name="reference" value={enquiry.reference} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={enquiry.status === status}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] capitalize transition-colors duration-150 hover:border-ink disabled:border-ink disabled:bg-ink disabled:text-white"
                  >
                    Mark {status}
                  </button>
                </form>
              ))}
            </div>
          </section>
        </div>

        {isAdmin(user) && (
          <section className="mt-4 rounded-card border border-line p-6 md:p-7">
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">
              {enquiry.deletedAt ? "Restore this enquiry" : "Archive this enquiry"}
            </h2>
            <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.6] text-ink-70">
              {enquiry.deletedAt
                ? "This enquiry is archived and hidden from the inbox. Nothing has been destroyed, and putting it back takes one click."
                : "Archiving hides it from the inbox without destroying anything. This row is the only record of this request, so it stays in the database and can be restored. Permanent removal happens against the database on a retention cycle, never from this page."}
            </p>
            <form action={enquiry.deletedAt ? putEnquiryBack : removeEnquiry} className="mt-4">
              <input type="hidden" name="reference" value={enquiry.reference} />
              <button
                type="submit"
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-4 text-[14px] font-medium text-ink transition-colors duration-150 hover:border-ink hover:bg-surface-2"
              >
                {enquiry.deletedAt ? "Restore" : "Archive"} {enquiry.reference}
              </button>
            </form>
          </section>
        )}

        <p className="eyebrow mt-8 text-ink-45">Hire desk {site.phone}</p>
      </div>
    </Container>
  );
}
