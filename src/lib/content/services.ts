import type { Faq } from "./trades";

export type Service = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  h1: string;
  intro: string;
  /** What you get, in the order a host asks about it. */
  points: { title: string; body: string }[];
  bestFor: string[];
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: "casual-labour-hire",
    name: "Casual & short-notice labour hire",
    short: "Casual",
    blurb:
      "Workers on site today or tomorrow morning. You call the numbers up and down week by week; we carry the employment.",
    h1: "Casual labour hire, Sydney",
    intro:
      "Casual labour hire is what most Greater Sydney builders call us for first: a crew short before a pour, a resignation on a Friday, a programme that pulled forward. We are the legal employer, so wages, superannuation, workers compensation and payroll tax sit with us. Tell us the roles and the start time and most Sydney requests are filled within four hours.",
    points: [
      { title: "Filled in four hours", body: "During hire-desk hours, most Greater Sydney casual requests are filled within four hours. If we cannot fill it we tell you inside the hour instead of letting you find out at the gate." },
      { title: "Named workers, verified before they arrive", body: "You get names, ticket classes and expiry dates in writing before anyone is confirmed. Nobody arrives on your site as a surprise." },
      { title: "Scale down as freely as up", body: "Casual means casual. Stand a worker down at the end of a shift with no notice period and no termination exposure, the employment relationship is ours, not yours." },
      { title: "One weekly invoice", body: "Digital timesheets approved by your supervisor, consolidated into a single weekly invoice no matter how many workers or sites you ran." },
    ],
    bestFor: ["Cover before a pour or a deadline", "Absence and resignation cover", "Peak weeks on a fixed programme", "Trialling a worker before a permanent offer"],
    faqs: [
      {
        q: "How much notice do you need for casual labour hire?",
        a: "None in principle. We fill same-day requests every week, but a booking placed the afternoon before is what makes a reliable 6am start. For hoist operators, licensed scaffolders and specific machine classes, a week's notice materially improves who we can send.",
      },
      {
        q: "Who employs the worker?",
        a: "We do. Uphold Group is the legal employer, which means award or EBA wages, superannuation, payroll tax, workers compensation and portable long service leave contributions are our obligation. On a labour hire engagement you direct the work on site and the employment sits with us. Where we are contracted to deliver a scope instead, we supervise our own crew and that is quoted separately.",
      },
      {
        q: "What happens if a casual worker does not turn up?",
        a: "You get a replacement within four hours, at no additional charge, and we tell you as soon as we know rather than when you notice. Non-attendance is tracked against the worker and repeat offenders come off the books.",
      },
    ],
  },
  {
    slug: "contract-crews",
    name: "Contract project crews",
    short: "Contract",
    blurb:
      "The same named crew for the length of a package, a level cycle, a subdivision stage, a fitout. Rostered for continuity, not availability.",
    h1: "Contract labour hire crews, Sydney",
    intro:
      "Contract crews are for work with a known duration: a level cycle, a subdivision stage, a fitout programme. We assemble a named Sydney crew with a leading hand, roster them for the whole package and hold the same faces on your site so your supervisor stops re-inducting strangers. Requests are quoted in writing the same day, per classification.",
    points: [
      { title: "A crew, not a series of individuals", body: "Four to twenty workers with a leading hand who has run the same system before, sent to you as one working unit." },
      { title: "Rostered for the package", body: "The same names for the duration. Continuity is what makes week six faster than week one, and it is the whole point of a contract engagement." },
      { title: "Programme-aware resourcing", body: "Give us the programme and we ramp with it, more labourers during strip-out, more carpenters through the cycle, fewer through the wet weeks." },
      { title: "One point of contact", body: "A named consultant who knows your site, your EBA and your supervisor, reachable from 5:30am." },
    ],
    bestFor: ["Level cycles on high-rise residential", "Subdivision and civil packages", "Commercial fitout programmes", "Remedial works with a fixed access window"],
    faqs: [
      {
        q: "How long is a typical contract engagement?",
        a: "Most run between three and fourteen months. Anything under about six weeks is usually better served as casual hire, because the work of assembling a matched crew does not pay back over a shorter run.",
      },
      {
        q: "Can we interview the crew before they start?",
        a: "Yes. For contract crews we expect it. You get names, tickets and reference notes in advance, and a leading hand introduction before the crew starts is standard rather than something you have to ask for.",
      },
      {
        q: "What happens if the programme slips?",
        a: "Tell us early and we hold or redeploy the crew. Because we are the employer, a slip is a rostering problem for us rather than a redundancy problem for you, but a crew held idle is a crew we may lose to another site, so the earlier the call the better the outcome.",
      },
    ],
  },
  {
    slug: "permanent-recruitment",
    name: "Permanent recruitment",
    short: "Permanent",
    blurb:
      "Direct hires for site-based and staff roles, leading hands, supervisors, foremen, project support. Shortlists drawn from workers we have already placed.",
    h1: "Permanent construction recruitment, Sydney",
    intro:
      "Permanent recruitment for Sydney construction: leading hands, supervisors, foremen, site administrators and project support. Our best candidates are people we have already placed on Sydney sites and watched work, which is a materially better signal than a résumé. Briefs are taken in person, shortlists are short, and every candidate is reference-checked with their last two supervisors.",
    points: [
      { title: "Candidates we have seen work", body: "The strongest shortlists come from our own labour hire pool, people whose attendance, attitude and competence we have observed on Sydney sites for months." },
      { title: "Short shortlists", body: "Three to five candidates who genuinely fit the brief, not a wall of CVs for you to filter. If we cannot fill the brief we say so." },
      { title: "Try before you commit", body: "Engage a worker casually first and convert. After 500 hours on your site there is no conversion fee." },
      { title: "Verified before they meet you", body: "Right to work, licences, qualifications and two supervisor references checked before a candidate reaches your shortlist." },
    ],
    bestFor: ["Leading hands and site supervisors", "Foremen and project managers", "Site administrators and document controllers", "Converting a proven labour hire worker"],
    faqs: [
      {
        q: "Do you charge a conversion fee if we hire a labour hire worker permanently?",
        a: "Not after 500 hours on your site. Below that a pro-rata conversion fee applies, disclosed in your engagement terms before you book, never discovered afterwards. We would rather you kept a good worker than left them casual to avoid a fee.",
      },
      {
        q: "What is your replacement guarantee on a permanent placement?",
        a: "If a permanent placement leaves or is terminated within the guarantee period set out in your terms, we replace them once at no additional fee. The period varies by role seniority and is agreed in writing before we start the search.",
      },
      {
        q: "How long does a permanent search take?",
        a: "Site-based roles typically shortlist within five to ten working days, because the candidates often already work for us. Senior staff roles take longer, and we will tell you at the brief if the market for that role in Sydney is thin rather than discover it three weeks in.",
      },
    ],
  },
  {
    slug: "payroll-on-hire",
    name: "Payroll & on-hire administration",
    short: "Payroll",
    blurb:
      "You found the worker; we employ them. Award interpretation, super, workers compensation, portable LSL and one weekly invoice.",
    h1: "Payroll & on-hire employment services, Sydney",
    intro:
      "If you have already found the worker, we can carry the employment. Uphold Group becomes the legal employer for workers you nominate, handling award or EBA interpretation, superannuation, payroll tax, icare workers compensation, portable long service leave and Fair Work obligations, and bills you one consolidated weekly invoice for Greater Sydney sites.",
    points: [
      { title: "We are the employer of record", body: "Wages, entitlements, superannuation, workers compensation and Fair Work obligations sit with us, with the worker under your day-to-day direction on site." },
      { title: "Award and EBA interpretation", body: "Classifications, allowances, penalties and RDO arrangements applied correctly, so you are not the one interpreting an enterprise agreement at 4pm on a Friday." },
      { title: "Portable long service leave", body: "NSW portable long service leave contributions registered and paid, and workers' service correctly recorded." },
      { title: "One weekly invoice", body: "Digital timesheets, supervisor approval, one invoice: the same billing rhythm as the rest of your Uphold engagement." },
    ],
    bestFor: ["Referred or returning workers you already know", "Workers you cannot put on your own books yet", "Short project engagements with award complexity", "Consolidating multiple small engagements into one invoice"],
    faqs: [
      {
        q: "Can you payroll a worker we found ourselves?",
        a: "Yes, that is what this service is. You nominate the worker and we complete the same verification we apply to our own pool: right to work, licences, references and induction. If a nominated worker fails verification we tell you why rather than quietly place them.",
      },
      {
        q: "Does the worker have to be verified even though we know them?",
        a: "Yes. Because we become the legal employer, we carry the workers compensation and WHS exposure, so the White Card, high-risk licences and right-to-work checks are non-negotiable. It usually takes a day.",
      },
      {
        q: "How is payroll on-hire charged?",
        a: "As a single hourly charge rate per classification, quoted in writing the same day you ask, covering wages, statutory on-costs, insurance and administration. As with everything else here, we do not publish rates. They depend on the classification, the agreement and the shift pattern.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
