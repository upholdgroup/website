"use client";

import { useEffect, useState } from "react";
import { deskStatus, type DeskStatus as Status } from "@/lib/desk-hours";
import { site, telHref } from "@/lib/site";

/**
 * The phone number, with whether anyone is behind it right now.
 *
 * The status is resolved on the client, never on the server. Every page on
 * this site is prerendered, so a status baked at build time would tell a
 * visitor at 9pm that the desk is open. The server renders the neutral label
 * below, and the real one replaces it on mount.
 *
 * It re-checks every 30 seconds, so a visitor sitting on the page at 5:29am
 * watches it come open rather than having to reload.
 */
function useDeskStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(deskStatus());
    tick();
    const id = window.setInterval(tick, 30_000);
    // A phone that has been asleep in a pocket since yesterday needs the
    // status re-checked the moment the tab comes back, not 30s later.
    const onVisible = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return status;
}

/**
 * Orange when the desk is answering, grey when it is not.
 *
 * Not green. The palette is ink, paper and one orange, and a green pill would
 * be the only other hue on the site. Orange already means "live, act now"
 * everywhere else here, so it carries the meaning without a new colour.
 */
function Dot({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative inline-flex h-[7px] w-[7px] shrink-0">
      {open && (
        <span className="absolute inset-0 animate-desk-ping rounded-full bg-accent opacity-60" />
      )}
      <span
        className={`relative inline-flex h-[7px] w-[7px] rounded-full ${
          open ? "bg-accent" : "bg-ink-45"
        }`}
      />
    </span>
  );
}

/**
 * Header treatment: status above, number below, the whole block one tap target.
 *
 * Carries no `display` of its own. `hidden` and `inline-flex` have the same
 * specificity, so a caller passing `hidden md:flex` would lose to a hardcoded
 * `inline-flex` here on source order rather than on class order, and the block
 * would show on a phone where there is no room for it.
 */
export function DeskStatusCall({ className = "" }: { className?: string }) {
  const status = useDeskStatus();

  return (
    <a
      href={telHref(site.phone)}
      title={status?.detail ?? "Hire desk"}
      className={`group min-h-11 flex-col justify-center leading-none ${className}`}
    >
      <span className="eyebrow flex items-center gap-1.5 text-ink-45 transition-colors duration-150 group-hover:text-ink-70">
        <Dot open={status?.open ?? false} />
        <span className="whitespace-nowrap">{status?.label ?? "Hire desk"}</span>
      </span>
      <span className="mt-[3px] text-[17px] leading-[1.1] font-bold tracking-[-0.02em] whitespace-nowrap transition-colors duration-150 group-hover:text-accent">
        {site.phone}
      </span>
    </a>
  );
}

/** One line, for the mobile sheet and the mega panel, where the number is already nearby. */
export function DeskStatusLine({ className = "" }: { className?: string }) {
  const status = useDeskStatus();

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Dot open={status?.open ?? false} />
      <span>{status?.detail ?? `Hire desk ${site.hours[0].value}`}</span>
    </span>
  );
}
