"use client";

import { useActionState } from "react";
import { confirmCode, confirmEnrolment } from "@/app/admin/auth-actions";
import { Field, inputClass } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { idleAdminState } from "@/lib/admin-state";

/**
 * One six digit field, used both to finish enrolment and to sign in. At
 * enrolment it only accepts a code; at sign in a recovery code works too.
 */
export function CodeForm({ mode }: { mode: "sign-in" | "enrol" }) {
  const [state, formAction, pending] = useActionState(
    mode === "enrol" ? confirmEnrolment : confirmCode,
    idleAdminState,
  );
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field
        label={mode === "enrol" ? "Code from the app" : "Six digit code"}
        htmlFor="code"
        error={errors.code}
        hint={mode === "sign-in" ? "Lost your phone? Enter one of your recovery codes." : undefined}
      >
        <input
          id="code"
          name="code"
          type="text"
          inputMode={mode === "enrol" ? "numeric" : "text"}
          autoComplete="one-time-code"
          autoFocus
          required
          placeholder="000000"
          className={`${inputClass(errors.code)} text-center text-[22px] tracking-[0.3em]`}
        />
      </Field>

      {errors.form && (
        <p role="alert" className="text-[14px] leading-[1.6] text-accent-press">
          {errors.form}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Checking…" : mode === "enrol" ? "Turn on two step" : "Sign in"}
      </Button>
    </form>
  );
}
