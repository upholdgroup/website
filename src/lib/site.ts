export const site = {
  name: "Uphold Group",
  wordmark: { top: "UPHOLD", bottom: "GROUP" },
  headline: "We are building something for you",
  subline: "Our new home is under construction. It won't be long.",
  email: "hello@upholdgroup.com",
  description:
    "Uphold Group is building a new home on the web. Our site is under construction — reach us in the meantime.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.upholdgroup.com",
} as const;
