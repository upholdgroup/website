/**
 * Puts the production environment block on the clipboard, ready to paste.
 *
 *   npm run env:copy
 *
 * Vercel's "Add Environment Variable" form parses a whole .env block pasted
 * into the Key field, so this is one paste rather than seven. Same for Netlify
 * and Railway.
 *
 * Values go to the clipboard and are never printed: a terminal scrollback is a
 * log, and these keys read every enquiry in the database.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const clipboard = {
  darwin: ["pbcopy"],
  win32: ["clip"],
  linux: ["xclip", "-selection", "clipboard"],
}[process.platform];

if (!clipboard) {
  console.error(`\nNo clipboard command known for ${process.platform}.`);
  console.error("Copy the block from DEPLOYMENT-SECRETS.md by hand instead.\n");
  process.exit(1);
}

let env;
try {
  env = readFileSync(".env.local", "utf8");
} catch {
  console.error("\nNo .env.local here. Copy .env.example to .env.local and fill it in.\n");
  process.exit(1);
}

/*
  Quotes are stripped on the way out.

  A .env file quotes any value containing spaces, and that quoting is syntax,
  not part of the value. A hosting dashboard has no such syntax: paste a quoted
  line in and the quotes become the value. That is how EMAIL_FROM reached
  Resend as `"Uphold Group <...>"` and every notification failed with
  "Invalid `from` field" while the enquiries themselves saved perfectly.
*/
const entries = env
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#") && line.includes("="))
  .map((line) => {
    const at = line.indexOf("=");
    const key = line.slice(0, at).trim();
    const value = line.slice(at + 1).trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
    return `${key}=${value}`;
  });

// Only meaningful in production, so it is usually absent from .env.local.
if (!entries.some((line) => line.startsWith("NEXT_PUBLIC_SITE_URL="))) {
  entries.unshift("NEXT_PUBLIC_SITE_URL=https://www.upholdgroup.com.au");
}

const block = entries.join("\n");
const result = spawnSync(clipboard[0], clipboard.slice(1), { input: block });

if (result.error) {
  console.error(`\nCould not run ${clipboard[0]}: ${result.error.message}\n`);
  process.exit(1);
}

console.log(`\n  ${entries.length} variables copied to the clipboard:\n`);
for (const line of entries) console.log(`    ${line.split("=")[0]}`);
console.log("\n  Vercel → Project Settings → Environment Variables → Add New.");
console.log("  Paste into the Key field; it splits the block into rows itself.");
console.log("  Tick Production and Preview, then Save.\n");
console.log("  Check NEXT_PUBLIC_SITE_URL matches your live domain exactly.\n");
