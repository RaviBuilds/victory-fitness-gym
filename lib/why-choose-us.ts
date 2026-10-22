import type { WhyChooseUsConfiguration, WhyChooseUsItem } from "./types";

/**
 * Why Choose Us reasons. Mandatory section — always present.
 *
 * CONTENT RULE: this file states REASONS, worded as what members and public
 * listings report — never as a comparative or superlative claim.
 *
 * VICTORY FITNESS CLUB — from docs/Gym-research.md (WHY_CHOOSE_US.*). Each
 * reason is PUBLICLY_REPORTED (OnePass / Justdial reviews, GBP visual
 * evidence); owner approval is still required before final-client
 * production.
 *
 * Not used on purpose:
 *   - "Annual membership listed publicly" (INR 11,000): a third-party price
 *     that the owner has not confirmed; pricing is owned by lib/pricing.ts.
 *   - "Aggregator availability" and "Free parking listed": access conditions
 *     and parking need owner confirmation; parking is already a Section 01
 *     amenity.
 */
export const whyChooseUs: WhyChooseUsItem[] = [
  {
    title: "Room to move",
    description:
      "Multiple public reviews describe the gym as spacious, with room to train.",
  },
  {
    title: "Strength and cardio equipment",
    description:
      "Treadmills, dumbbells, benches, barbells and weight plates on the training floor.",
  },
  {
    title: "Clean floor, sanitized restrooms",
    description:
      "Members' reviews praise clean workout areas and sanitized restrooms.",
  },
];

/**
 * Section 03 composition data — "The Roof".
 *
 * A single accent-colour poster: the eyebrow, one headline, and the reasons
 * above as equal columns. The headline is built only from the reported
 * reasons (strength and cardio equipment, space to train); it is never a
 * superlative. A clone edits this object and the array, never the composition.
 */
export const whyChooseUsConfiguration: WhyChooseUsConfiguration = {
  eyebrow: "Why choose us",
  headline: "Strength and cardio. Space to train.",
};
