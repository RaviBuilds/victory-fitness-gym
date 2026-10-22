import type { FaqItem } from "./types";

/**
 * Master FAQ data. Generated only from real, known business information.
 * If the answer to a potential question isn't actually known, don't create
 * that FAQ entry.
 *
 * VICTORY FITNESS CLUB — from docs/Gym-research.md (FAQ.*). Only entries the
 * research answers are used. Deliberately NOT created: opening hours
 * (answer null — Justdial / FITPASS / GBP conflict), nutrition or
 * physiotherapy (NOT_FOUND) and accessibility (NOT_FOUND). No cancellation /
 * freeze / trial / joining-fee / guest / refund FAQ is added because the
 * research supports none of them.
 *
 * All answers are PUBLICLY_REPORTED, so they are worded as "listed / reported"
 * and owner verification is required before final-client production. The
 * location answer uses the Google Business Profile address wording only; the
 * conflicting Justdial door number / landmark is not combined into it.
 * The pricing answer is intentionally generic: the INR 11,000 annual price is
 * third-party reported and lives only in lib/pricing.ts.
 */
export const faq: FaqItem[] = [
  {
    id: "01",
    question: "Where is Victory Fitness Club located?",
    answer:
      "1st Floor, Pillar No. A1109, Above Swayamvar, Opposite Reliance, Dwarakapuri, Punjagutta, Hyderabad. Confirm the complete address and floor with the gym before you visit.",
  },
  {
    id: "02",
    question: "Does the gym have parking?",
    answer:
      "A free parking lot is reported in public listings. Confirm current availability and conditions with the gym.",
  },
  {
    id: "03",
    question: "What training services are listed?",
    answer:
      "Public listings mention strength and free-weight training, cardio training, personal training and core exercises. Confirm current availability and formats with the gym.",
  },
  {
    id: "04",
    question: "What membership plans and prices are available?",
    answer:
      "Plans and rates should be confirmed directly with the gym. Message the team on WhatsApp or call to get current details.",
  },
  {
    id: "05",
    question: "Can members access the gym through fitness aggregators?",
    answer:
      "The gym is listed on FITPASS and OnePass. Eligibility, access rules and availability depend on the platform, so confirm them there.",
  },
];
