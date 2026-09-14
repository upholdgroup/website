"use client";

import { useActionState } from "react";
import { createFirstAccount } from "@/app/admin/auth-actions";
import { Field, inputClass } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { idleAdminState } from "@/lib/admin-state";

export function FirstAccountForm() {
  const [state, formAction, pending] = useActionState(createFirstAccount, idleAdminState);
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field
        label="Email"
        htmlFor="email"
        error={errors.email}
        hint="Must already be listed in ADMIN_EMAILS."
      >
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass(errors.email)}
        />
      </Field>

      <Field
        label="Password"
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

      {errors.form && (
        <p role="alert" className="text-[14px] leading-[1.6] text-accent-press">
          {errors.form}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating…" : "Create the account"}
      </Button>
    </form>
  );
}
