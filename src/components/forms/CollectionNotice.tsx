import Link from "next/link";
import { site } from "@/lib/site";

/**
 * The notice required at the point of collection by APP 5.
 *
 * It has to appear at or before the moment information is collected, not
 * buried in a policy nobody opens, which is why it sits directly above the
 * submit button on both forms rather than in the footer.
 */
export function CollectionNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[62ch] text-[13px] leading-[1.6] text-ink-45">
      {children}{" "}
      <Link
        href="/privacy"
        className="text-ink-70 underline decoration-line-strong underline-offset-2 transition-colors duration-150 hover:text-accent hover:decoration-accent"
      >
        Our privacy policy
      </Link>{" "}
      explains how to see, correct or delete what we hold, and how to complain. Version{" "}
      {site.privacy.version}.
    </p>
  );
}
