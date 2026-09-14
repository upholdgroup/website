import { Resend } from "resend";

/**
 * Transactional email.
 *
 * With no `RESEND_API_KEY` the message is written to the server log instead of
 * sent, and `sent: false` comes back so the caller can say so. That is the
 * local development path — it is never a silent success.
 */
/**
 * Strips wrapping quotes as well as whitespace.
 *
 * A .env file quotes any value containing spaces, so EMAIL_FROM is written
 * `EMAIL_FROM="Uphold Group <admin@upholdgroup.com.au>"` on disk, and the
 * quotes are syntax rather than part of the value. A hosting dashboard has no
 * such syntax: paste that line in and the quotes become the value. Resend then
 * rejects the whole send with "Invalid `from` field", and the enquiry is saved
 * but nobody is told about it.
 *
 * Cheap to tolerate, expensive to miss.
 */
const clean = (value: string | undefined): string | undefined =>
  value?.trim().replace(/^(['"])([\s\S]*)\1$/, "$2").trim();

const apiKey = clean(process.env.RESEND_API_KEY);
const from = clean(process.env.EMAIL_FROM) || "Uphold Group <noreply@upholdgroup.com.au>";

export const emailConfigured = Boolean(apiKey);

let resend: Resend | null = null;

export type Message = {
  to: string | string[];
  subject: string;
  /** Plain text only — these are operational notes, not marketing. */
  text: string;
  replyTo?: string;
};

export async function sendEmail(message: Message): Promise<{ sent: boolean }> {
  if (!apiKey) {
    console.info(
      `[uphold] email not sent (RESEND_API_KEY unset)\n  to: ${[message.to].flat().join(", ")}\n  subject: ${message.subject}\n\n${message.text}\n`,
    );
    return { sent: false };
  }

  resend ??= new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    replyTo: message.replyTo,
  });

  if (error) throw new Error(`Could not send email: ${error.message}`);
  return { sent: true };
}
