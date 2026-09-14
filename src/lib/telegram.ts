/**
 * Telegram notifications for the hire desk.
 *
 * Email is the record; this is the alert. A builder who rings at 5:50am is
 * comparing you against whoever answers first, and an email sitting unread in
 * a shared inbox does not win that. A phone buzzing does.
 *
 * Chosen over SMS deliberately: free at any volume, no per-message cost to
 * forget about, and a group chat means the whole desk sees the same message
 * rather than one person being a single point of failure.
 *
 * Unset variables are not an error. Without a token this no-ops and reports
 * `sent: false`, exactly like the email path, so the site runs identically
 * with or without it.
 */
const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

export const telegramConfigured = Boolean(token && chatId);

/**
 * Telegram's HTML mode accepts a small tag set and rejects a message outright
 * if anything else looks like markup. Visitor-supplied text reaches this, so
 * every interpolated value is escaped: a company called "Smith & Sons <Pty>"
 * would otherwise fail the whole send.
 */
export const esc = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendTelegram(html: string): Promise<{ sent: boolean }> {
  if (!token || !chatId) {
    console.info(`[uphold] telegram not sent (not configured)\n\n${html}\n`);
    return { sent: false };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: "HTML",
      // The desk wants the message, not a card preview of upholdgroup.com.au.
      link_preview_options: { is_disabled: true },
    }),
    // A visitor is waiting on the form behind this. If Telegram is slow, the
    // enquiry is already saved and the email is already away, so give up
    // rather than hold the response open.
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Telegram ${response.status}: ${body.slice(0, 200)}`);
  }

  return { sent: true };
}
