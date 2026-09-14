import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

/** promisify loses the options overload, so wrap it once by hand. */
function derive(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, options, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

/**
 * Password hashing with scrypt from node:crypto, so there is no native
 * dependency to build and nothing to keep patched.
 *
 * Parameters are stored alongside the hash, so raising the cost later does not
 * invalidate existing passwords: an old hash still verifies with its own N.
 */
const N = 16384;
const r = 8;
const p = 1;
const KEY_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password.normalize("NFKC"), salt, KEY_LENGTH, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, sN, sR, sP, salt, hash] = stored.split("$");
    if (scheme !== "scrypt") return false;

    const expected = Buffer.from(hash, "base64url");
    const actual = await derive(password.normalize("NFKC"), Buffer.from(salt, "base64url"), expected.length, {
      N: Number(sN),
      r: Number(sR),
      p: Number(sP),
    });

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** Minimum bar for a password that guards worker licence data. */
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return "Use at least 12 characters.";
  if (!/[a-z]/.test(password)) return "Include a lower case letter.";
  if (!/[A-Z]/.test(password)) return "Include an upper case letter.";
  if (!/[0-9]/.test(password)) return "Include a number.";
  return null;
}

/** Recovery codes, shown once at enrolment and stored only as hashes. */
export function makeRecoveryCodes(count = 10): string[] {
  return Array.from({ length: count }, () => {
    const raw = randomBytes(5).toString("hex").toUpperCase();
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  });
}
