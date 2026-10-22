import type { SocialConfiguration } from "./types";

/**
 * Master social/Instagram data. Curated content only — no live authenticated
 * Instagram API dependency in Factory v1. An empty posts array is valid and
 * renders a "Follow us on Instagram" fallback CTA, never a broken widget.
 *
 * NOTE: `social` below is not currently imported by any component — the live
 * Instagram section (components/sections/Instagram.tsx) reads from
 * lib/instagram.ts. See docs/gym-customization-manifest.md §9.1
 * ("lib/social.ts is orphaned"). Left in sync with lib/instagram.ts for data
 * consistency in case a future section consumes this module; not a live
 * rendering path. `socialLinks` further down IS live (footer icons).
 *
 * VICTORY FITNESS CLUB — docs/Gym-research.md INSTAGRAM.handle and
 * INSTAGRAM.profile_url are NOT_FOUND, so both fields are empty strings here
 * (the type requires strings). See lib/instagram.ts for the full note.
 */
export const social: SocialConfiguration = {
  instagramHandle: "",
  instagramUrl: "",
  posts: [],
};

/**
 * Footer social icons (Facebook, Justdial, X) shown next to Instagram.
 *
 * SOURCE-FIRST: no handle or username is invented.
 *  - Justdial: docs/Gym-research.md SOURCE_LOG (S3) documents this gym's own
 *    Justdial listing, so that exact URL is used.
 *  - Facebook / X: CONTACT.facebook_url is NOT_FOUND and no X profile was
 *    supplied. `href` is left empty, so the icon renders as a plain,
 *    non-linking mark rather than sending visitors to an unrelated network
 *    homepage. Set the real URL once the owner supplies it.
 *
 * Instagram is configured separately in lib/instagram.ts (it also drives the
 * Reel embeds) and is not repeated here.
 */

export interface SocialLink {
  id: "facebook" | "justdial" | "x";
  /** Accessible name for the icon, e.g. "Facebook". */
  label: string;
  /** Profile URL. Defaults to the network homepage until the gym's own is set. */
  href: string;
}

export const socialLinks: SocialLink[] = [
  { id: "facebook", label: "Facebook", href: "" },
  {
    id: "justdial",
    label: "Justdial",
    href: "https://www.justdial.com/Hyderabad/Victory-Fitness-Club-Above-Syambar-Showroom-Opposite-Reliance-Punjagutta/040PXX40-XX40-240209200815-M1X7_BZDET",
  },
  { id: "x", label: "X", href: "" },
];