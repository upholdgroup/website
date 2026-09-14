import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { CodeForm } from "@/components/admin/CodeForm";
import { readPending, verifySession } from "@/lib/auth";
import { getUser } from "@/lib/db/users";

export const metadata = { title: "Two step", robots: { index: false, follow: false } };

export default async function CodePage() {
  if (await verifySession()) redirect("/admin/jobs");

  const email = await readPending();
  if (!email) redirect("/admin/login");

  const user = await getUser(email);
  if (!user?.totpEnabled) redirect("/admin/login/enrol");

  return (
    <AuthCard
      eyebrow="Step 2 of 2"
      title="Two step"
      lead={
        <>
          Open your authenticator app and enter the current code for{" "}
          <strong className="text-ink">{email}</strong>.
        </>
      }
    >
      <CodeForm mode="sign-in" />
    </AuthCard>
  );
}
