import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * TOTP, RFC 6238, on top of node:crypto.
 *
 * Six digits, thirty second steps, SHA1, which is what every authenticator app
 * assumes when the otpauth URI omits those parameters. SHA1 here is a MAC over
 * a counter, not a collision sensitive use, and it is what the ecosystem
 * interoperates on.
 */
const DIGITS = 6;
const STEP_SECONDS = 30;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function newSecret(): string {
  return base32Encode(randomBytes(20));
}

/** What the QR code encodes, and what a manual entry screen shows. */
export function otpauthUri(secret: string, email: string, issuer = "Uphold Group"): string {
  const label = encodeURIComponent(`${issuer}:${email}`);
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${params}`;
}

export function codeFor(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac("sha1", key).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** DIGITS).padStart(DIGITS, "0");
}

/**
 * Accepts the current step and one either side, which covers a phone clock
 * that has drifted and a code typed as it rolls over. Wider than that starts
 * meaningfully extending the window an intercepted code stays usable.
 */
export function verifyCode(secret: string, code: string, now: Date = new Date()): boolean {
  const cleaned = code.replace(/\D/g, "");
  if (cleaned.length !== DIGITS) return false;

  const counter = Math.floor(now.getTime() / 1000 / STEP_SECONDS);
  const supplied = Buffer.from(cleaned);

  for (const drift of [0, -1, 1]) {
    const expected = Buffer.from(codeFor(secret, counter + drift));
    if (expected.length === supplied.length && timingSafeEqual(expected, supplied)) return true;
  }
  return false;
}

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(input: string): Buffer {
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of input.replace(/=+$/, "").toUpperCase()) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}
