import { htmlLang } from "@/content/site";

/**
 * Dates are parsed and formatted in UTC so a static build produces identical
 * output regardless of the machine's timezone. Without the explicit zone a
 * `YYYY-MM-DD` string is parsed as UTC midnight and then rendered in local
 * time, which shows the previous day anywhere west of Greenwich.
 */
function toDate(iso: string): Date {
  return new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
}

export function formatDate(
  iso: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(htmlLang, {
    timeZone: "UTC",
    ...options,
  }).format(toDate(iso));
}

export function formatDateShort(iso: string): string {
  return formatDate(iso, { year: "numeric", month: "2-digit", day: "2-digit" });
}

/** Grouping key for the writing archive, e.g. `2025`. */
export function formatYear(iso: string): string {
  return formatDate(iso, { year: "numeric" });
}

/** `<time datetime>` values must stay machine-readable ISO. */
export function toIso(iso: string): string {
  return toDate(iso).toISOString().slice(0, 10);
}
