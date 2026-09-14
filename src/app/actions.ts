"use server";

import { assignConsultant, callbackWindow, deliverEnquiry, makeReference } from "@/lib/enquiries";
import type { FormState } from "@/lib/form-state";
import { site } from "@/lib/site";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Australian mobile or landline, with or without spaces and +61. */
function validPhone(value: string): boolean {
  const digits = value.replace(/[\s()-]/g, "").replace(/^\+61/, "0");
  return /^0[2-9]\d{8}$/.test(digits);
}

/**
 * Host request — 3 steps × 2 fields. Every field is re-validated here: the
 * client-side step gating is a convenience, not a guarantee.
 */
export async function requestLabour(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot. A real person never fills a field they cannot see.
  if (text(formData, "company_website")) {
    return { status: "error", errors: { form: "That request could not be sent. Call us instead." } };
  }

  const trades = formData.getAll("trades").map(String).filter(Boolean);
  const workers = text(formData, "workers");
  const suburb = text(formData, "suburb");
  const start = text(formData, "start");
  const name = text(formData, "name");
  const phone = text(formData, "phone");

  const errors: Record<string, string> = {};
  if (trades.length === 0) errors.trades = "Pick at least one trade so we know who to send.";
  if (!/^\d{1,3}$/.test(workers) || Number(workers) < 1)
    errors.workers = "How many workers do you need?";
  if (suburb.length < 2) errors.suburb = "Which Sydney suburb is the site in?";
  if (!start) errors.start = "When do you need them to start?";
  if (name.length < 2) errors.name = "Tell us who to ask for.";
  if (!validPhone(phone)) errors.phone = "Enter an Australian mobile or landline.";

  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const reference = makeReference("host-request");
  await deliverEnquiry({
    kind: "host-request",
    reference,
    receivedAt: new Date().toISOString(),
    fields: {
      trades,
      workers,
      suburb,
      start,
      name,
      phone,
      company: text(formData, "company"),
      email: text(formData, "email"),
      notes: text(formData, "notes"),
    },
  });

  return {
    status: "success",
    reference,
    consultant: assignConsultant("host-request").name,
    callback: callbackWindow(),
  };
}

/** Worker registration — 2 steps, no CV, no password. */
export async function registerWorker(_prev: FormState, formData: FormData): Promise<FormState> {
  if (text(formData, "company_website")) {
    return { status: "error", errors: { form: "That registration could not be sent. Call us instead." } };
  }

  const name = text(formData, "name");
  const phone = text(formData, "phone");
  const trade = text(formData, "trade");
  const suburb = text(formData, "suburb");
  const tickets = formData.getAll("tickets").map(String).filter(Boolean);

  const errors: Record<string, string> = {};
  // Evidence of consent matters as much as the consent itself: without the
  // version and the timestamp there is no way to say later what was agreed to.
  if (text(formData, "consent") !== "yes") {
    errors.form = "Please tick the box so we can verify your tickets and text you roles.";
  }
  if (name.length < 2) errors.name = "Enter your full name.";
  if (!validPhone(phone)) errors.phone = "Enter the mobile we should text you on.";
  if (!trade) errors.trade = "Pick the trade you work in.";
  if (suburb.length < 2) errors.suburb = "Which Sydney suburb do you live in?";

  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const reference = makeReference("worker-registration");
  await deliverEnquiry({
    kind: "worker-registration",
    reference,
    receivedAt: new Date().toISOString(),
    fields: {
      name,
      phone,
      trade,
      suburb,
      tickets,
      role: text(formData, "role"),
      consent: `Agreed to privacy policy v${site.privacy.version} at ${new Date().toISOString()}`,
    },
  });

  return {
    status: "success",
    reference,
    consultant: assignConsultant("worker-registration").name,
    callback: callbackWindow(),
  };
}
