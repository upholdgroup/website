"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/**
 * The mark plus the wordmark.
 *
 * The mark is the supplied logo shape on its own, in the accent orange, with
 * no tile behind it. It is served as one cached SVG rather than inlined: the
 * path is around 3KB and it appears in the header and the footer of every
 * page, so inlining would put 6KB of path data into every document.
 *
 * The shape is 1.47:1, so it is sized by height and left to find its own
 * width. Forcing it square would letterbox it.
 *
 * The tagline sits under the wordmark rather than beside it. Beside it, the
 * lockup runs about 330px wide, which pushes the pill nav off centre on a
 * laptop and collides with the menu button on a phone.
 *
 * On the home page the link takes you back to the hero rather than doing
 * nothing. A Link to the route you are already on is a no-op to the router,
 * so from halfway down the page this used to swallow the click entirely, in
 * the header and in the footer both. It stays a real anchor to "/" so that a
 * middle click, a new tab and a crawler all behave; only the same-page case
 * is intercepted.
 */
export function Logo({
  tone = "ink",
  tagline = true,
}: {
  /**
   * `over-photo` is for the homepage header sitting on the hero image: white type, and the mark kept orange. No pill or white
   * background behind it, by the business's choice.
   */
  tone?: "ink" | "on-ink" | "over-photo";
  tagline?: boolean;
}) {
  const onInk = tone === "on-ink";
  const overPhoto = tone === "over-photo";
  const pathname = usePathname();

  return (
    <Link
      href="/"
      onClick={(event) => {
        // Anywhere else, let the router navigate; it lands at the top anyway.
        if (pathname !== "/") return;
        // Modified clicks belong to the browser, not to us.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        // Instant, not smooth. The site dropped smooth scrolling because
        // animating 7000px of travel is the slowest thing it did.
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }}
      /* min-h-11 keeps the whole lockup a 44px target without changing how it
         looks: the mark and the type are shorter than that on their own. */
      className="inline-flex min-h-11 items-center gap-2.5"
      aria-label={`${site.name}, home`}
    >
      <Image
        src={onInk ? "/uphold-mark-white.svg" : "/uphold-mark.svg"}
        alt=""
        width={35}
        height={24}
        priority
        className="h-6 w-auto shrink-0"
      />

      <span className="flex flex-col">
        <span
          /* Caps need room. The tight tracking the lowercase wordmark used
             closes the counters up and makes it read as one block. */
          className={`text-[15px] leading-[1.15] font-bold tracking-[0.01em] whitespace-nowrap ${
            onInk || overPhoto ? "text-white" : "text-ink"
          }`}
        >
          {site.wordmark.text}
          <span className="text-accent">{site.wordmark.dot}</span>
        </span>

        {tagline && (
          <span
            /* Letterspaced to run close to the width of the wordmark above it,
               so the two lines read as one block rather than two stacked
               labels. Any wider and the tagline starts to lead the lockup. */
            /* Shown at every width. It used to be hidden below 480px, which
               meant it never appeared on a phone at all: every current iPhone
               is 390 to 430px wide. The lockup measures about 175px of the
               290px the header has spare at 390px, so there was room for it
               the whole time. */
            className={`text-[8px] leading-[1.35] font-medium tracking-[0.085em] whitespace-nowrap uppercase ${
              onInk ? "text-white/55" : overPhoto ? "text-white" : "text-ink-45"
            }`}
          >
            {site.wordmark.lockup}
          </span>
        )}
      </span>
    </Link>
  );
}
