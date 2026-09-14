import type { Faq } from "./trades";

export type Region = {
  slug: string;
  name: string;
  /** Suburbs named in body copy — the region page does not ship without them. */
  suburbs: string[];
  /** Tile subtitle: the four best-known suburbs. */
  headline: string;
  intro: string;
  /** Why crewing here is different. Stops every region page reading the same. */
  character: string;
  /** Trades most in demand, by slug. */
  demand: string[];
  project: { title: string; detail: string };
  faqs: Faq[];
};

export const regions: Region[] = [
  {
    slug: "sydney-cbd",
    name: "Sydney CBD & inner city",
    suburbs: ["Haymarket", "Pyrmont", "Surry Hills", "Redfern", "Barangaroo", "Ultimo", "Darlinghurst", "Millers Point"],
    headline: "Haymarket · Pyrmont · Surry Hills · Redfern",
    intro:
      "Uphold Group supplies construction labourers, trades and hoist operators to sites across the Sydney CBD and inner city: Haymarket, Pyrmont, Surry Hills, Redfern, Barangaroo and Ultimo. Most of this crew lives inside the inner ring, so a 6am CBD start booked the night before is routine rather than exceptional.",
    character:
      "CBD sites are constrained, loading windows are short and half the work happens around a live footpath. We brief workers on the gate, the loading dock time and the pedestrian management arrangement before the first shift, because on a Haymarket or Barangaroo site the induction queue at 6:15am is the difference between a productive morning and a wasted one.",
    demand: ["labourers", "scaffolders-riggers", "carpenters-formwork"],
    project: {
      title: "Commercial fitout, Barangaroo",
      detail: "12 carpenters and 8 labourers across a six-level tenancy fitout, night works for two of the nine months.",
    },
    faqs: [
      {
        q: "Can you get labourers into the Sydney CBD for a 6am start?",
        a: "Yes. The hire desk opens at 5:30am, and most of our CBD crews live inside the inner ring, so a 6am start confirmed the previous afternoon is standard. Same-morning requests are usually filled within four hours, subject to the induction your site requires.",
      },
      {
        q: "Do your workers understand CBD loading and pedestrian restrictions?",
        a: "Workers placed on CBD sites are briefed on the gate, the loading dock window and the pedestrian management arrangement before their first shift. Where a site sits on a live footpath we prioritise workers who have already worked under those conditions in the city.",
      },
    ],
  },
  {
    slug: "inner-west",
    name: "Inner West",
    suburbs: ["Marrickville", "Alexandria", "Ashfield", "Burwood", "Newtown", "Leichhardt", "Sydenham", "Rozelle"],
    headline: "Marrickville · Alexandria · Ashfield · Burwood",
    intro:
      "The Inner West is our deepest catchment: Marrickville, Ashfield, Burwood, Newtown, Leichhardt, Sydenham and Rozelle. We supply labourers, carpenters and civil crews to the residential, industrial and infrastructure work running through the corridor, usually within four hours of the request.",
    character:
      "The Inner West mixes warehouse conversions, mid-rise residential and the infrastructure work still rippling out from the WestConnex corridor. It is also where most of our workers live, which means shorter commutes, better attendance and crews who can be on site before traffic builds.",
    demand: ["labourers", "carpenters-formwork", "plant-operators"],
    project: {
      title: "Warehouse conversion, Marrickville",
      detail: "6 labourers and 4 carpenters on a soft-strip and fitout of a 1960s brick warehouse, five months.",
    },
    faqs: [
      {
        q: "Do you have Inner West workers on the books?",
        a: "Yes. More of our workers live in the Inner West than in any other catchment we cover, and every one of them is interviewed and inducted before they are placed, which is why these bookings are among the fastest we fill.",
      },
      {
        q: "Do you supply crews for warehouse conversions and adaptive reuse?",
        a: "Yes. Soft-strip, demolition support and fitout carpentry on older Inner West brick and sawtooth buildings is regular work for us, including sites with asbestos management plans where we supply workers holding current asbestos awareness training.",
      },
    ],
  },
  {
    slug: "parramatta-western-sydney",
    name: "Parramatta & Greater West",
    suburbs: ["Parramatta", "Blacktown", "Penrith", "Eastern Creek", "Rouse Hill", "Westmead", "Merrylands", "Marsden Park"],
    headline: "Parramatta · Blacktown · Penrith · Eastern Creek",
    intro:
      "Uphold Group supplies labourers, formwork crews, hoist operators and civil workers across Parramatta and the Greater West: Blacktown, Penrith, Eastern Creek, Rouse Hill, Westmead and Marsden Park. It is the busiest construction market in Greater Sydney and our largest single catchment, with most requests filled within four hours.",
    character:
      "Parramatta is running high-rise residential and health infrastructure at the same time as the outer west runs subdivision and warehouse packages. Those need different crews, so we hold a deeper bench here than anywhere else: formwork and hoist operators for the towers, plant operators and pipelayers for the greenfield work.",
    demand: ["carpenters-formwork", "plant-operators", "labourers"],
    project: {
      title: "32-level residential tower, Parramatta",
      detail: "24 labourers and 6 hoist operators over 14 months, with a leading hand rostered on each level cycle.",
    },
    faqs: [
      {
        q: "Do you supply crews to Western Sydney subdivisions?",
        a: "Yes. Excavator and roller operators, pipelayers and civil labourers for subdivision packages around Marsden Park, Leppington, Box Hill and Penrith are core work for us. Civil packages usually justify a locked-in crew for the duration rather than shift-by-shift bookings.",
      },
      {
        q: "Can you crew a Parramatta high-rise?",
        a: "Yes. Formwork crews, hoist operators and labourers for Parramatta high-rise residential are our single largest engagement type, typically booked for the length of the level cycle rather than by the day. Hoist operators are the role worth giving us a week's notice on.",
      },
    ],
  },
  {
    slug: "north-shore-hills",
    name: "North Shore & Hills",
    suburbs: ["North Sydney", "Chatswood", "Macquarie Park", "Castle Hill", "St Leonards", "Crows Nest", "Norwest", "Hornsby"],
    headline: "North Sydney · Chatswood · Macquarie Park · Castle Hill",
    intro:
      "Uphold Group supplies construction labour across the North Shore and the Hills: North Sydney, Chatswood, Macquarie Park, St Leonards, Crows Nest, Castle Hill, Norwest and Hornsby. Commercial towers, health and education projects and metro-adjacent residential all draw on the same bench, and most requests are filled within four hours.",
    character:
      "The North Shore runs commercial and institutional work with tight documentation expectations, the kind of sites where your compliance manager wants insurance certificates and ticket records before the crew arrives, not after. We send that pack unprompted, which is why we keep getting called back here.",
    demand: ["carpenters-formwork", "scaffolders-riggers", "warehouse-logistics"],
    project: {
      title: "Commercial base build, Macquarie Park",
      detail: "4 formwork carpenters and 10 labourers, EBA site, six-month contract engagement.",
    },
    faqs: [
      {
        q: "Do you work on EBA sites on the North Shore?",
        a: "Yes. We ask which enterprise agreement your site runs under before we quote, because the classification and the allowances change with it. Getting that right up front is what stops a rate conversation happening in week three.",
      },
      {
        q: "Can you supply workers to health and education projects?",
        a: "Yes. Hospital and campus projects around Macquarie Park, St Leonards and Westmead usually carry extra induction, screening and access requirements. We factor that induction time into the quoted rate rather than billing it as an extra.",
      },
    ],
  },
  {
    slug: "northern-beaches",
    name: "Northern Beaches",
    suburbs: ["Manly", "Dee Why", "Brookvale", "Mona Vale", "Narrabeen", "Freshwater", "Avalon", "Frenchs Forest"],
    headline: "Manly · Dee Why · Brookvale · Mona Vale",
    intro:
      "Uphold Group supplies labourers, carpenters and scaffolders to Northern Beaches builders: Manly, Dee Why, Brookvale, Mona Vale, Narrabeen, Freshwater, Avalon and Frenchs Forest. Residential builds, remedial work on coastal apartment blocks and boutique commercial projects make up most of the demand.",
    character:
      "The Beaches are a commute, so we match workers who live north of the bridge or on the peninsula rather than sending someone from Liverpool and hoping. That single scheduling rule is why our attendance rate up here matches the rest of Sydney instead of trailing it.",
    demand: ["labourers", "carpenters-formwork", "scaffolders-riggers"],
    project: {
      title: "Remedial works, Dee Why",
      detail: "Scaffold crew plus 4 labourers on concrete cancer remediation of an occupied 1970s beachfront block, seven months.",
    },
    faqs: [
      {
        q: "Will workers actually travel to the Northern Beaches?",
        a: "The ones we send will, because we roster workers who already live on the peninsula or north of the bridge. We would rather tell you a booking will take until tomorrow morning than send someone on a two-hour commute who will not be there on day three.",
      },
      {
        q: "Do you supply crews for remedial work on occupied buildings?",
        a: "Yes. Concrete cancer, balustrade and waterproofing remediation on occupied Northern Beaches apartment blocks is regular work. Workers on those scopes are briefed on resident access, noise windows and parking restrictions before the first shift.",
      },
    ],
  },
  {
    slug: "eastern-suburbs",
    name: "Eastern Suburbs",
    suburbs: ["Bondi Junction", "Randwick", "Mascot", "Waterloo", "Zetland", "Rosebery", "Maroubra", "Double Bay"],
    headline: "Bondi Junction · Randwick · Mascot · Waterloo",
    intro:
      "Uphold Group supplies construction labour across the Eastern Suburbs: Bondi Junction, Randwick, Mascot, Waterloo, Zetland, Rosebery, Maroubra and Double Bay. We are ten minutes from Waterloo and Mascot, so early starts in the eastern corridor are among the fastest bookings we fill.",
    character:
      "Eastern Suburbs work splits between the high-density Green Square and Mascot corridor and small, awkward, high-value residential sites where there is nowhere to put a skip. Both reward workers who have done it before, so we match on site type here more than anywhere else.",
    demand: ["labourers", "carpenters-formwork", "traffic-control"],
    project: {
      title: "Residential apartments, Zetland",
      detail: "8 labourers and 3 traffic controllers across the Green Square corridor, eleven months.",
    },
    faqs: [
      {
        q: "How fast can you crew a site in Mascot or Waterloo?",
        a: "Usually within four hours, and often faster. The eastern corridor between Alexandria, Mascot, Waterloo and Zetland is the tightest catchment we run, and most of that crew lives inside it.",
      },
      {
        q: "Do you supply traffic controllers for Eastern Suburbs sites?",
        a: "Yes. Constrained sites around Bondi Junction, Randwick and the Green Square corridor regularly need controllers for deliveries, concrete pours and pedestrian management. Controllers arrive with current TCT accreditation and their own high-visibility clothing.",
      },
    ],
  },
  {
    slug: "south-west-liverpool",
    name: "South West & Liverpool",
    suburbs: ["Liverpool", "Bankstown", "Leppington", "Badgerys Creek", "Campbelltown", "Ingleburn", "Prestons", "Austral"],
    headline: "Liverpool · Bankstown · Leppington · Badgerys Creek",
    intro:
      "Uphold Group supplies civil crews, plant operators and labourers across South West Sydney: Liverpool, Bankstown, Leppington, Badgerys Creek, Campbelltown, Ingleburn, Prestons and Austral. Aerotropolis-driven infrastructure, warehousing and subdivision work dominate, and most requests are filled within four hours.",
    character:
      "The South West is where Sydney's civil and logistics work is concentrated, and packages here run for months rather than days. We hold a deep plant-operator and pipelayer bench in this corridor and roster crews for the length of the package, because continuity is worth more than availability on a subdivision.",
    demand: ["plant-operators", "traffic-control", "warehouse-logistics"],
    project: {
      title: "Civil earthworks, Leppington subdivision",
      detail: "3 excavator operators, 2 pipelayers and 6 civil labourers on a staged residential subdivision, nine months.",
    },
    faqs: [
      {
        q: "Do you supply crews for Aerotropolis and Badgerys Creek projects?",
        a: "Yes. Civil labourers, plant operators and traffic controllers for infrastructure and warehousing packages around Badgerys Creek, Bringelly and Leppington are core work. Most of our South West workers live inside the corridor, which matters for a 6am start out there.",
      },
      {
        q: "Can you supply a full civil crew rather than individuals?",
        a: "Yes. A typical crew is an operator, a pipelayer and civil labourers, with a leading hand where the package warrants it, rostered together for the duration. You get named workers with their tickets and machine competencies before anyone is confirmed.",
      },
    ],
  },
  {
    slug: "sutherland-st-george",
    name: "Sutherland & St George",
    suburbs: ["Miranda", "Sutherland", "Kogarah", "Rockdale", "Cronulla", "Hurstville", "Caringbah", "Sylvania"],
    headline: "Miranda · Sutherland · Kogarah · Rockdale",
    intro:
      "Uphold Group supplies labourers, carpenters and scaffolders across the Sutherland Shire and St George: Miranda, Sutherland, Kogarah, Rockdale, Cronulla, Hurstville, Caringbah and Sylvania. Mid-rise residential, health projects and remedial work make up most of the demand, with requests typically filled within four hours.",
    character:
      "The Shire and St George run steady mid-rise residential rather than tower work, which means smaller crews booked for longer. Hosts down here tend to keep the same four or five workers for months, so we roster for continuity and treat a replacement as a failure rather than a routine.",
    demand: ["labourers", "carpenters-formwork", "scaffolders-riggers"],
    project: {
      title: "Mid-rise residential, Kogarah",
      detail: "5 labourers and 4 carpenters across two adjoining six-level buildings, thirteen months.",
    },
    faqs: [
      {
        q: "Do you cover the Sutherland Shire?",
        a: "Yes: Miranda, Sutherland, Caringbah, Cronulla and Sylvania are within our standard service area, and we roster workers who live in the Shire or St George so the commute is sustainable across a long booking.",
      },
      {
        q: "Can we keep the same crew for the whole project?",
        a: "Yes, and it is how most of our St George and Shire bookings run. We roster the same workers back for the length of the engagement so your supervisor is not re-inducting new faces, and a replacement is guaranteed within four hours if someone genuinely cannot attend.",
      },
    ],
  },
];

export const regionBySlug = (slug: string) => regions.find((r) => r.slug === slug);
