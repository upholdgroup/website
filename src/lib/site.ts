const FALLBACK_URL = "https://www.upholdgroup.com.au";

/**
 * Resolves the canonical origin from the first usable candidate.
 *
 * Environment variables are strings, so a variable that is declared but left
 * blank arrives as `""` rather than `undefined` — `??` would pass that straight
 * to `new URL()` and fail the build. Vercel also supplies its domains without a
 * scheme (`my-app.vercel.app`), so one is added when missing.
 */
export function resolveSiteUrl(
  candidates: readonly (string | undefined)[],
  fallback: string = FALLBACK_URL,
): string {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // Malformed value — try the next candidate rather than break the build.
    }
  }
  return fallback;
}

/**
 * `0481 953 801` → `tel:+61481953801`, so click-to-call works from any handset.
 *
 * The leading zero is a domestic trunk prefix and is dropped once +61 is
 * present: the two are alternatives, never stacked. Write the number the
 * Australian way in `site.phone` and let this do the conversion.
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+61${digits.replace(/^0/, "")}`;
}

/**
 * `0481 953 801` → `+61 481 953 801`.
 *
 * Structured data wants a number a machine anywhere can dial, so schema.org
 * gets the international form while the pages show the local one.
 */
export function phoneInternational(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  // Mobiles group 3-3-3 after the prefix; 1300/1800 numbers group 4-3-3.
  const grouped =
    digits.length === 9
      ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      : `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `+61 ${grouped}`;
}

export const site = {
  name: "Uphold Group",
  legalName: "Uphold Group Pty Ltd",
  /**
   * `lockup` is the short line that sits under the wordmark in the header and
   * the footer. It has to be about as wide as "UPHOLD GROUP." to look like one
   * unit, so it stays much shorter than `tagline`, which is the full sentence
   * used in prose and metadata.
   */
  wordmark: { text: "UPHOLD GROUP", dot: ".", lockup: "Contracting & labour hire" },
  tagline: "Construction contracting, labour hire & recruitment, Greater Sydney.",
  description:
    "Sydney construction contracting, labour hire and recruitment. Ticketed labourers, trades and civil crews for builders across Greater Sydney, plus site cleaning and licensed security, on a casual, contract or permanent basis. Most requests filled within four hours.",

  /*
    Written the way it is dialled in Australia, with the leading zero and no
    country code. `telHref` turns it into tel:+61481953801 for the link.

    Do not write it as "+61 0481 …": the +61 and the 0 are alternatives, never
    stacked, and that form produces tel:+61610481953801, which does not dial.

    Interim mobile. When the business number arrives, change this one line and
    the header, footer, contact page, forms, mega menu and the EmploymentAgency
    structured data all follow.
  */
  phone: "0481 953 801",
  /**
   * One inbox for now. They are separate fields so the desk can split host
   * and worker mail later without touching a page: change one line here and
   * the footer, the contact page and the enquiry notifications all follow.
   */
  hireEmail: "admin@upholdgroup.com.au",
  workEmail: "admin@upholdgroup.com.au",
  /**
   * Set this to the real ABN and it reappears in the footer, the contact page,
   * the compliance page and the privacy policy at once. Empty means every one
   * of those places renders without it rather than printing a blank label.
   *
   * It was a placeholder ("12 345 678 901") for a long time, which is worse
   * than nothing: the compliance page tells builders to check the ABN on ABN
   * Lookup against the name on the invoice, and that check would have failed.
   */
  abn: "11 683 688 539",

  /**
   * Privacy Act 1988 (Cth) and the Australian Privacy Principles.
   *
   * APP 1 requires a clearly expressed, up to date policy and a contact point
   * for access, correction and complaints. The version and date are recorded
   * against every enquiry, so if the policy changes you can still say which
   * one a person actually agreed to.
   */
  privacy: {
    version: "1.0",
    effective: "12 September 2026",
    officer: "The Privacy Officer",
    email: "admin@upholdgroup.com.au",
  },

  /**
   * There is no public address, on purpose: this is a service-area business,
   * not a shopfront. Publishing an office nobody staffs is a false
   * representation, and Google's own guidance for service-area businesses is
   * to omit the address rather than list one you do not occupy.
   *
   * `country` survives because the structured data still needs a country for
   * the service area. Everything else about where we are is `serviceArea`.
   */
  country: "AU",
  /** The same country, spelled out. "AU" is for machines, this is for readers. */
  countryName: "Australia",

  /**
   * Where we work today.
   *
   * One place on purpose. The business is NSW registered and crews Greater
   * Sydney now, but "only" is a claim about the future as much as the present,
   * and it was hard-coded into ten pages. Widening the map should be an edit
   * here, not a hunt through the site.
   *
   * `state` is what does not change soon. `area` is what does. `caveat` is the
   * promise that goes with both: we would rather decline on the call than take
   * a booking we cannot fill, and that stays true at any size.
   */
  serviceArea: {
    state: "NSW",
    area: "Greater Sydney",
    /** Eyebrows and chips, where there is room for three or four words. */
    short: "Greater Sydney, NSW",
    caveat:
      "If the site is outside the regions we cover we will tell you on the call rather than take the booking.",
  },

  hours: [
    { label: "Mon–Fri", value: "5:30am – 8:00pm", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "05:30", closes: "20:00" },
    { label: "Sat–Sun", value: "6:00am – 4:00pm", days: ["Saturday", "Sunday"], opens: "06:00", closes: "16:00" },
  ],

  /**
   * Proof chips shown under the hero.
   *
   * Two of these used to be "$20M public liability" and "icare workers comp".
   * Those policies are not in place yet, and a chip is read as a statement of
   * fact by the person deciding whether a crew comes through the gate, so
   * they are gone until they are true. What replaced them is not filler: the
   * employment relationship and the ticket checks are the two things that
   * actually distinguish this from a labour-supply chain, and both are true
   * today. Where the insurance stands is set out on the compliance page.
   */
  proof: [
    "Sydney owned & run",
    "Greater Sydney, NSW",
    "We employ the crew",
    "Tickets verified",
  ],

  url: resolveSiteUrl([
    process.env.NEXT_PUBLIC_SITE_URL,
    // Set automatically by Vercel: the stable production domain, then the
    // per-deployment URL so previews get correct absolute links too.
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ]),
} as const;

export type NavItem = {
  label: string;
  href: string;
  /**
   * Opens the trades and regions panel instead of navigating on a pointer
   * device. `href` is still the honest destination: it is what the row links
   * to on a phone, and what a middle click or a crawler follows.
   */
  mega?: boolean;
};

/**
 * Four items, not five. Trades and Sydney regions used to sit in the top row
 * as two separate links to two index pages; they are now one panel that lists
 * all sixteen leaf pages from every page on the site, which is both a shorter
 * row and far more internal linking than two index links were doing.
 */
export const nav: NavItem[] = [
  { label: "Hire workers", href: "/labour-hire" },
  { label: "Find work", href: "/jobs" },
  { label: "Trades & regions", href: "/trades", mega: true },
  { label: "Compliance", href: "/compliance" },
];
