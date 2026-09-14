/**
 * Sets up and tests hire desk alerts on Telegram.
 *
 *   npm run telegram:check
 *
 * Run it with only TELEGRAM_BOT_TOKEN set and it finds your chat ID for you,
 * which is the one genuinely awkward step. Run it with both set and it sends
 * a real alert so you can see what an enquiry will look like at 6am.
 */
const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

const ok = "\x1b[32mOK\x1b[0m  ";
const fail = "\x1b[31mFAIL\x1b[0m";

if (!token) {
  console.log(`
${fail} TELEGRAM_BOT_TOKEN is not set.

  To create the bot, in Telegram:

    1. Message @BotFather
    2. Send  /newbot
    3. Name it (e.g. "Uphold Hire Desk") and give it a username ending in "bot"
    4. BotFather replies with a token like 8123456789:AAH...  — that is the value

  Put it in .env.local as TELEGRAM_BOT_TOKEN, then run this again and it will
  find your chat ID.
`);
  process.exit(1);
}

const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).then((r) => r.json());

const me = await api("getMe");
if (!me.ok) {
  console.log(`\n${fail} The token was rejected: ${me.description}\n`);
  process.exit(1);
}
console.log(`\n${ok} Bot authenticated: @${me.result.username}\n`);

if (!chatId) {
  const updates = await api("getUpdates");
  const chats = new Map();
  for (const u of updates.result ?? []) {
    const chat = u.message?.chat ?? u.channel_post?.chat;
    if (chat) chats.set(chat.id, chat);
  }

  if (chats.size === 0) {
    console.log(`${fail} TELEGRAM_CHAT_ID is not set, and the bot has no messages to learn it from.

  Send it one, then run this again:

    Just you        open a chat with @${me.result.username} and send anything
    The whole desk  create a group, add @${me.result.username} to it, send a message

  A group is usually right: everyone sees the same alert, and nobody is a
  single point of failure at 6am.
`);
    process.exit(1);
  }

  console.log("Found these chats. Put the id in .env.local as TELEGRAM_CHAT_ID:\n");
  for (const chat of chats.values()) {
    const label = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" ");
    console.log(`  ${String(chat.id).padEnd(16)} ${chat.type.padEnd(10)} ${label ?? ""}`);
  }
  console.log("");
  process.exit(1);
}

const sent = await api("sendMessage", {
  chat_id: chatId,
  parse_mode: "HTML",
  link_preview_options: { is_disabled: true },
  text: [
    "🔶 <b>Labour request</b> · Parramatta · Tomorrow 6am",
    "",
    "<b>Test Enquiry</b>",
    "0400 000 000",
    "",
    "Trades: General labourers",
    "How many: 4",
    "Suburb: Parramatta",
    "",
    "This is a test from npm run telegram:check. A real alert looks like this.",
  ].join("\n"),
});

if (!sent.ok) {
  console.log(`${fail} Could not send to chat ${chatId}: ${sent.description}

  If that says "chat not found", the bot has not been added to the chat, or
  the id is wrong. Unset TELEGRAM_CHAT_ID and run again to re-discover it.
`);
  process.exit(1);
}

console.log(`${ok} Test alert delivered to chat ${chatId}.

  Check your phone. If that is what you want to see at 6am, set the same two
  variables in Vercel and redeploy.
`);
