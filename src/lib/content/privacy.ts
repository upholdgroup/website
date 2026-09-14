import { site } from "@/lib/site";

/**
 * Privacy policy content, Australian Privacy Principles.
 *
 * Written as standalone sections in plain sentences rather than legalese, for
 * the same reason the compliance FAQs are: a host's procurement team, and
 * increasingly an AI assistant, will read this to decide whether to engage.
 *
 * Items marked CONFIRM in the comments below need a decision from the business
 * before launch. They are written as the sensible default, not as fact.
 */
export type PolicySection = { heading: string; body: string[] };

export const policySections: PolicySection[] = [
  {
    heading: "Who we are",
    body: [
      // APP 1 requires the policy to identify the entity. The ABN is the
      // clearest identifier there is, so it goes in as soon as there is one;
      // until then the legal name and the service area carry it alone.
      `${site.legalName}${site.abn ? ` (ABN ${site.abn})` : ""} is a construction contracting, labour hire and recruitment business operating across ${site.serviceArea.area}, ${site.serviceArea.state}.`,
      `This policy explains how we handle personal information under the Privacy Act 1988 (Cth) and the Australian Privacy Principles. It applies to everything we collect through this website, including the labour request form, the worker registration form, and any enquiry you send us by email or phone.`,
    ],
  },
  {
    heading: "What we collect, and why",
    body: [
      "From hosts requesting labour: your name, mobile number, company, email address and the site details you give us, which is the suburb, the trades and numbers you need, the start date and any notes. We collect it for one purpose, which is to quote and supply the crew you asked for, and to contact you about it.",
      "From workers registering: your name, mobile number, suburb, the trade you work in and the tickets and licences you hold. If you go on to work through us, we collect the information an employer must collect, including your tax file number, superannuation details, bank details, emergency contact and evidence of your right to work in Australia.",
      // CONFIRM: rewrite this the day ticket photos start being stored. It is
      // accurate now and becomes a false statement the moment storage is added.
      "The registration form lets you attach photographs of your tickets. We do not currently keep them. The image is sent to our server to complete the form and is discarded immediately; only the file name is recorded, so that our consultant knows to ask you for the ticket at your interview. If that changes we will update this policy before it does.",
      "Some of this is sensitive information under the Privacy Act. Licence and right to work records fall into that category, and we only collect them because we cannot lawfully place you on a site without them. We collect them with your consent and use them for no other purpose.",
      "We do not collect more than we need. There is no CV upload, no date of birth on the registration form, and nothing on this website asks for payment details.",
    ],
  },
  {
    heading: "How we collect it",
    body: [
      "Directly from you, in almost every case: through a form on this website, by phone, by email, or in person at your interview.",
      "Sometimes we collect information about you from someone else. The two situations where that happens are reference checks, where we speak to the supervisors you nominate, and licence verification, where we check a ticket number against the SafeWork NSW register or a right to work status through VEVO. We tell you before we do either.",
    ],
  },
  {
    heading: "What happens if you do not give it to us",
    body: [
      "For a labour request, we need a contact number and a site suburb. Without those we cannot call you back or work out whether the site is one we crew.",
      "For a worker registration, we need your name, a mobile number, your trade and your suburb. Without a licence or ticket record we cannot place you on a site that requires one, because the host and the law both require us to verify it.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "Hosts. If you register as a worker and we put you forward for a role, we give that host your name, the tickets you hold and the reference notes we have taken. We do not send them your address, your date of birth or your bank details.",
      "Our service providers. This website and its database are hosted by Supabase, and our email is sent through Resend. Both are engaged to process information on our behalf and not for their own purposes.",
      "Regulators and verification services, where we check a licence or a right to work status.",
      "We do not sell personal information, and we do not share it with anyone for their own marketing.",
    ],
  },
  {
    heading: "Where your information is stored",
    body: [
      // CONFIRM: the Supabase project region, and Resend's processing region.
      // Name the actual countries here. APP 8 requires the disclosure, and a
      // vague answer is worse than no answer in a procurement review.
      "Our database is hosted in the Asia Pacific region. Our email provider processes messages outside Australia, including in the United States. That means some of your information is disclosed to overseas recipients.",
      "Before we disclose personal information overseas we take reasonable steps to ensure the recipient handles it consistently with the Australian Privacy Principles, which in practice means contractual data processing terms with each provider.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "If you register and we place you on a site, you become our employee, and we keep employee records for seven years after your employment ends. That is not our choice; the Fair Work Act requires it.",
      // CONFIRM: 12 months is a defensible default for unsuccessful
      // registrations. Decide and then enforce it, because a retention period
      // nobody applies is worse than not stating one.
      "If you register and we do not place you, we keep your registration for twelve months so we can contact you about work that suits you, and then we delete it. Ask us earlier and we will delete it earlier.",
      "Labour requests from hosts are kept as business records for seven years, which is the period the Corporations Act and the Australian Taxation Office expect.",
    ],
  },
  {
    heading: "How we keep it safe",
    body: [
      "Access to our systems is limited to the hire desk staff who need it, and every account requires a password and a second factor from an authenticator app. Access is removed the day someone leaves.",
      "Our database is not reachable from a browser. Information is encrypted in transit, and our provider encrypts it at rest.",
      "If we have a data breach that is likely to cause you serious harm, we will notify you and the Office of the Australian Information Commissioner, as the Notifiable Data Breaches scheme requires.",
    ],
  },
  {
    heading: "Marketing, and the text messages we send",
    body: [
      "If you register for work, we text you roles that match your tickets and your suburb. That is the service you asked us for, and you consent to it when you register.",
      "You can stop those messages at any time by replying STOP to any message, or by emailing us. Stopping them does not remove your registration unless you ask us to.",
      "We do not send marketing to hosts who have only asked for a quote, beyond replying to the request itself.",
    ],
  },
  {
    heading: "Seeing and correcting your information",
    body: [
      `You can ask us what we hold about you, and ask us to correct it. Email ${site.privacy.email} or call ${site.phone}. We do not charge for this.`,
      "We will respond within thirty days. If we cannot give you access, we will tell you why in writing.",
      "If you want us to delete your information, ask us. We will do it unless we are required to keep the record, which mainly applies to employee records under the Fair Work Act.",
    ],
  },
  {
    heading: "Complaints",
    body: [
      `If you think we have mishandled your personal information, contact ${site.privacy.officer} at ${site.privacy.email} or on ${site.phone}. Tell us what happened and what you would like us to do. We will acknowledge within five business days and respond within thirty days.`,
      "If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au, or by calling 1300 363 992.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      // CONFIRM before adding any analytics, advertising pixel or chat widget.
      // This sentence is true today and stops being true the moment one is
      // added, so update it in the same change.
      "This website sets one cookie, and only for people signed in to our internal hire desk. It keeps them signed in and is removed when they sign out. We do not use advertising trackers, and we do not run third party analytics on this site.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      `This is version ${site.privacy.version}, effective ${site.privacy.effective}. If we change it we will publish the new version here with a new date. We record which version applied when you sent us an enquiry, so we can always tell you what you agreed to.`,
    ],
  },
];

/** Shown at the point of collection, per APP 5. Short on purpose. */
export const collectionNotice = {
  host: `We use these details only to quote and supply the crew you have asked for, and to contact you about it. We never sell them.`,
  worker: `We use these details to place you on Sydney sites and to text you matching roles. Licence and right to work records are collected because we cannot lawfully place you without them.`,
} as const;
