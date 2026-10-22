import type { OfferPhase, ResolvedOffer, ResolvedPlanOffer } from "./types";

/**
 * CAMPAIGN MODAL + FLOATING REMINDER — the view-model.
 *
 * Both surfaces render from this ONE serialisable object, built once on the
 * server from the campaign the offer engine already selected. It contains no
 * selection logic and does no price arithmetic: plan amounts arrive already
 * resolved by `resolvePlanOffers()` (lib/offer-engine.ts) from the prices in
 * lib/pricing.ts; this function only formats and packages them.
 *
 * EVERY selected campaign produces a view-model — run-up (`pre`), live
 * festival (`live`) and seasonal fallback (`season`) alike. The engine always
 * selects an applicable campaign, and the phase decides what the modal SAYS,
 * never whether it exists. The result is `null` only when there is genuinely
 * nothing to show (no campaign selected, or a campaign with no usable title).
 *
 * Truthful phase wording comes from the campaign data itself, not from here:
 *   pre     title "Pre-Dussehra"; `festivalNote` "Dussehra on 20 Oct"; ends the
 *           day before the festival. It is never presented as already running
 *           the festival.
 *   live    title "Dussehra"; ends when the live window closes.
 *   season  title "Autumn Offer"; recurring band, so no end date and no festival.
 */

export interface OfferExperiencePlan {
  planId: string;
  planLabel: string;
  percentage: number;
  regularPriceText: string;
  offerPriceText: string;
}

export interface OfferExperienceModel {
  /** Campaign identity, e.g. "dussehra-2026:pre". */
  stateKey: string;
  /** Engine phase. Exposed for data attributes/analytics, never for gating. */
  phase: OfferPhase;
  eyebrow: string;
  title: string;
  description?: string;
  ctaLabel: string;
  /** Existing in-page anchor from the engine config, e.g. "#membership". */
  ctaHref: string;
  /** Formatted window end for dated campaigns, otherwise null. */
  endsOn: string | null;
  /**
   * "Dussehra on 20 Oct" for a run-up campaign, so the visitor can see the
   * festival is still ahead. Null for live and seasonal campaigns.
   */
  festivalNote: string | null;
  plans: OfferExperiencePlan[];
  /** The strongest promoted plan, for the compact reminder summary. */
  headline: { percentage: number; planLabel: string } | null;
  labels: {
    discount: string;
    ends: string;
    offerPrice: string;
    regularPrice: string;
  };
}

/** Joining word for the run-up note when the engine config does not set one. */
const DEFAULT_FESTIVAL_ON_LABEL = "on";

export function buildOfferExperience({
  offer,
  planOffers,
  endsOn,
  festivalOn = null,
  formatPrice,
  config,
}: {
  offer: ResolvedOffer | null | undefined;
  planOffers: ReadonlyMap<string, ResolvedPlanOffer>;
  endsOn: string | null;
  /** Formatted festival date (e.g. "20 Oct"); used only for a run-up campaign. */
  festivalOn?: string | null;
  formatPrice: (amount: number) => string;
  config: {
    ctaHref: string;
    defaultCtaLabel: string;
    discountLabel: string;
    endsLabel: string;
    offerPriceLabel: string;
    regularPriceLabel: string;
    festivalOnLabel?: string;
  };
}): OfferExperienceModel | null {
  if (!offer) return null;
  if (typeof offer.stateKey !== "string" || offer.stateKey === "") return null;
  if (typeof offer.title !== "string" || offer.title.trim() === "") return null;

  const plans = [...planOffers.values()].map((plan) => ({
    planId: plan.planId,
    planLabel: plan.planLabel,
    percentage: plan.percentage,
    regularPriceText: formatPrice(plan.basePrice),
    offerPriceText: formatPrice(plan.offerPrice),
  }));

  const festivalNote =
    offer.phase === "pre" && offer.festivalName && festivalOn
      ? `${offer.festivalName} ${config.festivalOnLabel ?? DEFAULT_FESTIVAL_ON_LABEL} ${festivalOn}`
      : null;

  return {
    stateKey: offer.stateKey,
    phase: offer.phase,
    eyebrow: offer.eyebrow,
    title: offer.title,
    description: offer.description,
    ctaLabel: offer.ctaLabel ?? config.defaultCtaLabel,
    ctaHref: config.ctaHref,
    endsOn,
    festivalNote,
    plans,
    headline: plans.reduce<OfferExperienceModel["headline"]>(
      (best, plan) =>
        !best || plan.percentage > best.percentage
          ? { percentage: plan.percentage, planLabel: plan.planLabel }
          : best,
      null
    ),
    labels: {
      discount: config.discountLabel,
      ends: config.endsLabel,
      offerPrice: config.offerPriceLabel,
      regularPrice: config.regularPriceLabel,
    },
  };
}
