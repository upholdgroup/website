import { driver, readWithRetry, supabase } from "./client";
import { mutate, read } from "./local-store";
import type { StoredEnquiry } from "./types";

/**
 * Enquiries are written on a visitor's request, so a storage failure must not
 * take the form down with it. The caller decides what to do with the error;
 * see `deliverEnquiry` in src/lib/enquiries.ts.
 */
export async function saveEnquiry(enquiry: StoredEnquiry): Promise<void> {
  if (driver === "local") {
    await mutate((snapshot) => {
      snapshot.enquiries.unshift(enquiry);
    });
    return;
  }

  const { error } = await supabase().from("enquiries").insert({
    reference: enquiry.reference,
    kind: enquiry.kind,
    received_at: enquiry.receivedAt,
    fields: enquiry.fields,
    attachments: enquiry.attachments,
    status: enquiry.status,
    assigned_to: enquiry.assignedTo,
  });

  if (error) throw new Error(`Could not save the enquiry: ${error.message}`);
}

/** The inbox. Newest first. */
export async function listEnquiries(limit = 200): Promise<StoredEnquiry[]> {
  if (driver === "local") {
    return read((snapshot) => snapshot.enquiries.filter((e) => !e.deletedAt).slice(0, limit));
  }

  const rows = await readWithRetry<Row[]>(
    "enquiries",
    () =>
      supabase()
        .from("enquiries")
        .select("*")
        .is("deleted_at", null)
        .order("received_at", { ascending: false })
        .limit(limit),
    [],
  );
  return rows.map(toEnquiry);
}

/** Archived rows only, newest first. The recycle bin behind the admin filter. */
export async function listArchivedEnquiries(limit = 200): Promise<StoredEnquiry[]> {
  if (driver === "local") {
    return read((snapshot) => snapshot.enquiries.filter((e) => e.deletedAt).slice(0, limit));
  }

  const rows = await readWithRetry<Row[]>(
    "archived enquiries",
    () =>
      supabase()
        .from("enquiries")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false })
        .limit(limit),
    [],
  );
  return rows.map(toEnquiry);
}

export async function getEnquiry(reference: string): Promise<StoredEnquiry | null> {
  if (driver === "local") {
    return read((snapshot) => snapshot.enquiries.find((e) => e.reference === reference) ?? null);
  }

  const { data, error } = await supabase()
    .from("enquiries")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) throw new Error(`Could not read the enquiry: ${error.message}`);
  return data ? toEnquiry(data as Row) : null;
}

export async function updateEnquiry(
  reference: string,
  patch: Partial<Pick<StoredEnquiry, "status" | "assignedTo">>,
): Promise<void> {
  if (driver === "local") {
    await mutate((snapshot) => {
      const entry = snapshot.enquiries.find((e) => e.reference === reference);
      if (entry) Object.assign(entry, patch);
    });
    return;
  }

  const { error } = await supabase()
    .from("enquiries")
    .update({
      ...(patch.status ? { status: patch.status } : {}),
      ...("assignedTo" in patch ? { assigned_to: patch.assignedTo } : {}),
    })
    .eq("reference", reference);

  if (error) throw new Error(`Could not update the enquiry: ${error.message}`);
}

/**
 * Archive, never delete.
 *
 * This row is the only record that a builder asked for a crew or that a worker
 * registered. There is no undo on a Postgres delete and no point-in-time
 * recovery on Supabase's free plan, and a row on this table was destroyed by
 * accident once already on this project. So "delete" in the admin stamps
 * deleted_at, the row stays, and restoreEnquiry brings it back.
 *
 * Permanent removal is a deliberate act performed against the database with
 * the retention query at the foot of supabase/schema.sql, after a backup. It
 * is not something a mis-click in a browser can do.
 */
export async function archiveEnquiry(reference: string): Promise<void> {
  const deletedAt = new Date().toISOString();

  if (driver === "local") {
    await mutate((snapshot) => {
      const entry = snapshot.enquiries.find((e) => e.reference === reference);
      if (entry) entry.deletedAt = deletedAt;
    });
    return;
  }

  const { error } = await supabase()
    .from("enquiries")
    .update({ deleted_at: deletedAt })
    .eq("reference", reference);

  if (error) throw new Error(`Could not archive the enquiry: ${error.message}`);
}

export async function restoreEnquiry(reference: string): Promise<void> {
  if (driver === "local") {
    await mutate((snapshot) => {
      const entry = snapshot.enquiries.find((e) => e.reference === reference);
      if (entry) entry.deletedAt = null;
    });
    return;
  }

  const { error } = await supabase()
    .from("enquiries")
    .update({ deleted_at: null })
    .eq("reference", reference);

  if (error) throw new Error(`Could not restore the enquiry: ${error.message}`);
}

type Row = {
  reference: string;
  kind: StoredEnquiry["kind"];
  received_at: string;
  fields: Record<string, string | string[]>;
  attachments: string[] | null;
  status: StoredEnquiry["status"];
  assigned_to: string | null;
  deleted_at: string | null;
};

const toEnquiry = (row: Row): StoredEnquiry => ({
  reference: row.reference,
  kind: row.kind,
  receivedAt: row.received_at,
  fields: row.fields,
  attachments: row.attachments ?? [],
  status: row.status,
  assignedTo: row.assigned_to,
  deletedAt: row.deleted_at,
});
