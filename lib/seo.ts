import type { SEOConfiguration } from "./types";

/**
 * Master SEO configuration. Consumed once, centrally, by app/layout.tsx's
 * Metadata API. Never duplicate these values inside page/section
 * components.
 *
 * VICTORY FITNESS CLUB SEO configuration, from docs/Gym-research.md
 * (SEO.title_candidate / description_candidate — INFERRED from verified
 * business data). The title is the research candidate. The description is
 * the research candidate with its trailing "confirm current hours" sentence
 * kept short and factual; it makes no ranking, premium or superlative claim
 * (the research warns against "premium" and against implying Banjara Hills /
 * Somajiguda as the primary locality).
 *
 * canonical is a placeholder domain pending the client's real production
 * URL: the research found NO official website for this gym.
 */
export const seo: SEOConfiguration = {
  title: "Victory Fitness Club | Strength & Cardio Training in Punjagutta, Hyderabad",
  description:
    "Victory Fitness Club in Punjagutta, Hyderabad is a unisex gym with publicly listed strength training, cardio equipment and personal training. Confirm current hours and membership details with the gym.",
  canonical: "https://example.com",
  ogImage: undefined,
  robots: "index, follow",
};
