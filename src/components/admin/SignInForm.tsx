"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/auth-actions";
import { Field, inputClass } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { idleAdminState } from "@/lib/admin-state";

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, idleAdminState);
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass()}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass()}
        />
      </Field>

      {errors.form && (
        <p role="alert" className="text-[14px] leading-[1.6] text-accent-press">
          {errors.form}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Checking…" : "Continue"}
      </Button>
    </form>
  );
}
