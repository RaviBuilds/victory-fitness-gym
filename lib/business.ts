import type { Business } from "./types";

/**
 * Master business data. Public business information only — never put API
 * keys, tokens, or server credentials here.
 *
 * VICTORY FITNESS CLUB (Punjagutta, Hyderabad) — populated from
 * docs/Gym-research.md. VERIFIED_OFFICIAL (Google Business Profile anchor):
 * name, primary phone, locality, city, state, GBP address wording.
 * PUBLICLY_REPORTED (owner verification required before final-client
 * production): description, postal code (500082).
 *
 * ADDRESS — DOCUMENTED SOURCE CONFLICT (not silently merged): the Google
 * Business Profile anchor reads "1st Floor, Pillar No. A1109, Above
 * Swayamvar, Opposite Reliance, Dwarakapuri"; Justdial reports a different
 * door number / landmark ("Door No. 6-3-452/A, Near Punjagutta Police
 * Station"). Only the GBP anchor wording is used; the Justdial identifiers
 * are NOT combined into it. Owner must confirm the canonical address.
 *
 * HOURS — UNPUBLISHED. Justdial (05:00–22:30, Sunday 05:00–12:00), FITPASS
 * (06:00–22:00, Sunday closed) and the GBP implication conflict for every day,
 * and the research says not to publish hours until management confirms them.
 * `hours` is therefore an empty array: About's schedule readout, the Location
 * hours register, the structured-data hours and the hours-based tool copy all
 * omit themselves gracefully. Do NOT restore another gym's hours here.
 *
 * WHATSAPP — CONFLICTING_SOURCES in research (+91 8796576868 vs
 * +91 9177358685, neither confirmed). Neither is used. The VERIFIED_OFFICIAL
 * primary phone is used for the WhatsApp deep link so the CTA works; owner
 * must confirm the dedicated WhatsApp Business number.
 *
 * EMAIL / WEBSITE: not found. `email` is omitted.
 *
 * mapUrl: no verified Google Maps / Place URL in research. This is a standard
 * Google Maps search-by-name-and-address URL built from the GBP anchor address
 * text. No latitude, longitude or Place ID has been invented.
 */
export const business: Business = {
  name: "Victory Fitness Club",
  // No official tagline was found (BUSINESS.tagline NOT_FOUND). This is a plain
  // descriptor of the publicly listed services and locality, not a claim.
  tagline: "Strength and cardio training in Punjagutta, Hyderabad.",
  description:
    "Victory Fitness Club is a unisex gym in Punjagutta, Hyderabad, publicly listed for strength training, cardio training and personal training.",
  phone: "+917989904703",
  whatsapp: {
    number: "+917989904703",
    message: "Hi, I'd like to know more about membership and training at Victory Fitness Club, Punjagutta.",
  },
  email: undefined,
  address: {
    addressLine: "1st Floor, Pillar No. A1109, Above Swayamvar, Opposite Reliance, Dwarakapuri",
    locality: "Punjagutta",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500082",
    landmark: undefined,
  },
  hours: [],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Victory+Fitness+Club+1st+Floor+Pillar+No+A1109+Above+Swayamvar+Opposite+Reliance+Dwarakapuri+Punjagutta+Hyderabad+500082",
  // Prompt A — PRIMARY brand colour "Victory Gold" #F5C21B (logo-extracted).
  // Entered here exactly once and never altered; app/globals.css derives all
  // variants, and lib/color.ts selects dark text on this light fill.
  accentColor: "#F5C21B",
  // Prompt A — SECONDARY brand colour "Warm Amber Orange" #F28C18 (structure /
  // support / depth: eyebrows, metadata, technical marks, focus). Fills carry
  // dark text (--brand-secondary-foreground); light surfaces use the derived
  // ink variant — never this value raw.
  secondaryColor: "#F28C18",
};
