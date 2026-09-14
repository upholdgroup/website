"use server";

import { redirect } from "next/navigation";
import { archiveEnquiry, restoreEnquiry, updateEnquiry } from "@/lib/db/enquiries";
import { requireAdmin, requireUser } from "@/lib/permissions";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Both seats can move an enquiry along. That is the recruiter's daily work. */
export async function setEnquiryStatus(formData: FormData): Promise<void> {
  await requireUser();

  const reference = text(formData, "reference");
  const status = text(formData, "status") as "new" | "assigned" | "closed";
  if (!reference || !["new", "assigned", "closed"].includes(status)) redirect("/admin/enquiries");

  await updateEnquiry(reference, { status });
  redirect(`/admin/enquiries/${reference}?saved=1`);
}

export async function assignEnquiry(formData: FormData): Promise<void> {
  const user = await requireUser();

  const reference = text(formData, "reference");
  const assignee = text(formData, "assignedTo");
  if (!reference) redirect("/admin/enquiries");

  await updateEnquiry(reference, {
    assignedTo: assignee || null,
    // Assigning is what moves it out of the new pile, so do not make the desk
    // remember to also change the status.
    ...(assignee ? { status: "assigned" as const } : {}),
  });
  redirect(`/admin/enquiries/${reference}?saved=1&by=${encodeURIComponent(user.email)}`);
}

/**
 * Admin only, and reversible.
 *
 * This archives rather than deletes: the row is the only record that a builder
 * asked for a crew or a worker registered, and there is no undo on a Postgres
 * delete. Permanent removal happens against the database on a retention cycle,
 * never from a button. See supabase/schema.sql.
 */
export async function removeEnquiry(formData: FormData): Promise<void> {
  await requireAdmin();

  const reference = text(formData, "reference");
  if (reference) await archiveEnquiry(reference);
  redirect("/admin/enquiries?archived=" + encodeURIComponent(reference));
}

/** The way back, for the mis-click this whole arrangement exists to survive. */
export async function putEnquiryBack(formData: FormData): Promise<void> {
  await requireAdmin();

  const reference = text(formData, "reference");
  if (reference) await restoreEnquiry(reference);
  redirect("/admin/enquiries?restored=" + encodeURIComponent(reference));
}
