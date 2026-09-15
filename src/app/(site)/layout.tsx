import { MobileActionBar } from "@/components/MobileActionBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * The public site's chrome. It lives in a route group so `/admin` can render
 * without it — the fixed "Request labour" bar would otherwise sit on top of
 * the admin controls, and the visitor nav would be nonsense to a consultant.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main id="main" data-frame>{children}</main>
      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
