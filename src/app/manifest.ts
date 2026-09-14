import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Web app manifest, for "Add to Home Screen".
 *
 * Without one, iOS labels the home screen icon from the page <title>, and
 * ours is 71 characters. Truncated to the dozen or so a home screen shows,
 * that reads "Labour Hire…" — a title tag doing an app name's job.
 *
 * `short_name` is what iOS and Android actually print under the icon, so it
 * is kept to a word that never truncates. `name` is the long form, used in
 * install prompts and app listings where there is room.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Sydney Labour Hire`,
    short_name: "Uphold",
    description: site.description,
    start_url: "/",
    /* The site is a website, not an app pretending to be one: opening it from
       the home screen should still give the reader a URL bar and a back
       gesture. `standalone` would strip both and trap them in a chrome-less
       window with no way back to Safari. */
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        /* `any` rather than `maskable`: the artwork already fills the square
           edge to edge, so a platform mask crops it correctly. Declaring it
           maskable would have Android shrink it into a safe zone and leave a
           ring of dead space around the mark. */
        purpose: "any",
      },
    ],
  };
}
