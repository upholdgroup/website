import { AddUserForm } from "@/components/admin/AddUserForm";
import { changeRole, removeUser, resetSecondFactor } from "@/app/admin/people-actions";
import { Container } from "@/components/ui/Section";
import { listUsers } from "@/lib/db/users";
import { requireAdmin } from "@/lib/permissions";

export const metadata = { title: "People", robots: { index: false, follow: false } };

const MESSAGES: Record<string, string> = {
  "self-demote": "You cannot take your own admin access away. Ask another admin.",
  "self-remove": "You cannot remove your own account.",
  "last-admin": "That is the last admin. Promote someone else first.",
};

export default async function PeoplePage({ searchParams }: PageProps<"/admin/people">) {
  const actor = await requireAdmin();
  const params = await searchParams;

  const created = String(params.created ?? "");
  const password = String(params.password ?? "");
  const error = MESSAGES[String(params.error ?? "")];
  const notice =
    (params.updated && `Updated ${params.updated}.`) ||
    (params.removed && `Removed ${params.removed}.`) ||
    (params.reset && `${params.reset} will set up a new authenticator at their next sign in.`);

  const people = await listUsers();

  return (
    <Container>
      <div className="py-10 md:py-14">
        <h1 className="text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[38px]">
          People
        </h1>
        <p className="mt-2 text-[15px] text-ink-70">
          {people.length} {people.length === 1 ? "account" : "accounts"} on the hire desk
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-input bg-accent-tint p-4 text-[15px] text-accent-press">
            {error}
          </p>
        )}
        {notice && <p className="mt-6 rounded-input bg-surface-1 p-4 text-[15px]">{String(notice)}</p>}

        {created && password && (
          <div className="mt-6 rounded-card bg-ink p-6 text-white md:p-7">
            <p className="eyebrow text-accent">Shown once</p>
            <h2 className="mt-3 text-[20px] font-medium tracking-[-0.02em]">
              Temporary password for {created}
            </h2>
            <p className="mt-4 rounded-input bg-white/10 px-4 py-3 text-[18px] font-semibold tracking-[0.06em]">
              {password}
            </p>
            <p className="mt-4 max-w-[62ch] text-[14px] leading-[1.6] text-on-ink-60">
              Send it to them by a channel you trust, not by email if you can avoid it. They have
              to choose their own password and set up an authenticator the first time they sign
              in, so this one stops working immediately after.
            </p>
          </div>
        )}

        <ul className="mt-9 flex flex-col gap-3">
          {people.map((person) => (
            <li key={person.email} className="rounded-media bg-surface-1 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold">
                    {person.email}
                    {person.email === actor.email && <span className="text-ink-45"> (you)</span>}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-45">
                    {person.role === "admin" ? "Admin" : "Recruiter"}
                    {" · "}
                    {person.totpEnabled ? "Two step on" : "Two step not set up"}
                    {person.mustChangePassword && " · Temporary password"}
                    {person.lastLoginAt &&
                      ` · Last in ${new Date(person.lastLoginAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                      })}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <form action={changeRole}>
                    <input type="hidden" name="email" value={person.email} />
                    <input
                      type="hidden"
                      name="role"
                      value={person.role === "admin" ? "manager" : "admin"}
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] transition-colors duration-150 hover:border-ink"
                    >
                      Make {person.role === "admin" ? "recruiter" : "admin"}
                    </button>
                  </form>

                  {person.totpEnabled && (
                    <form action={resetSecondFactor}>
                      <input type="hidden" name="email" value={person.email} />
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] transition-colors duration-150 hover:border-ink"
                      >
                        Reset two step
                      </button>
                    </form>
                  )}

                  {person.email !== actor.email && (
                    <form action={removeUser}>
                      <input type="hidden" name="email" value={person.email} />
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center rounded-full px-4 text-[14px] text-accent-press transition-colors duration-150 hover:underline"
                      >
                        Remove
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-10 max-w-[520px] rounded-card bg-surface-1 p-6 md:p-7">
          <h2 className="text-[20px] font-medium tracking-[-0.02em]">Add someone</h2>
          <p className="mt-2 text-[15px] leading-[1.6] text-ink-70">
            They get a temporary password, shown once here. It has to be replaced the first time
            they sign in.
          </p>
          <div className="mt-6">
            <AddUserForm />
          </div>
        </section>
      </div>
    </Container>
  );
}
