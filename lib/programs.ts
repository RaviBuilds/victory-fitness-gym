/**
 * Section 02 — Programs: PRESENTATION configuration only.
 *
 * This file never authors program content. Every program name, description,
 * image and verification flag stays in lib/services.ts; this file only says
 * how those services are arranged on the page (which one is featured, which
 * semantic group each belongs to) plus the section's own heading copy and its
 * single primary action label. Services are referenced by their stable `id`.
 *
 * Rules the component applies (components/sections/Programs.tsx):
 * - Only `verified: true` services ever render — an id listed here for an
 *   unverified service is silently skipped.
 * - If `featuredServiceId` is missing or unverified, the first verified service
 *   in lib/services.ts order is featured instead.
 * - A verified service that is neither featured nor assigned to a group is not
 *   dropped: it is appended to the first `classes` group (or the last group if
 *   none exists), so adding a program to lib/services.ts can never make it
 *   disappear from the page.
 * - A group with no verified services does not render.
 *
 * Facility statistics are deliberately NOT referenced here: Section 01 (About)
 * owns them. Programs owns training.
 *
 * Per-gym customization: edit ids, labels and copy below. Do not edit the
 * component.
 */

/**
 * How a group is presented. Fixed design vocabulary, chosen per group:
 * - `modules` — image-led editorial modules (intended for the 1–3 guided /
 *   coached programs a visitor compares directly).
 * - `classes` — oversized typographic composition (group classes; reads best
 *   with 2–5 short names).
 * - `quiet`   — a compact "also available" line, visually subordinate.
 */
export type ProgramGroupPresentation = "modules" | "classes" | "quiet";

export interface ProgramGroup {
  id: string;
  label: string;
  presentation: ProgramGroupPresentation;
  /** Ordered `Service.id` references from lib/services.ts. */
  serviceIds: string[];
}

export interface ProgramsConfiguration {
  /** Small section identifier (the section's one cyan mono label). */
  eyebrow: string;
  /** The display statement. */
  headline: string;
  /** Continuation of the statement, set smaller and offset. Optional. */
  subline?: string;
  /** Small label above the featured program title. */
  featuredLabel: string;
  /** `Service.id` of the core program. */
  featuredServiceId: string;
  groups: ProgramGroup[];
  /**
   * Optional crop focus per `Service.id` (CSS object-position, e.g.
   * "70% 50%") for photographs whose subject is off-centre once cropped to
   * the section's frames. Presentation only.
   */
  imageFocus?: Record<string, string>;
  /**
   * The section's ONE primary action. `href` falls back to the site-wide
   * WhatsApp link built from lib/business.ts.
   */
  cta: { label: string; href?: string };
}

export const programsConfiguration: ProgramsConfiguration = {
  eyebrow: "Programs",
  headline: "Strength first.",
  subline: "Everything else is built around it.",
  featuredLabel: "Core program",
  featuredServiceId: "strength-training",
  groups: [
    // Victory Fitness Club publicly lists four programs only (see
    // lib/services.ts). No group-class program is documented, so no `classes`
    // group is defined — an empty group would not render anyway.
    {
      id: "guided",
      label: "Guided training",
      presentation: "modules",
      serviceIds: ["personal-training", "conditioning"],
    },
    {
      id: "support",
      label: "Also available",
      presentation: "quiet",
      serviceIds: ["core-exercises"],
    },
  ],
  imageFocus: {
    "strength-training": "55% 30%",
    conditioning: "72% 50%",
  },
  cta: { label: "Ask which program fits you" },
};
