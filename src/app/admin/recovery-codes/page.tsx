import Link from "next/link";
import { AuthCard } from "@/components/admin/AuthCard";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Recovery codes", robots: { index: false, follow: false } };

export default async function RecoveryCodesPage({ searchParams }: PageProps<"/admin/recovery-codes">) {
  if (!(await verifySession())) redirect("/admin/login");

  const { codes } = await searchParams;
  const list = String(codes ?? "").split(",").filter(Boolean);
  if (list.length === 0) {
    return (
      <AuthCard title="Nothing to show">
        <p className="text-[15px] leading-[1.6] text-ink-70">
          Recovery codes are shown once, at the moment they are created. If you no longer have
          yours, sign in and turn two step off and on again to get a new set.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-white"
        >
          Go to the hire desk
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="Save these now"
      title="Recovery codes"
      lead="Each one signs you in once if you lose your phone. They are not shown again and we only keep hashes, so print them or put them in a password manager before you continue."
    >
      <ul className="grid grid-cols-2 gap-2 rounded-input border border-line bg-surface-2 p-5">
        {list.map((code) => (
          <li key={code} className="text-[15px] font-semibold tracking-[0.08em]">
            {code}
          </li>
        ))}
      </ul>

      <Link
        href="/admin"
        className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-full bg-ink text-[16px] font-medium text-white transition-colors duration-150 hover:bg-ink/85"
      >
        I have saved them
      </Link>
    </AuthCard>
  );
}
