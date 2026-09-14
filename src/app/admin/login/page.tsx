import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { FirstAccountForm } from "@/components/admin/FirstAccountForm";
import { SignInForm } from "@/components/admin/SignInForm";
import { adminConfigured, bootstrapConfigured, verifySession } from "@/lib/auth";
import { countUsers } from "@/lib/db/users";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await verifySession()) redirect("/admin/jobs");

  if (!adminConfigured) {
    return (
      <AuthCard title="Admin is not configured">
        <p className="text-[15px] leading-[1.6] text-accent-press">
          Set <code>ADMIN_SESSION_SECRET</code> and <code>ADMIN_EMAILS</code>, then reload.
        </p>
      </AuthCard>
    );
  }

  // The first account can only be claimed while the table is empty, and only
  // by an address already named in ADMIN_EMAILS.
  if ((await countUsers()) === 0) {
    return bootstrapConfigured ? (
      <AuthCard
        title="Create the first account"
        lead="No hire desk accounts exist yet. Create yours, then turn on two step authentication on the next screen."
      >
        <FirstAccountForm />
      </AuthCard>
    ) : (
      <AuthCard title="No accounts, and no way to make one">
        <p className="text-[15px] leading-[1.6] text-accent-press">
          Set <code>ADMIN_EMAILS</code> to the address that should own the first account, then
          reload.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Sign in"
      lead="Your email and password, then the six digit code from your authenticator app."
    >
      <SignInForm />
    </AuthCard>
  );
}
