import type { ReactNode } from "react";
import { Container } from "@/components/ui/Section";

export function AuthCard({
  eyebrow = "Uphold hire desk",
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Container>
      <div className="mx-auto max-w-[460px] py-14 md:py-20">
        <div className="animate-rise rounded-card bg-surface-1 p-7 md:p-8">
          <p className="eyebrow text-accent-press">{eyebrow}</p>
          <h1 className="mt-3 text-[28px] leading-[1.1] font-bold tracking-[-0.03em]">{title}</h1>
          {lead && <div className="mt-4 text-[15px] leading-[1.6] text-ink-70">{lead}</div>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </Container>
  );
}
