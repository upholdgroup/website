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
/* Same treatment as EMAIL_FROM: a value pasted from a .env line can arrive
   wrapped in the quotes that were only ever .env syntax. A chat id with a
   stray quote on it comes back from Telegram as "chat not found", which
   reads like a configuration mistake somewhere else entirely. */
const clean = (value: string | undefined): string | undefined =>
  value?.trim().replace(/^(['"])([\s\S]*)\1$/, "$2").trim();

const token = clean(process.env.TELEGRAM_BOT_TOKEN);
const chatId = clean(process.env.TELEGRAM_CHAT_ID);

export const telegramConfigured = Boolean(token && chatId);

/*
  A chat id is an optional minus sign followed by digits. Anything else has
  been mangled somewhere between the dashboard and here, and the only symptom
  Telegram gives for that is "chat not found".
*/
if (chatId && !/^-?\d+$/.test(chatId)) {
  console.error(
    `[uphold] TELEGRAM_CHAT_ID does not look like a chat id: [${chatId}] ` +
      `(${chatId.length} chars). Expected digits, optionally with a leading minus ` +
      `for a group. Alerts will fail with "chat not found".`,
  );
}

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
    /*
      The chat id goes in the error on purpose.

      Telegram answers a wrong id with "chat not found" and nothing else, which
      reads like the group is gone when the real cause is usually the value: a
      dropped minus sign, a trailing newline, a quote that survived a paste
      into a hosting dashboard. Without the value in the message there is no
      way to tell those apart from a log, and the bracket and length make
      whitespace and truncation visible.

      It is not a credential. A chat id is useless without the bot token, and
      the token is never logged.
    */
    throw new Error(
      `Telegram ${response.status}: ${body.slice(0, 200)} ` +
        `(chat id sent: [${chatId}], ${chatId.length} chars)`,
    );
  }

  return { sent: true };
}
