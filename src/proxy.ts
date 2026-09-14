import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "uphold_admin";

/**
 * Optimistic gate on /admin — cookie present or you go to the login page.
 *
 * It deliberately does not verify the signature: Proxy runs on the edge
 * runtime without node:crypto, and the Next.js authentication guide is clear
 * that this should not be the only line of defence anyway. The real check is
 * `verifySession()` in src/lib/auth.ts, called inside every admin page and
 * every admin action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!request.cookies.get(SESSION_COOKIE)) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
