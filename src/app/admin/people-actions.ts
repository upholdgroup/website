"use server";

import { redirect } from "next/navigation";
import { countAdmins, deleteUser, getUser, listUsers, putUser } from "@/lib/db/users";
import type { Role } from "@/lib/db/types";
import { requireAdmin, requireUser } from "@/lib/permissions";
import { hashPassword, passwordProblem } from "@/lib/password";
import type { AdminState } from "@/lib/admin-state";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Readable, awkward to guess, and only ever shown once. */
function temporaryPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function addUser(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();

  const email = text(formData, "email").toLowerCase();
  const role = text(formData, "role") as Role;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", errors: { email: "Enter a valid email address." } };
  }
  if (role !== "admin" && role !== "manager") {
    return { status: "error", errors: { role: "Pick a permission level." } };
  }
  if (await getUser(email)) {
    return { status: "error", errors: { email: "That address already has an account." } };
  }

  const password = temporaryPassword();
  await putUser({
    email,
    role,
    // They set their own on first sign in; this one never becomes permanent.
    mustChangePassword: true,
    passwordHash: await hashPassword(password),
    totpSecret: null,
    totpEnabled: false,
    recoveryCodes: [],
    failedAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  });

  redirect(`/admin/people?created=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
}

export async function changeRole(formData: FormData): Promise<void> {
  const actor = await requireAdmin();

  const email = text(formData, "email").toLowerCase();
  const role = text(formData, "role") as Role;
  const user = await getUser(email);
  if (!user || (role !== "admin" && role !== "manager")) redirect("/admin/people");

  // Locking yourself out of your own deployment should take more than a click.
  if (email === actor.email && role !== "admin") {
    redirect("/admin/people?error=self-demote");
  }
  if (user.role === "admin" && role !== "admin" && (await countAdmins()) <= 1) {
    redirect("/admin/people?error=last-admin");
  }

  await putUser({ ...user, role });
  redirect("/admin/people?updated=" + encodeURIComponent(email));
}

export async function removeUser(formData: FormData): Promise<void> {
  const actor = await requireAdmin();

  const email = text(formData, "email").toLowerCase();
  if (email === actor.email) redirect("/admin/people?error=self-remove");

  const user = await getUser(email);
  if (!user) redirect("/admin/people");
  if (user.role === "admin" && (await countAdmins()) <= 1) {
    redirect("/admin/people?error=last-admin");
  }

  await deleteUser(email);
  redirect("/admin/people?removed=" + encodeURIComponent(email));
}

/**
 * Clears the second factor so the user enrols a new authenticator next time
 * they sign in. This is the lost phone path, and it is admin only because it
 * removes a factor from someone else's account.
 */
export async function resetSecondFactor(formData: FormData): Promise<void> {
  await requireAdmin();

  const email = text(formData, "email").toLowerCase();
  const user = await getUser(email);
  if (!user) redirect("/admin/people");

  await putUser({ ...user, totpSecret: null, totpEnabled: false, recoveryCodes: [] });
  redirect("/admin/people?reset=" + encodeURIComponent(email));
}

/** Anyone can change their own password; it is the only way off a temporary one. */
export async function changeOwnPassword(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const session = await requireUserAllowingTemporary();

  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { status: "error", errors: { password: problem } };
  if (password !== String(formData.get("confirm") ?? "")) {
    return { status: "error", errors: { confirm: "Both passwords need to match." } };
  }

  await putUser({
    ...session,
    passwordHash: await hashPassword(password),
    mustChangePassword: false,
  });

  redirect("/admin");
}

/**
 * `requireUser` bounces an account that still holds a temporary password to
 * the change screen, which is exactly where this action is called from.
 */
async function requireUserAllowingTemporary() {
  const { currentUser } = await import("@/lib/permissions");
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function peopleList() {
  await requireUser();
  return listUsers();
}
