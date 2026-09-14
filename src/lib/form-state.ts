/**
 * Shared between the server actions and the client forms.
 *
 * It lives outside `app/actions.ts` because a `"use server"` module may only
 * export async functions — exporting the initial state object from there fails
 * at runtime with "A 'use server' file can only export async functions".
 */
export type FormState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string> }
  | {
      status: "success";
      reference: string;
      consultant: string;
      callback: string;
    };

export const initialFormState: FormState = { status: "idle" };
