export type EnquiryKind = "host-request" | "worker-registration";

export type StoredEnquiry = {
  reference: string;
  kind: EnquiryKind;
  receivedAt: string;
  fields: Record<string, string | string[]>;
  /** Filenames only. Ticket photos are not stored anywhere yet. */
  attachments: string[];
  status: "new" | "assigned" | "closed";
  assignedTo: string | null;
  /**
   * Set when the row is archived in the admin. Nothing in the app hard-deletes
   * an enquiry; see archiveEnquiry in src/lib/db/enquiries.ts.
   */
  deletedAt?: string | null;
};

/**
 * `admin` can do anything, including managing people and deleting things.
 * `manager` is the recruiter seat: read and write roles and enquiries, but no
 * user management and nothing destructive.
 */
export type Role = "admin" | "manager";

export type AdminUser = {
  email: string;
  role: Role;
  /** Set when an admin creates the account with a temporary password. */
  mustChangePassword: boolean;
  passwordHash: string;
  /** Null until the account finishes enrolling an authenticator. */
  totpSecret: string | null;
  totpEnabled: boolean;
  /** Hashed, like passwords. Each one is removed as it is used. */
  recoveryCodes: string[];
  failedAttempts: number;
  /** ISO timestamp, or null when not locked. */
  lockedUntil: string | null;
  createdAt: string;
  lastLoginAt: string | null;
};
