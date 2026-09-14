import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/JobForm";
import { Container } from "@/components/ui/Section";
import { requireUser } from "@/lib/permissions";
import { regions } from "@/lib/content/regions";
import { trades } from "@/lib/content/trades";
import { getJobById } from "@/lib/db/jobs";

export const metadata = { title: "Edit role", robots: { index: false, follow: false } };

export default async function EditJob({ params }: PageProps<"/admin/jobs/[id]">) {
  await requireUser();

  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <Container>
      <div className="mx-auto max-w-[720px] py-10 md:py-14">
        <p className="eyebrow text-ink-45">{job.id}</p>
        <h1 className="mt-3 text-[30px] leading-[1.05] font-bold tracking-[-0.03em] md:text-[36px]">
          Edit role
        </h1>

        <div className="mt-9 rounded-card bg-surface-1 p-6 md:p-8">
          <JobForm job={job} trades={trades} regions={regions} />
        </div>
      </div>
    </Container>
  );
}
