/**
 * The one rule a CMS could quietly break.
 *
 * No published rates, anywhere — the strategy depends on it, and the moment a
 * consultant can type free text into a job summary, a static test over content
 * files stops being enough. Matches "$45", "$45.50/hr", "$45 per hour" while
 * leaving "$20M public liability" alone.
 */
const RATE =
  /\$\s?\d{1,4}(?:\.\d{2})?\s*(?:\/|per\s+)?\s*(?:hr|hour)|\$\s?\d{1,3}(?:\.\d{2})?\b(?!\s?(?:M|m|million))/;

/** Returns the offending text, or null when the value is clean. */
export function findRate(value: string): string | null {
  return value.match(RATE)?.[0] ?? null;
}
