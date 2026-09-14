import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getUser } from "@/lib/db/users";
import type { AdminUser } from "@/lib/db/types";

/**
 * The signed in user, loaded fresh from the database on every request.
 *
 * The session cookie carries only an email, deliberately. Reading the role
 * back each time means a demotion or a removed account takes effect on the
 * next click rather than whenever the eight hour session happens to expire.
 */
export async function currentUser(): Promise<AdminUser | null> {
  const session = await verifySession();
  if (!session) return null;
  return getUser(session.email);
}

export async function requireUser(): Promise<AdminUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  // An admin created account has to choose its own password before it can do
  // anything, so the temporary one is never a standing credential.
  if (user.mustChangePassword) redirect("/admin/password");
  return user;
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?denied=1");
  return user;
}

export const isAdmin = (user: AdminUser | null) => user?.role === "admin";

/** What each seat may do. Checked in the action, not only in the markup. */
export const can = {
  /** Post, edit and close roles; read enquiries and move them along. */
  manageContent: (user: AdminUser | null) => Boolean(user),
  /** Add and remove people, change roles, reset someone's second factor. */
  managePeople: isAdmin,
  /** Permanently delete a role or an enquiry, rather than closing it. */
  destroy: isAdmin,
};
