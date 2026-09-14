/**
 * Sends one real email, so you can confirm delivery rather than assume it.
 *
 * Run with `npm run email:check -- you@example.com`. It uses the same key and
 * sender the app uses, so a pass here means the enquiry emails will arrive too.
 */
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY?.trim();
const from = process.env.EMAIL_FROM?.trim() || "Uphold Group <noreply@upholdgroup.com.au>";
const to = process.argv[2];

const tick = (ok) => (ok ? "[32mOK[0m  " : "[31mFAIL[0m");

if (!key) {
  console.log("\nNot configured. Enquiry emails are being written to the server log instead.\n");
  console.log(`${tick(false)} RESEND_API_KEY — missing from .env.local`);
  console.log("\nCreate a key at resend.com → API Keys, add it to .env.local, run this again.\n");
  process.exit(1);
}

if (!to) {
  console.log("\nWhich address should I send to?\n");
  console.log("  npm run email:check -- you@example.com\n");
  process.exit(1);
}

// Resend's shared test sender only delivers to the address that owns the
// account, which is the most common reason a first send looks like it worked
// and nothing arrives.
const testSender = /@resend\.dev>?$/.test(from);
console.log(`\nSending from ${from}\n           to ${to}\n`);
if (testSender) {
  console.log("Note: that is Resend's test sender. It only delivers to the address on");
  console.log("your Resend account. Verify your own domain before going live.\n");
}

const { data, error } = await new Resend(key).emails.send({
  from,
  to,
  subject: "Uphold Group, email delivery test",
  text: [
    "This is the delivery test from scripts/check-email.mjs.",
    "",
    "If this arrived, the enquiry emails will arrive too: the hire desk",
    "notification and the confirmation sent back to the host.",
  ].join("\n"),
});

if (error) {
  console.log(`${tick(false)} ${error.message}`);
  if (/domain|not verified|from/i.test(error.message)) {
    console.log("\nThat usually means EMAIL_FROM is not a verified sender. Add and verify");
    console.log("your domain at resend.com → Domains, then set EMAIL_FROM to an address on it.\n");
  }
  process.exit(1);
}

console.log(`${tick(true)} sent, id ${data?.id}`);
console.log("\nCheck the inbox, and the spam folder. Delivery shows in the Resend dashboard too.\n");
process.exit(0);
