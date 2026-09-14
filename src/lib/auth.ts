import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "uphold_admin";
/** Set once the password is accepted, before the second factor. */
export const PENDING_COOKIE = "uphold_admin_pending";

const SESSION_HOURS = 8;
const PENDING_MINUTES = 10;

/** Failed sign in attempts before the account is locked, and for how long. */
export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

/**
 * In production the secret must be supplied. In development and CI a random
 * one is generated per boot instead, so sessions do not survive a restart,
 * which is a small price for never shipping a well known signing key.
 */
const secret =
  process.env.ADMIN_SESSION_SECRET?.trim() ||
  (process.env.NODE_ENV === "production" ? "" : randomBytes(32).toString("hex"));

export const adminConfigured = Boolean(secret);

/**
 * Who may claim the very first account, before any user exists. After that the
 * database is the only list that matters, and access is revoked by removing
 * the user rather than by editing an environment variable.
 */
const bootstrapList = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export const bootstrapConfigured = bootstrapList.length > 0;
export const canBootstrap = (email: string) => bootstrapList.includes(email.trim().toLowerCase());

const sign = (payload: string) => createHmac("sha256", secret).update(payload).digest("base64url");

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

type Payload = { email: string; stage: "full" | "pending"; exp: number };

function mint(payload: Payload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function open(raw: string | undefined, stage: Payload["stage"]): string | null {
  if (!adminConfigured || !raw) return null;

  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature || !safeEqual(signature, sign(encoded))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as Payload;
    // The stage is inside the signed payload, so a half finished sign in
    // cannot be replayed as a finished one by moving the cookie.
    if (payload.stage !== stage) return null;
    if (typeof payload.email !== "string" || payload.exp <= Date.now()) return null;
    return payload.email;
  } catch {
    return null;
  }
}

/**
 * The cookies as name, value and options.
 *
 * Route Handlers that build their own NextResponse must set them on that
 * response, because a cookies().set() there is dropped.
 *
 * `secure` follows the actual connection rather than NODE_ENV: a production
 * build served over plain HTTP would otherwise set a Secure cookie the browser
 * throws away, and sign in would fail with no error anywhere.
 */
export function sessionCookie(email: string, secure: boolean) {
  return {
    name: SESSION_COOKIE,
    value: mint({ email: email.toLowerCase(), stage: "full", exp: Date.now() + SESSION_HOURS * 3_600_000 }),
    options: cookieOptions(secure, SESSION_HOURS * 3600),
  };
}

export function pendingCookie(email: string, secure: boolean) {
  return {
    name: PENDING_COOKIE,
    value: mint({ email: email.toLowerCase(), stage: "pending", exp: Date.now() + PENDING_MINUTES * 60_000 }),
    options: cookieOptions(secure, PENDING_MINUTES * 60),
  };
}

const cookieOptions = (secure: boolean, maxAge: number) => ({
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

export async function setSession(email: string, secure: boolean): Promise<void> {
  const store = await cookies();
  const { name, value, options } = sessionCookie(email, secure);
  store.set(name, value, options);
  store.delete(PENDING_COOKIE);
}

export async function setPending(email: string, secure: boolean): Promise<void> {
  const { name, value, options } = pendingCookie(email, secure);
  (await cookies()).set(name, value, options);
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(PENDING_COOKIE);
}

/**
 * The real check, run next to the data.
 *
 * proxy.ts does an optimistic cookie presence check to keep signed out
 * visitors off /admin, but the Next.js authentication guide is explicit that
 * Proxy must not be the only line of defence, so every admin page and every
 * admin action calls this.
 */
export async function verifySession(): Promise<{ email: string } | null> {
  const email = open((await cookies()).get(SESSION_COOKIE)?.value, "full");
  return email ? { email } : null;
}

/** The half finished sign in: password accepted, second factor outstanding. */
export async function readPending(): Promise<string | null> {
  return open((await cookies()).get(PENDING_COOKIE)?.value, "pending");
}

/** Whether a request arrived over TLS, for the cookie Secure flag. */
export async function isSecureRequest(): Promise<boolean> {
  const { headers } = await import("next/headers");
  const list = await headers();
  const proto = list.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return process.env.NODE_ENV === "production" && !list.get("host")?.startsWith("localhost");
}
