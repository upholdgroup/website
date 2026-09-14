import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          /*
            Two years, subdomains included. The admin session cookie is the
            thing this protects: without HSTS a first request over plain HTTP
            can be intercepted before the redirect to HTTPS ever happens.

            Only add `preload` once you are certain every subdomain will serve
            HTTPS forever, including ones that do not exist yet. Getting off
            the preload list takes months.
          */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          /*
            This site asks for none of these. Denying them means a compromised
            third-party script cannot ask on our behalf either.
          */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
