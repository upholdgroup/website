"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/app/admin/people-actions";
import { Field, inputClass } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { idleAdminState } from "@/lib/admin-state";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPassword, idleAdminState);
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field
        label="New password"
        htmlFor="password"
        error={errors.password}
        hint="At least 12 characters, with upper case, lower case and a number."
      >
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass(errors.password)}
        />
      </Field>

      <Field label="Confirm password" htmlFor="confirm" error={errors.confirm}>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass(errors.confirm)}
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Set my password"}
      </Button>
    </form>
  );
}
