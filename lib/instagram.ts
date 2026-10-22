/**
 * Instagram configuration — official embed mode.
 *
 * PURE FRONTEND TEMPLATE: no Instagram API, no OAuth, no Meta tokens.
 * This is the default manual embed mode using public Instagram Reel URLs
 * and the official Instagram embed script.
 *
 * FUTURE CLIENT WORKFLOW:
 * - Clone template
 * - Edit this file only
 * - Replace profileUrl, handle, and Reel URLs with client's content
 * - Website updated
 *
 * No component modification required for standard customization.
 */

export interface InstagramReel {
  /** Stable identifier for React keys */
  id: string;
  /** Full Instagram Reel URL for official embed */
  url: string;
  /** Content type - future-proofed for potential post support */
  type: "reel";
}

export interface InstagramConfiguration {
  /**
   * Full Instagram profile URL. OPTIONAL: when a gym's official profile has
   * not been verified, leave it unset — the profile CTA and footer link are
   * then omitted rather than pointing at an invented or wrong account.
   */
  profileUrl?: string;
  /** Display handle with @ prefix. Optional for the same reason. */
  handle?: string;
  /** Reel embeds - render all supplied items, no artificial limit */
  items: InstagramReel[];
}

/**
 * VICTORY FITNESS CLUB Instagram configuration.
 *
 * docs/Gym-research.md INSTAGRAM.profile_url and INSTAGRAM.handle are both
 * `null` / NOT_FOUND: no official profile URL or handle was established, and
 * the research warns against inventing one. `profileUrl` and `handle` are
 * therefore deliberately left unset. The section heading falls back to the
 * gym name, and the "View More on Instagram" CTA and the footer Instagram
 * link are not rendered. Each embedded post still carries Instagram's own
 * creator name and "View profile" link.
 * OWNER QUESTION: "Please confirm the official Instagram profile URL and
 * handle."
 *
 * INSTAGRAM.items supplies 3 operator-supplied URLs, each `status:
 * VERIFIED_OFFICIAL` (source "Official Instagram"), wired below exactly as
 * supplied (the research note saying "no Reel URLs were present" is a stale
 * template line that contradicts the items). The URLs use Instagram's
 * `/p/` path; they are typed "reel" per the research and are not rewritten.
 *   1. Strength training session inside the gym
 *   2. Gym interior and equipment walkthrough
 *   3. Gym interior and equipment walkthrough
 */
export const instagramConfig: InstagramConfiguration = {
  profileUrl: undefined,
  handle: undefined,
  items: [
    {
      id: "reel-01",
      type: "reel",
      url: "https://www.instagram.com/p/Dd7w8BFBy5D/?utm_source=ig_web_copy_link&xtok=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==",
    },
    {
      id: "reel-02",
      type: "reel",
      url: "https://www.instagram.com/p/Dd2qGEtB3o7/?utm_source=ig_web_copy_link&psln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==",
    },
    {
      id: "reel-03",
      type: "reel",
      url: "https://www.instagram.com/p/DcmzYfYhiDi/?utm_source=ig_web_copy_link&mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==",
    },
  ],
};