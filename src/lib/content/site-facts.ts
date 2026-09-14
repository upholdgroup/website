import type { Faq } from "./trades";

/** Operational metrics only — fill time, fill rate, bench depth, safety. Never dollars. */
export const stats = [
  { value: "1,240", label: "Sydney workers on the books" },
  { value: "4hrs", label: "Average Sydney fill time" },
  { value: "98.4%", label: "Shifts filled as booked" },
  { value: "0 LTI", label: "Lost-time injuries, 24 months" },
];

/** Replaces any rate table. */
export const inclusions = [
  "Award or EBA wages, allowances and penalties",
  "Superannuation and payroll tax",
  "Workers compensation cover, once our icare policy is active",
  "Portable long service leave contributions",
  "PPE, ticket verification and site induction time",
  "Four-hour replacement guarantee",
];

export const hiringSteps = [
  {
    eyebrow: "01 · SAME DAY",
    title: "Tell us the roles",
    body: "Call, text or send the form: trade, tickets, site address, start time, expected duration. No portal login required.",
  },
  {
    eyebrow: "02 · WITHIN 4 HOURS",
    title: "We match and verify",
    body: "You get named workers with ticket expiries and reference notes, plus a written quote for the crew, before anyone is confirmed.",
  },
  {
    eyebrow: "03 · ON SITE",
    title: "Crew on the tools",
    body: "Digital timesheets approved by your supervisor, one consolidated weekly invoice, and a replacement guaranteed within four hours.",
  },
];

export const workerSteps = [
  {
    eyebrow: "01 · FIVE MINUTES",
    title: "Register from your phone",
    body: "Name, mobile, trade, suburb and the tickets you hold. No CV, no password, no portal. You bring the cards to the interview.",
  },
  {
    eyebrow: "02 · WITHIN 48 HOURS",
    title: "Interview and checks",
    body: "An interview in person, on site or by video, plus a right-to-work check, ticket verification and two supervisor references. Your pay is agreed here.",
  },
  {
    eyebrow: "03 · FIRST SHIFT",
    title: "We text you the details",
    body: "Address, gate, start time, supervisor name and the PPE you need. Digital timesheet in the same thread, and you are paid weekly.",
  },
];

/** Written as standalone paragraphs so they can be lifted whole into search and AI summaries. */
export const complianceFaqs: Faq[] = [
  {
    q: "What compliance cover do you hold in NSW?",
    a: "We would rather be straight about where we are than leave you to ask. Our icare workers compensation policy and public liability cover are being put in place now, and no worker will be placed on a site before the workers compensation policy is active. Fair Work compliance, our WHS management plan, ticket verification against the SafeWork NSW register and right-to-work checks are in force today. Ask for the pack and you get what we hold, with the dates on it.",
  },
  {
    q: "Why don't you publish your rates?",
    a: "Because an honest rate depends on the classification, the site's EBA, shift pattern and duration. A table would mislead you. Tell us the crew and you get a single all-inclusive hourly rate in writing the same day, covering wages, statutory on-costs, insurance, PPE and the replacement guarantee.",
  },
  {
    q: "How do you verify tickets and right to work?",
    a: "An interview in person, on site or by video, a VEVO right-to-work check, White Card and high-risk licence verification against the SafeWork NSW register, plus reference checks with the last two supervisors. Expiries are tracked and workers are stood down before a ticket lapses.",
  },
  {
    q: "Can a labour hire worker become permanent?",
    a: "Yes. After 500 hours on your site there is no conversion fee, and casual conversion obligations are managed by us as the legal employer. Below 500 hours a pro-rata conversion fee applies, disclosed in your engagement terms before you book.",
  },
];

export const workerFaqs: Faq[] = [
  {
    q: "Do I need experience to register?",
    a: "Not for general labouring, but you do need a current SafeWork NSW White Card before you can set foot on a construction site. It is a one-day course and you can start with us the week you finish it. Trade and licensed roles need the relevant qualification or high-risk work licence.",
  },
  {
    q: "How often will I be paid?",
    a: "Weekly, into your account, with superannuation paid at the legislated rate and portable long service leave contributions registered on your behalf. Timesheets are digital and approved by your site supervisor, so there is nothing to chase and nothing to post.",
  },
  {
    q: "How do I find out about shifts?",
    a: "We text you roles that match your tickets and your suburb, usually before they reach the job boards. You reply yes or no. There is no app to check and no portal to log into.",
  },
  {
    q: "What do I need to bring on my first shift?",
    a: "Steel-cap boots, long sleeves and long pants, and your physical ticket cards. We supply high-visibility clothing, and the SMS you get the night before names the site address, the gate, the start time, your supervisor and any extra PPE that site requires.",
  },
];
