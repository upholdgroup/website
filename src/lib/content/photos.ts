/**
 * Real Uphold crews on real Sydney sites.
 *
 * One registry so a slot never hard-codes a path: swapping a shot is a change
 * here, not a hunt through pages. `position` matters because the hero crops to
 * 21:9 on a desktop and a centred crop would take the top off someone's head.
 *
 * Alt text describes what is in the frame and names the work, which is what a
 * screen reader needs and what image search reads. No rates, here or anywhere.
 */
export type Photo = {
  src: string;
  alt: string;
  /** CSS object-position. Defaults to centre when omitted. */
  position?: string;
};

export const photos = {
  hero: {
    src: "/photos/crew-skyline.jpg",
    alt:
      "Three Uphold Group workers in branded hi-vis standing on a Sydney high-rise slab at " +
      "sunrise, tower cranes overhead and the city skyline, Opera House and Harbour Bridge " +
      "on the horizon behind them",
    /*
      The file is 2.36:1, so the desktop slot at 2.4:1 crops almost nothing and
      this offset does no work there. It is for the phone.

      The three workers sit between roughly 53% and 88% of the frame width and
      the skyline runs along the left. A centred crop on a narrow slot clips
      the right-hand worker; pushing the window to 58% keeps all three and
      still holds the Opera House and the bridge, which are most of why this
      shot is worth using.
    */
    position: "58% 50%",
  },
  crewOnSite: {
    src: "/photos/crew-on-site.jpg",
    alt: "An Uphold Group crew on a Sydney construction site at the end of the day",
    position: "50% 58%",
  },
  worker: {
    src: "/photos/crew-hero.jpg",
    alt: "Uphold Group worker in hi-vis on a high-rise construction site in Sydney",
    position: "55% 38%",
  },
  cleaning: {
    src: "/photos/site-cleaning.jpg",
    alt: "Uphold Group cleaning crew working through a Sydney tower floor after construction",
    position: "50% 50%",
  },
  security: {
    src: "/photos/site-security.jpg",
    alt: "Uphold Group security guard and camera tower at the entry to a Sydney construction site",
    position: "50% 68%",
  },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
