/**
 * What we commit to on every booking.
 *
 * This replaced a set of six testimonials that were invented: named people,
 * named suburbs, dated quotes, none of them real. Fabricated testimonials are
 * specifically named in the Australian Consumer Law, s29(1)(e), and on a site
 * whose whole argument is that it sends its compliance evidence unprompted,
 * they were the one thing on the page that could not be stood behind.
 *
 * Every line below is a claim this site already makes somewhere else: in the
 * compliance FAQs, the inclusions list, or the hiring steps. Nothing here is
 * new, and nothing here is a voice. If a line stops being true, it comes out.
 *
 * `detail` carries the specific: a number, a register, an obligation. A
 * commitment without one is marketing.
 */
export type Commitment = {
  title: string;
  detail: string;
  /** Where the detail is set out in full. Keeps each claim checkable. */
  href: string;
  linkLabel: string;
};

export const commitments: Commitment[] = [
  {
    title: "A replacement within four hours",
    detail:
      "If a worker does not turn up, or is not right for your site, we replace them within four hours and you are not charged for the swap.",
    href: "/labour-hire",
    linkLabel: "How hiring works",
  },
  {
    title: "Tickets checked against the register",
    detail:
      "White Cards and high-risk licences are verified against the SafeWork NSW register rather than sighted. Expiries are tracked, and a worker is stood down before a ticket lapses.",
    href: "/compliance",
    linkLabel: "Our compliance pack",
  },
  {
    title: "One rate, in writing, the same day",
    detail:
      "A single all-inclusive hourly rate per classification, covering wages, statutory on-costs, insurance, PPE and the replacement guarantee. No sign-on fee, no charge for replacements.",
    href: "/request-labour",
    linkLabel: "Ask for a written quote",
  },
  {
    title: "Interviewed before they are offered a shift",
    detail:
      "In person, on site or by video, with a VEVO right-to-work check and references from the last two supervisors. Nobody is sent to a site we have not met.",
    href: "/compliance",
    linkLabel: "How we verify",
  },
  {
    title: "We are the legal employer",
    detail:
      "Workers are paid weekly, superannuation is paid at the legislated rate, and NSW portable long service leave is registered on their behalf. That obligation is ours, not yours.",
    href: "/workers",
    linkLabel: "For workers",
  },
  {
    title: "Permanent after 500 hours, no fee",
    detail:
      "Take a worker on directly after 500 hours on your site and there is no conversion fee. Below that a pro-rata fee applies, disclosed before you book rather than after.",
    href: "/compliance",
    linkLabel: "Conversion terms",
  },
];
