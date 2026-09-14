import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { requireUser } from "@/lib/permissions";
import { listEnquiries } from "@/lib/db/enquiries";
import { getAllJobs } from "@/lib/db/jobs";
import { isAdmin } from "@/lib/permissions";
import type { Job } from "@/lib/content/jobs";
import type { StoredEnquiry } from "@/lib/db/types";

export const metadata = { title: "Hire desk", robots: { index: false, follow: false } };

/** Outside the component: reading the clock during render is not pure. */
function summarise(jobs: Job[], enquiries: StoredEnquiry[]) {
  const now = Date.now();
  const live = jobs.filter((job) => new Date(job.validThrough).getTime() >= now);
  const newEnquiries = enquiries.filter((enquiry) => enquiry.status === "new");

  return {
    live,
    closingSoon: live.filter(
      (job) => new Date(job.validThrough).getTime() - now < 14 * 86_400_000,
    ),
    hosts: newEnquiries.filter((e) => e.kind === "host-request"),
    workers: newEnquiries.filter((e) => e.kind === "worker-registration"),
  };
}

export default async function AdminBoard({ searchParams }: PageProps<"/admin">) {
  const user = await requireUser();
  const { denied } = await searchParams;

  const [jobs, enquiries] = await Promise.all([getAllJobs(), listEnquiries()]);

  const { live, closingSoon, hosts, workers } = summarise(jobs, enquiries);

  return (
    <Container>
      <div className="py-10 md:py-14">
        <p className="eyebrow text-ink-45">Signed in as {user.email}</p>
        <h1 className="mt-3 text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[38px]">
          Hire desk
        </h1>

        {denied && (
          <p role="alert" className="mt-6 rounded-input bg-accent-tint p-4 text-[15px] text-accent-press">
            That area is for admins. Ask one of them if you need access.
          </p>
        )}

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile value={live.length} label="Live roles" href="/admin/jobs" />
          <Tile value={hosts.length} label="New labour requests" href="/admin/enquiries?kind=host-request" accent />
          <Tile value={workers.length} label="New registrations" href="/admin/enquiries?kind=worker-registration" accent />
          <Tile value={closingSoon.length} label="Roles closing in 14 days" href="/admin/jobs" />
        </ul>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Panel
            title="Latest enquiries"
            href="/admin/enquiries"
            linkLabel="Open the inbox"
            empty="Nothing has come in yet."
            items={enquiries.slice(0, 6).map((enquiry) => ({
              key: enquiry.reference,
              href: `/admin/enquiries/${enquiry.reference}`,
              primary: String(enquiry.fields.name ?? "Someone"),
              secondary: `${enquiry.kind === "host-request" ? "Labour request" : "Registration"} · ${enquiry.reference}`,
              tag: enquiry.status,
            }))}
          />

          <Panel
            title="Roles closing soon"
            href="/admin/jobs"
            linkLabel="All roles"
            empty="Nothing closes in the next fortnight."
            items={closingSoon.slice(0, 6).map((job) => ({
              key: job.id,
              href: `/admin/jobs/${job.id}`,
              primary: job.title,
              secondary: `${job.suburb} · ${job.id}`,
              tag: `closes ${job.validThrough}`,
            }))}
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Action href="/admin/jobs/new" label="Post a role" primary />
          <Action href="/admin/enquiries" label="Enquiry inbox" />
          {isAdmin(user) && <Action href="/admin/people" label="People" />}
        </div>
      </div>
    </Container>
  );
}

function Tile({
  value,
  label,
  href,
  accent = false,
}: {
  value: number;
  label: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`lift block rounded-card p-6 transition-colors duration-150 ${
          accent && value > 0 ? "bg-ink text-white" : "bg-surface-1 hover:bg-white"
        }`}
      >
        <span className="block text-[32px] leading-none font-bold tracking-[-0.03em]">{value}</span>
        <span className={`mt-2 block text-[13px] ${accent && value > 0 ? "text-on-ink-60" : "text-ink-70"}`}>
          {label}
        </span>
      </Link>
    </li>
  );
}

function Panel({
  title,
  href,
  linkLabel,
  items,
  empty,
}: {
  title: string;
  href: string;
  linkLabel: string;
  empty: string;
  items: { key: string; href: string; primary: string; secondary: string; tag: string }[];
}) {
  return (
    <section className="rounded-card bg-surface-1 p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-medium tracking-[-0.02em]">{title}</h2>
        <Link href={href} className="text-[14px] text-ink-70 underline underline-offset-4 hover:text-ink">
          {linkLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-5 text-[15px] text-ink-45">{empty}</p>
      ) : (
        <ul className="mt-5">
          {items.map((item) => (
            <li key={item.key} className="border-b border-line last:border-b-0">
              <Link
                href={item.href}
                className="flex items-center justify-between gap-4 py-3.5 transition-colors duration-150 hover:text-accent"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium">{item.primary}</span>
                  <span className="block truncate text-[13px] text-ink-45">{item.secondary}</span>
                </span>
                <span className="eyebrow shrink-0 text-ink-45">{item.tag}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Action({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center rounded-full px-5 text-[15px] font-medium transition-colors duration-150 ${
        primary ? "bg-accent text-white hover:bg-accent-press" : "border border-line-strong hover:border-ink"
      }`}
    >
      {label}
    </Link>
  );
}
