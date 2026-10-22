import type { AboutConfiguration, BusinessHours } from "./types";

/**
 * Section 01 â€” facility / training-floor story content.
 *
 * Customizable per gym (labels, image, attributes, headline). The narrative
 * paragraph is deliberately NOT duplicated here: Section 01 renders
 * `business.description`, so the facility description has exactly one source
 * of truth.
 *
 * Source-First rules that apply to this file:
 * - A zone or attribute with `verified: false` does not render. Leave it in
 *   the file as documentation of what was checked and found absent.
 * - Never add a claim, statistic, equipment count, award or superlative here
 *   to make the section look fuller. The composition carries the density.
 *
 * VICTORY FITNESS CLUB â€” populated from docs/Gym-research.md (ABOUT.zones,
 * ABOUT.attributes). Everything rendered is PUBLICLY_REPORTED (Google Business
 * Profile visual evidence as described in the research, OnePass, FITPASS,
 * Justdial); owner verification is required before final-client production.
 * The research supplies NO station counts or other figures, so no `metric` is
 * set anywhere.
 *
 * Not rendered (`verified: false`, kept as the record of what was checked):
 *   - air-conditioning: INFERRED from review wording only.
 *   - accessibility, nutrition / diet service, physiotherapy / recovery:
 *     NOT_FOUND in the research.
 * The opening-schedule readout is derived from `business.hours`, which is
 * empty until the owner confirms the conflicting hours, so it does not render.
 */
export const aboutConfiguration: AboutConfiguration = {
  index: "01",
  eyebrow: "About the gym",
  headlineLines: ["The floor behind", "the brand."],
  accentLastLine: true,
  image: {
    src: "/assets/about/victory-fitness-club-punjagutta-about-gym-interior.jpg",
    alt: "Victory Fitness Club training floor in Punjagutta, Hyderabad",
  },
  imageLabel: "Training floor",
  frameLabel: "Facility",
  zonesLabel: "Training environment",
  attributesLabel: "Floor & support",
  scheduleLabel: "Opening schedule",
  zones: [
    {
      id: "strength",
      label: "Strength / free weights",
      detail: "Free-weight area with dumbbells, benches, barbells and weight plates.",
      icon: "strength",
      verified: true,
    },
    {
      id: "cardio",
      label: "Cardio",
      detail: "Cardio area with motorized treadmills.",
      icon: "equipment",
      verified: true,
    },
    {
      id: "general-floor",
      label: "General training floor",
      detail: "A spacious floor with room to move, as members describe it.",
      icon: "floor",
      verified: true,
    },
  ],
  attributes: [
    { id: "unisex-gym", label: "Unisex gym", verified: true },
    { id: "restrooms", label: "Sanitized restrooms", verified: true },
    { id: "flooring", label: "Impact-absorbing rubber flooring", verified: true },
    { id: "lighting", label: "LED track lighting", verified: true },
    { id: "ventilation", label: "Wall-mounted fans", verified: true },
    { id: "free-parking", label: "Free parking lot", verified: true },
    { id: "drinking-water", label: "Drinking water", verified: true },
    // INFERRED / NOT_FOUND in the research â€” kept as the record of what was
    // checked, never rendered.
    { id: "air-conditioning", label: "Air-conditioned training environment", verified: false },
    { id: "accessibility", label: "Accessible entrance", verified: false },
    { id: "nutrition", label: "Diet / nutrition services", verified: false },
    { id: "physiotherapy", label: "Physiotherapy / recovery", verified: false },
  ],
  showSchedule: true,
};

/** One grouped opening window, e.g. `Monâ€“Fri / 05:00 AM â€“ 11:00 PM`. */
export interface ScheduleWindow {
  label: string;
  value: string;
}

/**
 * Beyond this many distinct windows the readout stops being a compact
 * technical module and starts being a timetable, so Section 01 renders
 * nothing and the full hours stay with the location section instead.
 */
const MAX_SCHEDULE_GROUPS = 3;

function shortDay(day: string): string {
  return day.trim().slice(0, 3);
}

/**
 * Collapse a week of opening hours into consecutive day ranges that share the
 * same open/close window. Derived, never authored: the caller passes
 * `business.hours`, so Section 01 can only ever show hours that already exist
 * in lib/business.ts (and therefore in the LocalBusiness structured data) â€”
 * it cannot invent a schedule. Hours are taken as an explicit argument rather
 * than imported here so this module stays pure and directly testable.
 */
export function scheduleWindows(hours: BusinessHours[]): ScheduleWindow[] {
  if (hours.length === 0) return [];

  const groups: { days: string[]; open: string; close: string }[] = [];

  for (const entry of hours) {
    if (!entry.day || !entry.open || !entry.close) return [];
    const current = groups[groups.length - 1];
    if (current && current.open === entry.open && current.close === entry.close) {
      current.days.push(entry.day);
    } else {
      groups.push({ days: [entry.day], open: entry.open, close: entry.close });
    }
  }

  if (groups.length > MAX_SCHEDULE_GROUPS) return [];

  return groups.map((group) => ({
    label:
      group.days.length === 1
        ? shortDay(group.days[0])
        : `${shortDay(group.days[0])}\u2013${shortDay(group.days[group.days.length - 1])}`,
    value: `${group.open} \u2013 ${group.close}`,
  }));
}
