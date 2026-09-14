/**
 * The shape of a role, and the seed the store starts from.
 *
 * Live roles are now read through `src/lib/db/jobs.ts`; this file is the type
 * plus the initial data a fresh store is populated with, so a checkout with no
 * database configured renders the same board it always has.
 *
 * Every entry carries a `validThrough` because stale JobPosting markup is both
 * an SEO liability and the fastest way to lose worker trust — expired roles are
 * filtered out rather than shipped to Google.
 *
 * No pay field, deliberately: rates are confirmed at interview and
 * `baseSalary` is optional in the JobPosting schema.
 */
export type Job = {
  id: string;
  slug: string;
  title: string;
  /** How many of this role are open. Shown as "×6". */
  positions: number;
  suburb: string;
  /** Region slug — ties the board to the region pages. */
  region: string;
  /** Trade slug — ties the board to the trade pages. */
  trade: string;
  employmentType: "Casual" | "Contract" | "Permanent";
  /** "ongoing", "9 months" — shown beside the engagement type. */
  duration: string;
  /** Shift or ticket note. One line, on the card. */
  note: string;
  posted: string;
  validThrough: string;
  summary: string;
  requirements: string[];
};

export const seedJobs: Job[] = [
  {
    id: "UG-2411",
    slug: "construction-labourers-alexandria-ug-2411",
    title: "Construction labourers",
    positions: 6,
    suburb: "Alexandria",
    region: "inner-west",
    trade: "labourers",
    employmentType: "Casual",
    duration: "ongoing",
    note: "6am start, Mon–Fri",
    posted: "2026-09-01",
    validThrough: "2026-12-01",
    summary:
      "Six construction labourers for an ongoing commercial site in Alexandria. Site clean-up, materials handling and trades assistance on a Monday to Friday roster with a 6am start. Ongoing work for the right people, this crew has been on the same site for four months.",
    requirements: [
      "Current SafeWork NSW White Card",
      "Steel-cap boots and your own PPE (we supply hi-vis)",
      "Reliable transport to Alexandria for a 6am start",
      "Right to work in Australia",
    ],
  },
  {
    id: "UG-2417",
    slug: "hoist-operator-parramatta-ug-2417",
    title: "Hoist operator",
    positions: 1,
    suburb: "Parramatta",
    region: "parramatta-western-sydney",
    trade: "scaffolders-riggers",
    employmentType: "Casual",
    duration: "9 months",
    note: "Hoist ticket required",
    posted: "2026-09-03",
    validThrough: "2026-12-03",
    summary:
      "Materials hoist operator for a 32-level residential tower in Parramatta. Nine months of continuous work on an established crew, day shift, with the level cycle already running. This is a long, stable booking rather than a fill-in shift.",
    requirements: [
      "Current HM or HP high-risk work licence",
      "SafeWork NSW White Card",
      "Experience operating a materials hoist on a high-rise site",
      "Two recent supervisor references",
    ],
  },
  {
    id: "UG-2421",
    slug: "formwork-carpenters-macquarie-park-ug-2421",
    title: "Formwork carpenters",
    positions: 4,
    suburb: "Macquarie Park",
    region: "north-shore-hills",
    trade: "carpenters-formwork",
    employmentType: "Contract",
    duration: "6 months",
    note: "Own tools, EBA site",
    posted: "2026-09-05",
    validThrough: "2026-12-05",
    summary:
      "Four formwork carpenters for a six-month contract engagement on a commercial base build in Macquarie Park. EBA site with a full crew already on the job, working table forms through the structure. Own hand tools required; site supplies everything else.",
    requirements: [
      "Certificate III in Carpentry or recognised equivalent",
      "SafeWork NSW White Card and working at heights",
      "Table form experience on a commercial structure",
      "Own hand tools and nail gun",
    ],
  },
  {
    id: "UG-2424",
    slug: "traffic-controllers-leppington-ug-2424",
    title: "Traffic controllers",
    positions: 3,
    suburb: "Leppington",
    region: "south-west-liverpool",
    trade: "traffic-control",
    employmentType: "Casual",
    duration: "4 months",
    note: "TCT required, some night work",
    posted: "2026-09-06",
    validThrough: "2026-12-06",
    summary:
      "Three traffic controllers for a staged subdivision in Leppington. Mostly day shift with occasional night works for service connections. Four months of steady work for controllers who live in the South West corridor.",
    requirements: [
      "Current NSW Traffic Controller (TCT) accreditation",
      "SafeWork NSW White Card",
      "Driver licence and own transport",
      "Availability for occasional night shifts",
    ],
  },
  {
    id: "UG-2428",
    slug: "excavator-operator-marsden-park-ug-2428",
    title: "Excavator operator",
    positions: 2,
    suburb: "Marsden Park",
    region: "parramatta-western-sydney",
    trade: "plant-operators",
    employmentType: "Casual",
    duration: "ongoing",
    note: "20–30t, VOC on arrival",
    posted: "2026-09-07",
    validThrough: "2026-12-07",
    summary:
      "Two excavator operators for bulk earthworks on a subdivision package at Marsden Park. Machines are 20 to 30 tonne; a verification of competency is completed on arrival. Ongoing work with a crew that has been on the package since the start.",
    requirements: [
      "Demonstrated experience on 20–30t excavators",
      "SafeWork NSW White Card",
      "Dogging (DG) ticket advantageous if lifting with the machine",
      "Own transport to Marsden Park for a 6:30am start",
    ],
  },
  {
    id: "UG-2430",
    slug: "forklift-operators-eastern-creek-ug-2430",
    title: "Forklift operators",
    positions: 4,
    suburb: "Eastern Creek",
    region: "parramatta-western-sydney",
    trade: "warehouse-logistics",
    employmentType: "Casual",
    duration: "3 months",
    note: "Afternoon shift, LF licence",
    posted: "2026-09-08",
    validThrough: "2026-12-08",
    summary:
      "Four forklift operators for an afternoon shift at a distribution centre in Eastern Creek. Three-month peak engagement with a strong chance of ongoing work for operators who stick. Counterbalance and reach experience both useful.",
    requirements: [
      "Current LF forklift licence (LO an advantage)",
      "Availability for a consistent afternoon shift",
      "Steel-cap boots",
      "Right to work in Australia",
    ],
  },
];
