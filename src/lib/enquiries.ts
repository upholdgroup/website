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
 * The alert. Short enough to read on a lock screen, and front-loaded: what
 * kind of job, where, and when it starts, before anything else. The mobile is
 * on its own line because Telegram turns it into a tap-to-call link.
 */
async function pingTelegram(record: StoredEnquiry): Promise<void> {
  const host = record.kind === "host-request";
  const name = esc(String(record.fields.name ?? "Someone"));
  const phone = esc(String(record.fields.phone ?? ""));
  const suburb = esc(String(record.fields.suburb ?? record.fields.preferredRegion ?? ""));
  const start = esc(readable("start", String(record.fields.start ?? "")));

  const headline = host
    ? `🔶 <b>Labour request</b>${suburb ? ` · ${suburb}` : ""}${start ? ` · ${start}` : ""}`
    : `🔷 <b>Worker registration</b>${suburb ? ` · ${suburb}` : ""}`;

  await sendTelegram(
    [
      headline,
      "",
      `<b>${name}</b>`,
      phone,
      "",
      esc(summarise(record)),
      "",
      `<a href="${site.url}/admin/enquiries/${record.reference}">Open ${esc(record.reference)}</a>`,
    ]
      .filter((line) => line !== undefined && line !== "undefined")
      .join("\n"),
  );
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
