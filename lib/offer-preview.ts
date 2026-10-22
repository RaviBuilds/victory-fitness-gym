/**
 * DEVELOPMENT-ONLY CAMPAIGN PREVIEW.
 *
 * Lets a developer see the campaign modal / floating reminder before the next
 * real campaign goes live, WITHOUT editing the campaign calendar
 * (lib/festival-offers.ts) and without touching the selection engine.
 *
 * Usage: add this line to `.env.local`, then restart `next dev`:
 *
 *   OFFER_PREVIEW_DATE=2026-10-20
 *
 * The date is interpreted as midday in the engine's own timezone (IST), then
 * handed to the unchanged `getActiveOffer()` — so the preview is the real
 * calendar evaluated on a different day, never a fake campaign.
 *
 * WHY THIS CANNOT AFFECT PRODUCTION
 *   - The guard is the literal expression `process.env.NODE_ENV === "development"`.
 *     Next.js inlines NODE_ENV at build time, so in `next build` / `next start`
 *     the branch is the constant `false` and is dead-code eliminated; the env
 *     var is never read.
 *   - The variable is server-only (no NEXT_PUBLIC_ prefix), so it is never
 *     shipped to the browser.
 *   - An invalid value falls back to the real clock.
 */

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** True only for a real "YYYY-MM-DD" calendar date (rejects 2027-02-29). */
function isRealCalendarDate(value: string): boolean {
  if (!CALENDAR_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

/**
 * The instant the campaign engine should evaluate. Always the real clock in
 * production; in `next dev` it can be pinned with OFFER_PREVIEW_DATE.
 */
export function getOfferNow(): Date {
  if (process.env.NODE_ENV === "development") {
    const preview = process.env.OFFER_PREVIEW_DATE?.trim();
    if (preview && isRealCalendarDate(preview)) {
      return new Date(`${preview}T12:00:00+05:30`);
    }
  }
  return new Date();
}
