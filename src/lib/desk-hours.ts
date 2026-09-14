import { site } from "@/lib/site";

/**
 * Is the hire desk answering right now?
 *
 * Always evaluated in Sydney time, never the visitor's. A builder checking from
 * Perth at 4am still needs to know whether somebody picks up in Sydney.
 *
 * Pure, and given the clock as an argument, so the header can be reasoned about
 * without waiting until 5:30am to see what it says.
 */
export type DeskStatus = {
  open: boolean;
  /** Short enough for the header. */
  label: string;
  /** The full sentence, for places with room. */
  detail: string;
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Minutes since midnight, from "05:30". */
const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "05:30" to "5:30am", the way the rest of the site writes times. */
export function spoken(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

/** The weekday and the time of day in Sydney, whatever the server's own clock is set to. */
function sydneyNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  // Intl reports midnight as "24" in some runtimes; fold it back to 0.
  const hour = Number(get("hour")) % 24;
  return { day: get("weekday"), at: hour * 60 + Number(get("minute")) };
}

const windowFor = (day: string) =>
  site.hours.find((h) => (h.days as readonly string[]).includes(day));

export function deskStatus(now: Date = new Date()): DeskStatus {
  const { day, at } = sydneyNow(now);
  const today = windowFor(day);

  if (today && at >= minutes(today.opens) && at < minutes(today.closes)) {
    return {
      open: true,
      label: "Desk open",
      detail: `Answering now, until ${spoken(today.closes)}`,
    };
  }

  // Before opening this morning: today's own window is still ahead.
  if (today && at < minutes(today.opens)) {
    return {
      open: false,
      label: `Opens ${spoken(today.opens)}`,
      detail: `The hire desk opens at ${spoken(today.opens)}`,
    };
  }

  // Closed for the day. Find the next day that has a window at all.
  const index = DAYS.indexOf(day);
  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const next = DAYS[(index + ahead) % 7];
    const window = windowFor(next);
    if (!window) continue;
    const when = ahead === 1 ? "tomorrow" : next;
    return {
      open: false,
      label: `Opens ${spoken(window.opens)}`,
      detail: `The hire desk opens ${when} at ${spoken(window.opens)}`,
    };
  }

  return {
    open: false,
    label: "Leave a message",
    detail: "Leave a message and we will call you back",
  };
}
