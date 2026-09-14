import Link from "next/link";
import { signOut } from "./auth-actions";
import { driver } from "@/lib/db/client";
import { emailConfigured } from "@/lib/email";
import { Container } from "@/components/ui/Section";
import { currentUser, isAdmin } from "@/lib/permissions";

export const metadata = {
  title: "Hire desk admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Not `requireUser()`: the login and setup screens live under this layout
  // too, and must render for someone who is not signed in yet.
  const user = await currentUser();

  return (
    <div className="min-h-dvh bg-surface-2">
      <header className="border-b border-line bg-surface-1">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href={user ? "/admin" : "/admin/login"}
              className="inline-flex min-h-11 items-center gap-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uphold-mark.svg" alt="" width={38} height={26} className="h-[26px] w-auto shrink-0" />
              <span className="text-[16px] font-bold tracking-[-0.03em]">Hire desk</span>
            </Link>

            {user && (
              <div className="flex items-center gap-4">
                <span className="hidden text-[14px] text-ink-45 sm:inline">
                  {user.email}
                  <span className="text-ink-45"> · {user.role === "admin" ? "Admin" : "Recruiter"}</span>
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-[14px] transition-colors duration-150 hover:border-ink"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Only shown once signed in and past the temporary password step, so
          the nav never appears on a screen it cannot take you away from. */}
      {user && !user.mustChangePassword && (
        <nav aria-label="Hire desk" className="border-b border-line bg-surface-1">
          <Container>
            <ul className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { href: "/admin", label: "Board" },
                { href: "/admin/jobs", label: "Roles" },
                { href: "/admin/enquiries", label: "Enquiries" },
                ...(isAdmin(user) ? [{ href: "/admin/people", label: "People" }] : []),
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-full px-4 text-[14px] text-ink-70 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}

      {/* Never let anyone believe a job posted here will survive a deploy. */}
      {(driver === "local" || !emailConfigured) && (
        <div className="border-b border-accent/30 bg-accent-tint">
          <Container>
            <p className="py-3 text-[13px] leading-[1.5] text-accent-press">
              {driver === "local" && (
                <>
                  <strong>Local JSON store.</strong> Roles are written to <code>.data/uphold.json</code> and
                  will not survive a deploy, set <code>SUPABASE_URL</code> and{" "}
                  <code>SUPABASE_SECRET_KEY</code> before production.{" "}
                </>
              )}
              {!emailConfigured && (
                <>
                  <strong>Email is not sending.</strong> Set <code>RESEND_API_KEY</code>; until then
                  messages are written to the server log.
                </>
              )}
            </p>
          </Container>
        </div>
      )}

      <main id="main">{children}</main>
    </div>
  );
}
