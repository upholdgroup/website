import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { currentUser } from "@/lib/permissions";

export const metadata = { title: "Set your password", robots: { index: false, follow: false } };

export default async function PasswordPage() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");

  return (
    <AuthCard
      eyebrow={user.mustChangePassword ? "One more step" : "Your account"}
      title={user.mustChangePassword ? "Choose your password" : "Change your password"}
      lead={
        user.mustChangePassword
          ? "You signed in with a temporary password an admin created. Replace it now and it stops working."
          : "Pick something you do not use anywhere else."
      }
    >
      <PasswordForm />
    </AuthCard>
  );
}
