import { JobForm } from "@/components/admin/JobForm";
import { Container } from "@/components/ui/Section";
import { requireUser } from "@/lib/permissions";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";

export const metadata = { title: "Post a role", robots: { index: false, follow: false } };

export default async function NewJob() {
  await requireUser();

  return (
    <Container>
      <div className="mx-auto max-w-[720px] py-10 md:py-14">
        <h1 className="text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[36px]">
          Post a role
        </h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-ink-70">
          It is on the board, the trade page, the region page and in Google Jobs as soon as you save.
          No rates, they are agreed at interview.
        </p>

        <div className="mt-9 rounded-card bg-surface-1 p-6 md:p-8">
          <JobForm trades={trades} regions={regions} />
        </div>
      </div>
    </Container>
  );
}
