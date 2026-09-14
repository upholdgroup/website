import { Resend } from "resend";

/**
 * Transactional email.
 *
 * With no `RESEND_API_KEY` the message is written to the server log instead of
 * sent, and `sent: false` comes back so the caller can say so. That is the
 * local development path — it is never a silent success.
 */
const apiKey = process.env.RESEND_API_KEY?.trim();
const from = process.env.EMAIL_FROM?.trim() || "Uphold Group <noreply@upholdgroup.com.au>";

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
