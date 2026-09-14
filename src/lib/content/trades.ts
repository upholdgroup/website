import type { PhotoKey } from "./photos";

export type Faq = { q: string; a: string };

export type Trade = {
  slug: string;
  /** Accordion + card title. */
  name: string;
  /** Short label for chips and filters. */
  short: string;
  /**
   * Overrides the page title. Most trades read fine as
   * "<trade> Labour Hire Sydney"; cleaning and security do not.
   */
  title?: string;
  /** Accordion body — also the meta description seed. */
  blurb: string;
  h1: string;
  /** First 100 words: what we supply, where we cover, how fast. */
  intro: string;
  tickets: string[];
  scope: string[];
  /** "What to brief us" — the three things that make a fill fast. */
  brief: string[];
  faqs: Faq[];
  /** Which crew shot heads this page. */
  photo: PhotoKey;
};

export const trades: Trade[] = [
  {
    slug: "labourers",
    photo: "crewOnSite",
    name: "General labourers & trades assistants",
    short: "Labourers & TAs",
    blurb:
      "White Card, site-ready and reliable. Clean-up crews, demo, materials handling and TA work for commercial and residential builders, day rate or ongoing.",
    h1: "Labour hire: general labourers & trades assistants, Sydney",
    intro:
      "Uphold Group supplies White Card construction labourers and trades assistants to builders and subcontractors across Greater Sydney. Every labourer is interviewed, ticket-checked and site-inducted before they are offered to you. Tell us the numbers and the start time and most Sydney requests are filled within four hours, including 6am starts booked the night before.",
    tickets: [
      "SafeWork NSW White Card (CPCWHS1001)",
      "Asbestos awareness where the scope calls for it",
      "Working at heights and confined space, on request",
      "Construction induction records kept current and tracked to expiry",
    ],
    scope: [
      "Site clean-up, waste segregation and skip management on multi-level builds",
      "Soft-strip and demolition support under a licensed supervisor",
      "Materials handling, hoist loading and floor distribution",
      "Trades assistance to carpenters, formworkers, plumbers and electricians",
      "Concrete pours: kibble work, screeding support and finishing crews",
      "Site set-up, hoarding, edge protection checks and housekeeping",
    ],
    brief: [
      "How many labourers, and whether you need a leading hand to run them",
      "Site address, gate, parking and the supervisor's name for the first morning",
      "Start time and expected duration: one day, one week or ongoing",
    ],
    faqs: [
      {
        q: "How quickly can you get labourers to a Sydney site?",
        a: "Most Greater Sydney labourer requests are filled within four hours during hire-desk hours (5:30am to 8pm weekdays, 6am to 4pm weekends). A 6am start booked the previous afternoon is routine. If we cannot fill a booking we tell you inside the hour rather than let you find out at the gate.",
      },
      {
        q: "Do your labourers hold a White Card?",
        a: "Yes. Every labourer holds a current SafeWork NSW White Card, verified against the register rather than taken on trust, and every worker has completed our own site induction. Expiries are tracked and a worker is stood down before a ticket lapses.",
      },
      {
        q: "Can the same labourers come back tomorrow?",
        a: "Yes, and it is the default. We roster the same crew back to your site for the length of the booking so your supervisor is not re-inducting new faces every morning. If someone is unavailable you get a named replacement within four hours.",
      },
    ],
  },
  {
    slug: "carpenters-formwork",
    photo: "worker",
    name: "Carpenters, formwork & fitout",
    short: "Carpenters & formwork",
    blurb:
      "Trade-qualified chippies for framing, formwork, second fix and commercial fitout, plus leading hands who can run a small crew on Sydney sites.",
    h1: "Labour hire: carpenters, formwork & fitout crews, Sydney",
    intro:
      "Uphold Group supplies trade-qualified carpenters, formwork crews and commercial fitout chippies to builders across Greater Sydney. We verify the Certificate III, the White Card and the high-risk licences before anyone is offered, and we ask which EBA your site runs under so the classification is right the first time. Most Sydney crew requests are filled within four hours, with a written all-inclusive rate the same day.",
    tickets: [
      "Certificate III in Carpentry, verified with the issuing RTO where required",
      "SafeWork NSW White Card",
      "Working at heights and EWP (LF/WP) for formwork and facade work",
      "Dogging or basic rigging on formwork crews handling table forms",
    ],
    scope: [
      "Wall and slab formwork: table forms, jump forms, column boxes and strip-out",
      "Structural timber and steel-stud framing on residential and commercial builds",
      "Second fix: doors, hardware, skirting, joinery install and make-good",
      "Commercial fitout: partitions, ceiling grids, bulkheads and shopfront works",
      "Leading hands who can take a set of drawings and run a crew of four to eight",
      "Remedial and heritage carpentry on occupied Sydney buildings",
    ],
    brief: [
      "Formwork system in use and whether the crew needs jump-form experience",
      "Site EBA or award, shift pattern and whether workers bring their own tools",
      "Whether you need a leading hand, and who they report to on site",
    ],
    faqs: [
      {
        q: "Are your carpenters trade-qualified?",
        a: "Yes. Every carpenter we place holds a Certificate III in Carpentry or a recognised equivalent, and we sight the certificate rather than accept a claim on a résumé. Formwork crews additionally hold the high-risk licences their scope requires, and we check both against the SafeWork NSW register.",
      },
      {
        q: "Can you supply a full formwork crew rather than individuals?",
        a: "Yes. We regularly put together formwork crews of four to eight with a leading hand who has run the same system before, so the crew arrives as a working unit rather than as strangers. Tell us the system, the cycle time you are chasing and the site EBA, and you get named workers with their tickets before anyone is confirmed.",
      },
      {
        q: "Do carpenters bring their own tools?",
        a: "Standard hand tools and a nail gun, yes. Anything site-specific, larger power tools, consumables, height-access equipment, stays with the site. We confirm the tool expectation in writing when we quote so there is no argument on the first morning.",
      },
    ],
  },
  {
    slug: "scaffolders-riggers",
    photo: "worker",
    name: "Scaffolders, riggers & hoist operators",
    short: "Scaffolders & riggers",
    blurb:
      "Basic to advanced scaffold, dogging and rigging tickets, materials hoist and EWP operators for high-rise and remedial work.",
    h1: "Labour hire: scaffolders, riggers & hoist operators, Sydney",
    intro:
      "Uphold Group supplies licensed scaffolders, dogmen, riggers and materials hoist operators to high-rise, remedial and civil projects across Greater Sydney. Every high-risk work licence is verified against the SafeWork NSW register before a worker is offered, with the class and expiry sent to you in writing. Most Sydney requests are filled within four hours, and a replacement is guaranteed inside four hours if someone cannot attend.",
    tickets: [
      "Basic, intermediate and advanced scaffolding (SB, SI, SA)",
      "Dogging (DG) and basic, intermediate and advanced rigging (RB, RI, RA)",
      "Materials hoist and personnel-and-materials hoist operation (HM, HP)",
      "EWP over 11m (WP), boom and scissor familiarisation, working at heights",
    ],
    scope: [
      "Erect, alter and dismantle tube-and-clamp and modular scaffold on high-rise",
      "Loading platforms, edge protection, birdcage and suspended scaffold",
      "Dogging and crane coordination for structural steel and precast",
      "Materials hoist operation, loading discipline and daily pre-start checks",
      "Remedial access on occupied buildings, including night and weekend windows",
      "Scaffold inspection support and handover documentation for your engineer",
    ],
    brief: [
      "Licence class required, and the height and system of the scaffold",
      "Crane or hoist type on site, and who holds the lift study",
      "Whether the work is inside an occupied building or after-hours window",
    ],
    faqs: [
      {
        q: "How do you verify high-risk work licences?",
        a: "We check each licence number against the SafeWork NSW high-risk work licence register, sight the physical card at interview, and record the class and expiry date. Those details go to you in writing before the worker is confirmed, and the worker is stood down automatically before an expiry rather than after it.",
      },
      {
        q: "Can you supply hoist operators for a high-rise site?",
        a: "Yes. We keep materials hoist and personnel-and-materials hoist operators on the books across the Sydney CBD, Parramatta and North Sydney high-rise markets, most of them on long engagements measured in months rather than days. Hoist bookings are usually the ones worth giving us a week's notice on.",
      },
      {
        q: "Do you supply scaffolders for remedial work on occupied buildings?",
        a: "Yes, and it is a large part of what we do across the Eastern Suburbs and North Shore. Workers on occupied-building scopes are briefed on resident access, noise windows and after-hours restrictions before the first shift, because the complaint risk on those sites is as real as the safety risk.",
      },
    ],
  },
  {
    slug: "traffic-control",
    photo: "crewOnSite",
    name: "Traffic control & spotters",
    short: "Traffic control",
    blurb:
      "TCT and TMI-ticketed controllers, plus excavation spotters and service locators for civil, utilities and road works.",
    h1: "Traffic control hire & spotters, Sydney",
    intro:
      "Uphold Group supplies ticketed traffic controllers, traffic management implementers and excavation spotters to civil, utility and road projects across Greater Sydney. Controllers arrive with their own accreditation, high-visibility clothing and the paperwork your TMP requires. Night shifts, weekend possessions and early utility starts are standard work for us, and most Sydney requests are filled within four hours.",
    tickets: [
      "Traffic Controller (TCT) accreditation, current and verified",
      "Traffic Management Implementer (TMI) for TCP set-up and removal",
      "SafeWork NSW White Card",
      "Excavation spotter and service-locator training where the scope requires it",
    ],
    scope: [
      "Stop/slow control on local roads, arterials and residential streets",
      "TCP implementation and removal under an approved traffic management plan",
      "Night works, road possessions and weekend shutdowns",
      "Excavation spotting near live services for utility and telco crews",
      "Pedestrian management around Sydney CBD hoardings and site entries",
      "Site access control and delivery marshalling on constrained inner-city sites",
    ],
    brief: [
      "The TMP or TCP reference, and who is implementing it",
      "Shift pattern, day, night, or a weekend possession window",
      "Whether the controller needs their own vehicle, signage or VMS",
    ],
    faqs: [
      {
        q: "Do your traffic controllers hold current NSW accreditation?",
        a: "Yes. Every controller holds current Traffic Controller (TCT) accreditation and a White Card, both verified before their first shift, and TMI-ticketed workers are available where the plan needs implementing rather than only staffed. Accreditation expiries are tracked and a worker is stood down before a card lapses.",
      },
      {
        q: "Can you cover night shifts and weekend possessions?",
        a: "Yes. A large share of Sydney traffic control is night and weekend work, so our hire desk runs from 5:30am to 8pm on weekdays and 6am to 4pm on weekends, and shift crews are rostered rather than scrambled. Give us the possession dates as early as you have them and we lock the crew in.",
      },
      {
        q: "Do you supply the signage and vehicles as well?",
        a: "On a labour hire booking we supply the people. Signage, VMS boards, arrow boards and vehicles are usually supplied by the traffic management contractor or the principal, and we confirm in writing who is bringing what before the first shift so nothing turns up short. Where we are engaged to deliver the works rather than to supply labour, tell us at the quote stage and we will price the plant and signage with it.",
      },
    ],
  },
  {
    slug: "plant-operators",
    photo: "crewOnSite",
    name: "Civil & plant operators",
    short: "Plant operators",
    blurb:
      "Excavator, skid steer, roller and water cart operators, pipelayers and civil labourers for subdivision and infrastructure packages across the Sydney basin.",
    h1: "Plant operator & civil labour hire, Sydney",
    intro:
      "Uphold Group supplies ticketed plant operators, pipelayers and civil labourers to subdivision, infrastructure and earthworks projects across the Sydney basin. Operators are matched to the machine class and the ground conditions you are actually working in, not just to a ticket number. Every licence is verified before the offer, and most Greater Sydney requests are filled within four hours.",
    tickets: [
      "Excavator, skid steer, roller and dozer competencies (VOC-assessed per machine)",
      "HR and HC licences for water carts, tippers and float support",
      "Dogging (DG) where operators are lifting with an excavator",
      "White Card, plus confined space and gas test where the scope requires it",
    ],
    scope: [
      "Bulk and detail earthworks on subdivision and infrastructure packages",
      "Trenching, pipelaying and service installation for water, sewer and stormwater",
      "Road formation, subgrade preparation, compaction and roller work",
      "Water cart, dust suppression and haul road maintenance",
      "Civil labourers for kerb, drainage, pit work and reinstatement",
      "Machine operation on constrained inner-city sites with spotter support",
    ],
    brief: [
      "Machine make, model and size, a 5t and a 30t are different operators",
      "Ground conditions, and whether the operator is lifting with the machine",
      "Project duration, because civil packages usually justify a locked-in crew",
    ],
    faqs: [
      {
        q: "Are operators assessed on the specific machine?",
        a: "Yes. A ticket says someone can operate a class of machine; a verification of competency says they can operate yours. We record the makes and sizes each operator has run, and where a site requires a VOC on arrival we brief the worker to expect it rather than let them be turned away at the gate.",
      },
      {
        q: "Can you supply a full civil crew?",
        a: "Yes. A typical Uphold civil crew is an operator, a pipelayer and two civil labourers, with a leading hand where the package warrants it. Subdivision and infrastructure work is where continuity pays, so these crews are rostered for the length of the package rather than shift by shift.",
      },
      {
        q: "Do you cover Western Sydney and the outer basin?",
        a: "Yes: Parramatta, Blacktown, Penrith, Eastern Creek, Leppington and Badgerys Creek are core catchments for our civil crews, and workers are matched to sites within a sensible drive of where they live. We crew right across Greater Sydney, and we never outsource a booking to another agency.",
      },
    ],
  },
  {
    slug: "warehouse-logistics",
    photo: "worker",
    name: "Warehouse, logistics & support",
    short: "Warehouse & logistics",
    blurb:
      "Forklift (LF/LO) operators, storepersons and pick-packers, plus site admin and project support for longer engagements.",
    h1: "Warehouse, logistics & site support labour hire, Sydney",
    intro:
      "Uphold Group supplies forklift operators, storepersons, pick-packers and site support staff to warehouses, distribution centres and construction site offices across Greater Sydney. Licences are verified, references are checked with the last two supervisors, and workers are matched to the shift pattern they can actually sustain. Most Sydney requests are filled within four hours, with one weekly invoice regardless of how many workers you take.",
    tickets: [
      "Forklift licence (LF) and order picker (LO), verified against the register",
      "SafeWork NSW White Card for site-based support roles",
      "Manual handling and chemical awareness where the site requires it",
      "Right-to-work verified through VEVO for every worker",
    ],
    scope: [
      "Forklift and order picker operation in distribution and construction supply",
      "Storepersons, goods-in and materials control on large Sydney sites",
      "Pick-pack, dispatch and inventory counts, including peak-season surges",
      "Site administration, document control and gatehouse support",
      "Project support and expediting for long construction programmes",
      "Afternoon and night shift coverage on continuous operations",
    ],
    brief: [
      "Licence classes needed, and the equipment brand on the floor",
      "Shift pattern and whether the role is a surge or an ongoing seat",
      "Any systems training required. WMS, scanner or ERP",
    ],
    faqs: [
      {
        q: "Can you cover a seasonal peak?",
        a: "Yes. Warehouse peaks are predictable, so tell us the ramp dates as early as you have them and we build the pool ahead of the surge rather than scrambling in week one. You get the same faces across the peak, which is the difference between a crew that is productive by day three and one that never is.",
      },
      {
        q: "Do workers get inducted before they start?",
        a: "Every worker completes our own induction before their first placement, and your site-specific induction on arrival. We allow induction time in the rate rather than billing it separately, so the first morning is not an argument about who pays for the safety briefing.",
      },
      {
        q: "Can a warehouse worker be made permanent?",
        a: "Yes. After 500 hours on your site there is no conversion fee, and as the legal employer we manage the casual conversion obligations that come with it. Many of our longest host relationships started as a surge booking that turned into three permanent hires.",
      },
    ],
  },
  {
    slug: "site-cleaning",
    photo: "cleaning",
    name: "Site cleaning & builders cleans",
    short: "Site cleaning",
    title: "Post Construction Cleaning Sydney | Builders & Final Cleans",
    blurb:
      "Progressive site clean through the build, then the rough, builders and final cleans that get a Sydney job to handover without a defect list full of dust.",
    h1: "Site cleaning & post construction cleaning, Sydney",
    intro:
      "Uphold Group cleans construction sites across Greater Sydney: progressive housekeeping while the trades are still working, then the rough clean, the builders clean and the final detail clean that hand the building over. We can supply cleaners to work under your site manager, or take the clean on as a scope with our own supervisor and equipment. Most Sydney requests are filled within four hours.",
    tickets: [
      "SafeWork NSW White Card for every cleaner on a construction site",
      "Working at heights and EWP (WP) for facade, atrium and high level work",
      "Chemical handling and safety data sheet awareness",
      "Asbestos awareness where the site has a management plan",
    ],
    scope: [
      "Progressive site clean: waste segregation, bin runs and keeping access ways clear",
      "Rough clean after the wet trades, ready for painting and floor coverings",
      "Builders clean: full detail through units, tenancies, stairs and common areas",
      "Final and sparkle clean for handover, including glass, tracks, frames and edges",
      "High level dusting, facade and internal glass with EWP access",
      "Defect and make good cleans after the handover walk through",
      "Strata and occupied building cleans after remedial works",
    ],
    brief: [
      "Which clean you need: progressive, rough, builders or final, and the handover date",
      "The area in square metres and the number of units, levels or tenancies",
      "Whether we supply the equipment and consumables or use what is on site",
    ],
    faqs: [
      {
        q: "What is the difference between a builders clean and a final clean?",
        a: "A builders clean is the heavy pass once the trades are off: construction dust, adhesive, render and paint spatter, stickers and protective film all come off and the space becomes presentable. The final or sparkle clean is the detail pass immediately before handover, and it is the one the client actually sees. Most Sydney jobs need both, and booking only the second one is the usual reason a handover walk through generates a defect list full of dust.",
      },
      {
        q: "Do you supply the equipment and consumables?",
        a: "We can do either. Tell us at the quote stage whether you want us to bring machines, chemicals and consumables or use what is already on site, and it is priced accordingly. For facade and high level work, confirm who is providing the EWP, because that is the item most often assumed and then missing on the morning.",
      },
      {
        q: "Can you clean while the trades are still working?",
        a: "Yes, and on a long programme it is cheaper than leaving it. A progressive clean keeps access ways clear, waste segregated and dust down while the build runs, which reduces the size of the builders clean at the end and keeps you out of trouble on a site safety walk.",
      },
    ],
  },
  {
    slug: "security",
    photo: "security",
    name: "Site security & security equipment",
    short: "Security",
    title: "Construction Site Security Sydney | Licensed Guards & Equipment",
    blurb:
      "Licensed static guards and patrols for Sydney sites, with cameras, alarms and temporary fencing available alongside the people.",
    h1: "Construction site security, Sydney",
    intro:
      "Uphold Group provides licensed site security across Greater Sydney: static guards, night and weekend patrols, gatehouse and access control, and the equipment that goes with them. Every guard holds a current NSW security licence issued by NSW Police as well as a White Card, and licence classes and expiry dates are sent to you in writing before anyone is rostered.",
    tickets: [
      "NSW Security Licence, Class 1A unarmed guard, verified against the register",
      "Class 1C crowd control where the site or event calls for it",
      "SafeWork NSW White Card for any guard working on a construction site",
      "First aid, and right to work verified through VEVO",
    ],
    scope: [
      "Static guards on site entries, gatehouses and material compounds",
      "Overnight, weekend and shutdown coverage, including public holidays",
      "Mobile patrols with documented checkpoints and a written shift report",
      "Access control, contractor sign in and delivery marshalling",
      "Alarm response and escalation to your nominated contact",
      "Theft and trespass deterrence on sites carrying high value plant and materials",
    ],
    brief: [
      "Static, patrol or a mix, and the exact hours you need covered",
      "Site risk: plant left on site, copper and material storage, public frontage",
      "Whether you need equipment as well as guards, and who holds the site keys",
    ],
    faqs: [
      {
        q: "Are your security guards licensed in NSW?",
        a: "Yes. Security work in New South Wales is licensed under the Security Industry Act, and every guard we roster holds a current NSW security licence of the right class for the work, issued by NSW Police. We check the licence number against the register rather than accept a card at face value, and we send you the class and the expiry date before the first shift. Guards on construction sites also hold a White Card.",
      },
      {
        q: "What security equipment can you supply?",
        a: "Site cameras and recording, alarm systems, temporary fencing and gates, lighting and signage, sized to the site rather than to a catalogue. Equipment is usually quoted with the guarding, because the right mix of cameras and hours is what keeps the cost sensible: a well placed camera run often removes the need for a second overnight guard.",
      },
      {
        q: "Can you cover a shutdown or a long weekend at short notice?",
        a: "Yes, and it is the most common request we get. Christmas shutdowns and long weekends are when Sydney sites lose plant and copper. Give us the dates as early as you have them and we roster the same guards across the whole period, which is worth more than a different face every night who does not know what belongs on site.",
      },
    ],
  },
];

export const tradeBySlug = (slug: string) => trades.find((t) => t.slug === slug);
