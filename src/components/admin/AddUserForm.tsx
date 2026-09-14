"use client";

import { useActionState } from "react";
import { addUser } from "@/app/admin/people-actions";
import { ChipInput, Field, inputClass } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { idleAdminState } from "@/lib/admin-state";

export function AddUserForm() {
  const [state, formAction, pending] = useActionState(addUser, idleAdminState);
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Work email" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" required className={inputClass(errors.email)} />
      </Field>

      <Field
        label="Permission level"
        htmlFor="role-manager"
        error={errors.role}
        hint="Recruiters post and edit roles and work the enquiry inbox. Admins also manage people and can delete things."
      >
        <div className="flex flex-wrap gap-2">
          <ChipInput name="role" type="radio" value="manager" label="Recruiter" defaultChecked />
          <ChipInput name="role" type="radio" value="admin" label="Admin" />
        </div>
      </Field>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating…" : "Create the account"}
      </Button>
    </form>
  );
}
