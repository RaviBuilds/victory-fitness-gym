import type { GoogleReviews } from "./types";

/**
 * Master Google Reviews data. Manually curated, never scraped at runtime.
 * Do not invent review content, reviewer names, ratings, or counts.
 *
 * VICTORY FITNESS CLUB — rating/reviewCount are VERIFIED_OFFICIAL (Google
 * Business Profile screenshot described in docs/Gym-research.md REVIEWS:
 * 4.5 / 96 reviews, read 2026-10-22). Not a live re-check: refresh at launch.
 *
 * PLATFORM CONFLICT (preserved, not merged): Justdial separately reports
 * 5.0 / 99. That is a different platform and is NOT used here; the Google CTA
 * carries only the Google figures.
 *
 * The three reviews below are REVIEWS.selected_reviews, PUBLICLY_REPORTED
 * (OnePass / Google and Justdial, as reproduced in the research), shown
 * verbatim including the reviewers' own wording and spelling. The research
 * lists four; the standard product renders three. Omitted: "Shibu Samuel"
 * ("Excellent work palce for workout." - a short line containing a typo).
 *   - "Rithik Singh": the reviewer's own superlative; opinion, not a claim
 *     made by this site.
 *   - "Deekshith": sourced to Justdial, not Google. QUOTE PERMISSION AND
 *     ATTRIBUTION CHECK REQUIRED (research owner question 16).
 * None carries a star rating because none was supplied.
 *
 * `tagline` restates the research's sentiment themes (equipment, value,
 * spaciousness, cleanliness). It is not a quotation. The research's mixed
 * feedback about trainer professionalism is INFERRED analysis and is
 * intentionally not reproduced on the site.
 *
 * REVIEWS.google_profile_url is NOT_FOUND. Never invent one and never
 * substitute a Justdial URL for the Google review CTA.
 * googleBusinessProfileUrl uses a Google Maps search-by-name-and-address
 * query (the same safe fallback as lib/business.ts mapUrl). No Place ID or
 * profile slug is invented. `reviewUrl` stays unset until the owner supplies
 * the Google "write a review" link.
 */
export const googleReviews: GoogleReviews = {
  rating: 4.5,
  reviewCount: 96,
  tagline:
    "Reviewers point to the equipment, the spacious floor, value for money and a clean gym.",
  googleBusinessProfileUrl:
    "https://www.google.com/maps/search/?api=1&query=Victory+Fitness+Club+1st+Floor+Pillar+No+A1109+Above+Swayamvar+Opposite+Reliance+Dwarakapuri+Punjagutta+Hyderabad+500082",
  // Fill these two once the owner supplies the Google "write a review" link
  // (Google Business Profile -> Get more reviews -> share link). Left unset =
  // not rendered.
  reviewUrl: undefined,
  reviewQrSrc: undefined,
  reviews: [
    {
      name: "Ameer Sohail",
      text: "I've been going to the gym recently, and I have to say that my experience has been nothing short of amazing, all thanks to my trainer, Shahrukh. He is not just knowledgeable and professional but also genuinely caring and attentive. He tailors every workout to fit my specific needs and motivates me to push beyond my limits in a safe and effective way. Shahrukh’s dedication and passion for fitness truly stand out, making every session enjoyable and productive. If you're looking for a trainer who genuinely cares about your progress and well-being, I highly recommend him! And the equipments are too good. Best for all.",
    },
    {
      name: "Sreshta Chelumala",
      text: "Great gym, great instructor, clean place, well maintained, good equipment, relatively economic, overall a really good gym",
    },
    {
      name: "Surya Naveen Varma",
      text: "Very nice gym very good environment for both boys and girls and one more thing is best & great coach's before joining gym I was out of shape & No fitness. After coming gym regular now I become good fitness freak, friendly environment especially our gym trainer is very much helpful for my fitness goals to achieve",
    },
    {
      name: "Aditya Sankar",
      text: "The gym offers a spacious and comfortable environment, equipped with top-notch facilities to support a great workout experience. It's a perfect place to focus on your fitness goals!",
    },
  ],
};
