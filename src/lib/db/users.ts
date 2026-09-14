import { driver, supabase } from "./client";
import { mutate, read } from "./local-store";
import type { AdminUser, Role } from "./types";

type Row = {
  email: string;
  role: Role;
  must_change_password: boolean;
  password_hash: string;
  totp_secret: string | null;
  totp_enabled: boolean;
  recovery_codes: string[];
  failed_attempts: number;
  locked_until: string | null;
  created_at: string;
  last_login_at: string | null;
};

const fromRow = (row: Row): AdminUser => ({
  email: row.email,
  role: row.role ?? "manager",
  mustChangePassword: row.must_change_password ?? false,
  passwordHash: row.password_hash,
  totpSecret: row.totp_secret,
  totpEnabled: row.totp_enabled,
  recoveryCodes: row.recovery_codes ?? [],
  failedAttempts: row.failed_attempts,
  lockedUntil: row.locked_until,
  createdAt: row.created_at,
  lastLoginAt: row.last_login_at,
});

const toRow = (user: AdminUser): Row => ({
  email: user.email,
  role: user.role,
  must_change_password: user.mustChangePassword,
  password_hash: user.passwordHash,
  totp_secret: user.totpSecret,
  totp_enabled: user.totpEnabled,
  recovery_codes: user.recoveryCodes,
  failed_attempts: user.failedAttempts,
  locked_until: user.lockedUntil,
  created_at: user.createdAt,
  last_login_at: user.lastLoginAt,
});

export async function countUsers(): Promise<number> {
  if (driver === "local") return read((snapshot) => snapshot.users.length);

  const { count, error } = await supabase()
    .from("admin_users")
    .select("email", { count: "exact", head: true });

  if (error) throw new Error(`Could not count admin users: ${error.message}`);
  return count ?? 0;
}

export async function getUser(email: string): Promise<AdminUser | null> {
  const key = email.trim().toLowerCase();

  if (driver === "local") {
    return read((snapshot) => snapshot.users.find((user) => user.email === key) ?? null);
  }

  const { data, error } = await supabase()
    .from("admin_users")
    .select("*")
    .eq("email", key)
    .maybeSingle();

  if (error) throw new Error(`Could not read the admin user: ${error.message}`);
  return data ? fromRow(data as Row) : null;
}

export async function listUsers(): Promise<AdminUser[]> {
  if (driver === "local") {
    return read((snapshot) => [...snapshot.users].sort((a, b) => a.email.localeCompare(b.email)));
  }

  const { data, error } = await supabase().from("admin_users").select("*").order("email");
  if (error) throw new Error(`Could not list admin users: ${error.message}`);
  return (data as Row[]).map(fromRow);
}

/** Guards the last way back in: an account set with no admins is unrecoverable. */
export async function countAdmins(): Promise<number> {
  return (await listUsers()).filter((user) => user.role === "admin").length;
}

/**
 * A real delete, unlike enquiries, and deliberately so.
 *
 * This row is a credential, not a record. Removing it is how access is
 * revoked, and revocation has to be complete: a soft-deleted user is a row
 * that still has a password hash and a TOTP seed on it, and it stays valid for
 * any query that forgets to filter on the flag. One missed `where deleted_at
 * is null` in an auth path and a dismissed employee can still sign in.
 *
 * Enquiries are the opposite case. They hold a builder's request or a worker's
 * registration and nothing that grants access, so there the risk runs entirely
 * the other way and they are archived instead. See archiveEnquiry.
 *
 * Removing a user destroys no labour or client data: enquiries record the
 * assignee by email as plain text, so an enquiry keeps saying who handled it
 * after the account behind that address is gone.
 */
export async function deleteUser(email: string): Promise<void> {
  if (driver === "local") {
    await mutate((snapshot) => {
      snapshot.users = snapshot.users.filter((user) => user.email !== email);
    });
    return;
  }

  const { error } = await supabase().from("admin_users").delete().eq("email", email);
  if (error) throw new Error(`Could not remove the admin user: ${error.message}`);
}

export async function putUser(user: AdminUser): Promise<void> {
  if (driver === "local") {
    await mutate((snapshot) => {
      const index = snapshot.users.findIndex((existing) => existing.email === user.email);
      if (index >= 0) snapshot.users[index] = user;
      else snapshot.users.push(user);
    });
    return;
  }

  const { error } = await supabase().from("admin_users").upsert(toRow(user), { onConflict: "email" });
  if (error) throw new Error(`Could not save the admin user: ${error.message}`);
}
