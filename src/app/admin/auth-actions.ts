"use server";

import { redirect } from "next/navigation";
import {
  LOCK_MINUTES,
  MAX_ATTEMPTS,
  adminConfigured,
  canBootstrap,
  endSession,
  isSecureRequest,
  readPending,
  setPending,
  setSession,
} from "@/lib/auth";
import { countUsers, getUser, putUser } from "@/lib/db/users";
import type { AdminUser } from "@/lib/db/types";
import { hashPassword, makeRecoveryCodes, passwordProblem, verifyPassword } from "@/lib/password";
import { newSecret, verifyCode } from "@/lib/totp";
import type { AdminState } from "@/lib/admin-state";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

const lockedFor = (user: AdminUser) =>
  user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()
    ? Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60_000)
    : 0;

/* -------------------------------------------------------------------------- */
/* Step one: email and password                                               */
/* -------------------------------------------------------------------------- */

export async function signIn(_prev: AdminState, formData: FormData): Promise<AdminState> {
  if (!adminConfigured) {
    return { status: "error", errors: { form: "Admin is not configured. Set ADMIN_SESSION_SECRET." } };
  }

  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await getUser(email);

  // One message for an unknown address and a wrong password, so this form
  // cannot be used to work out who has an account.
  const rejected: AdminState = {
    status: "error",
    errors: { form: "That email and password did not match." },
  };

  if (!user) {
    // Spend comparable time either way, so the response time does not answer
    // the question the message refuses to.
    await verifyPassword(password, "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    return rejected;
  }

  const minutes = lockedFor(user);
  if (minutes > 0) {
    return {
      status: "error",
      errors: { form: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
    };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const failedAttempts = user.failedAttempts + 1;
    await putUser({
      ...user,
      failedAttempts,
      lockedUntil:
        failedAttempts >= MAX_ATTEMPTS
          ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString()
          : user.lockedUntil,
    });
    return rejected;
  }

  await putUser({ ...user, failedAttempts: 0, lockedUntil: null });
  await setPending(user.email, await isSecureRequest());

  redirect(user.totpEnabled ? "/admin/login/code" : "/admin/login/enrol");
}

/* -------------------------------------------------------------------------- */
/* Step two: the authenticator                                                */
/* -------------------------------------------------------------------------- */

export async function confirmCode(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const email = await readPending();
  if (!email) redirect("/admin/login");

  const user = await getUser(email);
  if (!user?.totpSecret || !user.totpEnabled) redirect("/admin/login");

  const supplied = text(formData, "code");

  if (verifyCode(user.totpSecret, supplied)) {
    await putUser({ ...user, failedAttempts: 0, lastLoginAt: new Date().toISOString() });
    await setSession(user.email, await isSecureRequest());
    redirect(user.mustChangePassword ? "/admin/password" : "/admin");
  }

  // A recovery code is single use: it is removed whether or not the phone
  // comes back, and the account is pushed straight into re enrolment.
  const normalised = supplied.toUpperCase().replace(/\s/g, "");
  for (const hash of user.recoveryCodes) {
    if (await verifyPassword(normalised, hash)) {
      await putUser({
        ...user,
        recoveryCodes: user.recoveryCodes.filter((entry) => entry !== hash),
        totpSecret: null,
        totpEnabled: false,
        lastLoginAt: new Date().toISOString(),
      });
      redirect("/admin/login/enrol");
    }
  }

  const failedAttempts = user.failedAttempts + 1;
  await putUser({
    ...user,
    failedAttempts,
    lockedUntil:
      failedAttempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString()
        : user.lockedUntil,
  });

  if (failedAttempts >= MAX_ATTEMPTS) {
    await endSession();
    return { status: "error", errors: { form: `Too many attempts. Try again in ${LOCK_MINUTES} minutes.` } };
  }

  return { status: "error", errors: { code: "That code is not right. Check the app and try again." } };
}

/* -------------------------------------------------------------------------- */
/* Enrolling an authenticator                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The secret is written on first view of the enrol screen but `totpEnabled`
 * stays false until a code proves the app actually holds it. An interrupted
 * enrolment therefore leaves an account that still asks to enrol, never one
 * locked behind a secret nobody has.
 */
export async function beginEnrolment(email: string): Promise<string> {
  const user = await getUser(email);
  if (!user) redirect("/admin/login");
  if (user.totpSecret && !user.totpEnabled) return user.totpSecret;

  const secret = newSecret();
  await putUser({ ...user, totpSecret: secret, totpEnabled: false });
  return secret;
}

export async function confirmEnrolment(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const email = await readPending();
  if (!email) redirect("/admin/login");

  const user = await getUser(email);
  if (!user?.totpSecret) redirect("/admin/login");

  if (!verifyCode(user.totpSecret, text(formData, "code"))) {
    return { status: "error", errors: { code: "That code is not right. Check the app and try again." } };
  }

  const codes = makeRecoveryCodes();
  await putUser({
    ...user,
    totpEnabled: true,
    recoveryCodes: await Promise.all(codes.map(hashPassword)),
    failedAttempts: 0,
    lastLoginAt: new Date().toISOString(),
  });

  await setSession(user.email, await isSecureRequest());
  // Shown once, on the next screen, and never recoverable after that.
  redirect(`/admin/recovery-codes?codes=${encodeURIComponent(codes.join(","))}`);
}

/* -------------------------------------------------------------------------- */
/* The first account                                                          */
/* -------------------------------------------------------------------------- */

export async function createFirstAccount(_prev: AdminState, formData: FormData): Promise<AdminState> {
  if (!adminConfigured) {
    return { status: "error", errors: { form: "Admin is not configured. Set ADMIN_SESSION_SECRET." } };
  }

  // Only ever available while the table is empty, and only to an address
  // already named in ADMIN_EMAILS, so the window cannot be claimed by whoever
  // finds the deployment first.
  if ((await countUsers()) > 0) redirect("/admin/login");

  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!canBootstrap(email)) {
    return { status: "error", errors: { email: "That address is not in ADMIN_EMAILS." } };
  }

  const problem = passwordProblem(password);
  if (problem) return { status: "error", errors: { password: problem } };
  if (password !== String(formData.get("confirm") ?? "")) {
    return { status: "error", errors: { confirm: "Both passwords need to match." } };
  }

  await putUser({
    email,
    // Whoever claims the first account owns the deployment.
    role: "admin",
    mustChangePassword: false,
    passwordHash: await hashPassword(password),
    totpSecret: null,
    totpEnabled: false,
    recoveryCodes: [],
    failedAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  });

  await setPending(email, await isSecureRequest());
  redirect("/admin/login/enrol");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
