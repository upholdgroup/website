/**
 * Shared between the admin server actions and the admin forms.
 *
 * Separate from `src/app/admin/actions.ts` for the same reason as
 * `src/lib/form-state.ts`: a `"use server"` module may only export async
 * functions, so exporting the initial state object from there fails the build
 * with "A 'use server' file can only export async functions".
 */
export type AdminState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string> }
  | { status: "sent" };

export const idleAdminState: AdminState = { status: "idle" };
