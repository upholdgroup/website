import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { saveEnquiry } from "@/lib/db/enquiries";
import type { EnquiryKind, StoredEnquiry } from "@/lib/db/types";
import { sendEmail } from "@/lib/email";
import { esc, sendTelegram } from "@/lib/telegram";
import { site } from "@/lib/site";

export type Enquiry = {
  kind: EnquiryKind;
  reference: string;
  receivedAt: string;
  fields: Record<string, string | string[]>;
  /** Unused. Kept so a future document upload has somewhere to go. */
  attachments?: string[];
};

/**
 * Where an enquiry goes: a row in the store, then an email to the desk.
 *
 * The two are deliberately not all-or-nothing. A visitor who has filled in a
 * form at 5:50am should not be shown a failure because the mail provider is
 * having a morning, so the row is written first and the email is attempted
 * after; a failure in either is logged loudly and swallowed, and the caller
 * still confirms. Losing the row is the outcome worth alerting on, and the
 * store is the thing least likely to be down.
 */
export async function deliverEnquiry(enquiry: Enquiry): Promise<void> {
  const record: StoredEnquiry = {
    reference: enquiry.reference,
    kind: enquiry.kind,
    receivedAt: enquiry.receivedAt,
    fields: enquiry.fields,
    attachments: enquiry.attachments ?? [],
    status: "new",
    assignedTo: null,
  };

  try {
    await saveEnquiry(record);
  } catch (error) {
    // The last line of defence: if the row cannot be written, the enquiry at
    // least survives in the platform logs, where it can be recovered by hand.
    console.error("[uphold] ENQUIRY NOT SAVED", JSON.stringify(record), error);
  }

  /*
    Two channels, settled independently. Email is the record the desk works
    from; Telegram is the alert that gets someone to the phone. If one
    provider is having a morning the other still goes, and neither can hold
    up the visitor waiting on the form behind this.
  */
  const [emailed, pinged] = await Promise.allSettled([
    notifyDesk(record),
    pingTelegram(record),
  ]);

  if (emailed.status === "rejected") {
    console.error("[uphold] enquiry saved but not emailed", record.reference, emailed.reason);
  }
  if (pinged.status === "rejected") {
    console.error("[uphold] enquiry saved but no telegram alert", record.reference, pinged.reason);
  }
}

/**
 * Groups an Australian mobile the way it is written: 0435 869 082.
 *
 * Telegram still turns it into a tap-to-call link, and a consultant reading a
 * ten digit run at 6am to key into a handset should not have to count.
 */
function spacedPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("04")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return raw;
}

/** Sydney time, because the desk is in Sydney and so is the site. */
const sydneyTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-AU", {
    timeZone: "Australia/Sydney",
    hour: "numeric",
    minute: "2-digit",
  });

/**
 * How loudly to announce it.
 *
 * A crew wanted on site tomorrow at 6am and a speculative "ongoing" enquiry
 * are the same database row and completely different mornings. The first
 * needs someone to move now; the second can wait until the desk opens. The
 * banner says which without the reader having to parse the body.
 */
function urgency(start: string): { flag: string; line: string } {
  if (start === "tomorrow-6am") return { flag: "🔴", line: "NEEDED TOMORROW 6AM" };
  if (start === "this-week") return { flag: "🟠", line: "NEEDED THIS WEEK" };
  return { flag: "🔶", line: "" };
}

/**
 * The alert.
 *
 * Built to be read on a lock screen without opening it, so it is ordered by
 * what a consultant decides on rather than by the order of the form: the ask
 * first, then where and when, then who to ring. Everything else is below the
 * fold of a notification and can wait until the app is open.
 *
 * The reference sits in <code> because Telegram makes a code span tap-to-copy
 * on mobile, which is what a consultant does with it before opening the desk.
 */
async function pingTelegram(record: StoredEnquiry): Promise<void> {
  const host = record.kind === "host-request";
  const f = record.fields;
  const get = (key: string) => (typeof f[key] === "string" ? (f[key] as string) : "");
  const list = (key: string) => (Array.isArray(f[key]) ? (f[key] as string[]) : []);

  const name = esc(get("name") || "Someone");
  const phone = esc(spacedPhone(get("phone")));
  const suburb = esc(get("suburb"));
  const at = sydneyTime(record.receivedAt);
  const link = `${site.url}/admin/enquiries/${record.reference}`;

  const lines: string[] = [];

  if (host) {
    const { flag, line } = urgency(get("start"));
    const count = get("workers");
    const what = list("trades").map((t) => readable("trades", t)).join(", ") || "Crew";

    lines.push(`${flag} <b>LABOUR REQUEST</b>${line ? ` · <b>${line}</b>` : ""}`);
    lines.push("");
    // The ask, in one line, because this is the whole decision.
    lines.push(`<b>${count ? `${esc(count)} × ` : ""}${esc(what)}</b>`);
    if (suburb) lines.push(`${suburb}${get("start") ? ` · ${esc(readable("start", get("start")))}` : ""}`);
  } else {
    lines.push("🔷 <b>WORKER REGISTRATION</b>");
    lines.push("");
    lines.push(`<b>${esc(readable("trade", get("trade")) || "Worker")}</b>`);
    if (suburb) lines.push(suburb);
  }

  lines.push("");
  lines.push(`<b>${name}</b>${host && get("company") ? ` · ${esc(get("company"))}` : ""}`);
  if (phone) lines.push(phone);

  const tickets = list("tickets");
  if (tickets.length) {
    lines.push("");
    lines.push(`<b>Tickets</b> · ${tickets.map((t) => esc(t)).join(" · ")}`);
  }

  if (host && get("notes")) {
    lines.push("");
    lines.push(`<blockquote>${esc(get("notes"))}</blockquote>`);
  }

  if (get("role")) {
    lines.push("");
    lines.push(`Applying for <code>${esc(get("role"))}</code>`);
  }

  if (record.attachments.length > 0) {
    lines.push("");
    lines.push(`⚠️ ${record.attachments.length} ticket photo(s) chosen but NOT stored. Ask at interview.`);
  }

  lines.push("");
  lines.push(`<code>${esc(record.reference)}</code> · ${at}`);
  lines.push(`<a href="${link}">Open in the hire desk →</a>`);

  await sendTelegram(lines.join("\n"));
}

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
  consent: "Consent",
};

/** Slugs are for URLs. A consultant reading this at 5:50am gets words. */
const STARTS: Record<string, string> = {
  "tomorrow-6am": "Tomorrow 6am",
  "this-week": "This week",
  ongoing: "Ongoing / not urgent",
};

function readable(key: string, value: string): string {
  if (key === "trades" || key === "trade") {
    return trades.find((trade) => trade.slug === value)?.name ?? value;
  }
  if (key === "preferredRegion") {
    return regions.find((region) => region.slug === value)?.name ?? value;
  }
  if (key === "start") return STARTS[value] ?? value;
  return value;
}

function summarise(record: StoredEnquiry): string {
  const lines = Object.entries(record.fields)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== ""))
    .map(([key, value]) => {
      const shown = Array.isArray(value)
        ? value.map((entry) => readable(key, entry)).join(", ")
        : readable(key, value);
      return `${LABELS[key] ?? key}: ${shown}`;
    });

  if (record.attachments.length > 0) {
    // Say it plainly rather than let the desk assume the photos are attached.
    lines.push(
      `Ticket photos: ${record.attachments.length} selected but NOT stored, ask at interview.`,
    );
  }

  return lines.join("\n");
}

async function notifyDesk(record: StoredEnquiry): Promise<void> {
  const host = record.kind === "host-request";
  const contact = String(record.fields.name ?? "Someone");
  const phone = String(record.fields.phone ?? "");

  await sendEmail({
    to: host ? site.hireEmail : site.workEmail,
    replyTo: typeof record.fields.email === "string" && record.fields.email ? record.fields.email : undefined,
    subject: host
      ? `Labour request ${record.reference}, ${record.fields.suburb ?? "Sydney"}, ${contact}`
      : `Worker registration ${record.reference}, ${contact}`,
    text: [
      host ? "New labour request." : "New worker registration.",
      "",
      summarise(record),
      "",
      `Reference: ${record.reference}`,
      `Received: ${new Date(record.receivedAt).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`,
      phone ? `Call back: ${phone}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  // Only hosts give us an email address, and only on the optional field.
  const replyTo = record.fields.email;
  if (host && typeof replyTo === "string" && replyTo) {
    await sendEmail({
      to: replyTo,
      replyTo: site.hireEmail,
      subject: `We have your request, ${record.reference}`,
      text: [
        `Thanks ${contact}.`,
        "",
        `We have your request for ${record.fields.workers ?? ""} worker(s) in ${record.fields.suburb ?? "Sydney"}.`,
        "A consultant is calling you shortly, and your written all-inclusive hourly rate per classification follows by email the same day.",
        "",
        `Reference: ${record.reference}`,
        `If it is urgent, call ${site.phone}, the hire desk answers from 5:30am.`,
      ].join("\n"),
    });
  }
}

/** Human-quotable reference: UG-H-4K9T2 / UG-W-4K9T2. */
export function makeReference(kind: EnquiryKind): string {
  const letter = kind === "host-request" ? "H" : "W";
  const token = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `UG-${letter}-${token}`;
}

/**
 * Who the confirmation says is coming back to you.
 *
 * This used to round-robin three invented consultants, which named a person
 * who does not exist to someone who is about to ring and ask for them. A team
 * is the honest version until the desk wants real names here, and it reads the
 * same on both sides of the confirmation sentence:
 *
 *   "Our hire desk is calling you within 60 minutes."
 *   "Our recruitment team will text you within one business day."
 */
export function assignConsultant(kind: EnquiryKind) {
  return kind === "host-request"
    ? { name: "Our hire desk", title: "Hire desk" }
    : { name: "Our recruitment team", title: "Recruitment" };
}

/**
 * The callback window we actually commit to, from the hour of day. The hire
 * desk runs 5:30am–8pm weekdays and 6am–4pm weekends (Sydney time).
 */
export function callbackWindow(now: Date = new Date()): string {
  const sydneyHour = Number(
    new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      hour: "numeric",
      hour12: false,
    }).format(now),
  );

  if (sydneyHour < 5) return "from 5:30am this morning";
  if (sydneyHour < 19) return "within 60 minutes";
  return "before 7am tomorrow";
}
