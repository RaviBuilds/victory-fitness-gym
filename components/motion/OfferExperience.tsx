"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import type { OfferExperienceModel, OfferExperiencePlan } from "@/lib/offer-experience";
import {
  clearLegacyOfferFlags,
  hasOfferOpenedThisSession,
  markOfferOpenedThisSession,
} from "@/lib/offer-session";

/**
 * CAMPAIGN MODAL + FLOATING REMINDER.
 *
 * Both are rendered from ONE server-built view-model (lib/offer-experience.ts),
 * which exists for EVERY campaign the offer engine selects — run-up, live
 * festival or seasonal. This file never inspects the campaign phase to decide
 * whether to render. It selects nothing, calculates no price, and contains no
 * campaign wording: every visible string is data or engine copy.
 *
 * Open state lives only in <OfferModal>. <OfferReminder> is stateless; it asks
 * the modal to open by dispatching OPEN_EVENT, so the reminder and the opening
 * modal are provably the same dialog showing the same campaign.
 *
 * Interruption policy:
 *   - auto-opens ~1.5s after load, once per browser SESSION (lib/offer-session.ts:
 *     one versioned sessionStorage key, independent of campaign and phase); a
 *     new session opens it again, and the reminder reopens it on demand;
 *   - while open it sets `data-offer-modal` on <html>, which the generic
 *     contact dialog checks so two overlays can never stack;
 *   - it never locks page scroll, and it closes on Escape, backdrop and close
 *     button; motion is neutralised by the global prefers-reduced-motion block.
 */

export const OFFER_OPEN_EVENT = "factory:open-offer";
const AUTO_OPEN_DELAY_MS = 1500;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* --------------------------------------------------------------------------
 * PRESENTATION HELPERS (render-only; no selection, no stored state).
 *
 * The view-model carries formatted price strings, not numbers. Derived figures
 * (saving, per-month) are therefore computed here ONLY when the strings parse
 * as comma-grouped whole amounts AND re-formatting the parsed numbers gives
 * back exactly the strings the engine produced. Anything else renders the
 * engine's strings untouched and shows no derived figure.
 * ------------------------------------------------------------------------ */

const COUNT_DELAY_MS = 380;
const COUNT_DURATION_MS = 700;
const HEX_COLOUR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const WHOLE_AMOUNT = /^(\D*?)(\d{1,3}(?:,\d{2,3})+|\d+)(\D*)$/;
const PLAN_MONTHS = /^\s*(\d+)\s*(months?|mos?|years?|yrs?)\b/i;
const DATE_PARTS = /^(\d{1,2})\s+(\S+)$/;

interface PlanFigures {
  regular: number;
  offer: number;
  save: number;
  perMonth: number | null;
  format: (amount: number) => string;
}

function parseWhole(text: string) {
  const match = WHOLE_AMOUNT.exec(text.trim());
  if (!match) return null;
  return { prefix: match[1], suffix: match[3], value: Number(match[2].replace(/,/g, "")) };
}

function planFigures(plan: OfferExperiencePlan): PlanFigures | null {
  const regular = parseWhole(plan.regularPriceText);
  const offer = parseWhole(plan.offerPriceText);
  if (!regular || !offer) return null;
  if (!(offer.value > 0) || !(regular.value > offer.value)) return null;

  const indian =
    plan.regularPriceText.includes("₹") ||
    /\d{1,2}(?:,\d{2})+,\d{3}(?!\d)/.test(plan.regularPriceText);
  const numbers = new Intl.NumberFormat(indian ? "en-IN" : "en-US", {
    maximumFractionDigits: 0,
  });
  const format = (amount: number) => `${offer.prefix}${numbers.format(amount)}${offer.suffix}`;

  // Self-check: if we cannot reproduce the engine's own strings, derive nothing.
  if (format(regular.value) !== plan.regularPriceText.trim()) return null;
  if (format(offer.value) !== plan.offerPriceText.trim()) return null;

  const months = PLAN_MONTHS.exec(plan.planLabel);
  const span = months
    ? Number(months[1]) * (/^y/i.test(months[2]) ? 12 : 1)
    : 0;

  return {
    regular: regular.value,
    offer: offer.value,
    save: regular.value - offer.value,
    perMonth: span > 1 ? Math.round(offer.value / span) : null,
    format,
  };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Eases from `from` to `to` once on mount; always settles on `to` exactly. */
function useCountUp(from: number, to: number, animate: boolean) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    const begin = performance.now() + COUNT_DELAY_MS;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin) / COUNT_DURATION_MS));
      setValue(t >= 1 ? to : Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, from, to]);
  return animate ? value : to;
}

function OfferPrice({
  plan,
  figures,
}: {
  plan: OfferExperiencePlan;
  figures: PlanFigures | null;
}) {
  // The dialog only mounts on the client after open, so this read is safe.
  const [animate] = useState(() => figures !== null && !prefersReducedMotion());
  const current = useCountUp(figures?.regular ?? 0, figures?.offer ?? 0, animate);
  const visible =
    figures && animate && current !== figures.offer
      ? figures.format(current)
      : plan.offerPriceText;

  return (
    <>
      <span className="sr-only">{plan.offerPriceText}</span>
      <span aria-hidden="true" className="factory-offer-plan__offer">
        {visible}
      </span>
    </>
  );
}

/** Concentric barbell-plate rings; decorative, clipped by the hero block. */
function PlateRings() {
  return (
    <svg
      className="factory-offer-rings"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="factory-offer-rings__spin">
        <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="158" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 9" />
        <circle cx="200" cy="200" r="126" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="94" stroke="currentColor" strokeWidth="6" strokeDasharray="1 11" />
        <circle cx="200" cy="200" r="62" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="30" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function OfferModal({
  model,
  accent,
}: {
  model: OfferExperienceModel;
  /** Optional festival accent (hex). Falls back to the site accent. */
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { stateKey } = model;

  const openDialog = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const closeDialog = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) returnFocusRef.current?.focus?.();
    returnFocusRef.current = null;
  }, []);

  // Auto-open once per SESSION, shortly after the page is ready. The same rule
  // for every campaign phase; see lib/offer-session.ts.
  useEffect(() => {
    let store: Storage | null = null;
    try {
      store = window.sessionStorage;
    } catch {
      // Storage blocked: the helpers degrade to "once per page load".
    }

    // Retired per-campaign keys from earlier builds must never linger.
    clearLegacyOfferFlags(store);
    if (hasOfferOpenedThisSession(store)) return;

    const timer = window.setTimeout(() => {
      markOfferOpenedThisSession(store);
      openDialog();
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [openDialog]);

  // The reminder reopens this same dialog.
  useEffect(() => {
    window.addEventListener(OFFER_OPEN_EVENT, openDialog);
    return () => window.removeEventListener(OFFER_OPEN_EVENT, openDialog);
  }, [openDialog]);

  // Escape closes. Registered only while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeDialog]);

  // Tell other overlays (the generic contact dialog) that this one is showing,
  // and move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.offerModal = "open";
    dialogRef.current?.focus();
    return () => {
      delete root.dataset.offerModal;
    };
  }, [open]);

  // Keep Tab inside the dialog (close button <-> CTA) without a modal library.
  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!items || items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Close, then take the visitor to the existing section. The dialog unmounts
  // synchronously, so navigate programmatically rather than relying on the
  // anchor's default action surviving its own removal from the DOM.
  const onCtaClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!model.ctaHref.startsWith("#")) {
      closeDialog(false);
      return;
    }
    event.preventDefault();
    closeDialog(false);
    const target = document.querySelector(model.ctaHref);
    if (target) {
      target.scrollIntoView();
      window.history.pushState(null, "", model.ctaHref);
    } else {
      window.location.hash = model.ctaHref;
    }
  };

  if (!open) return null;

  // ---- Presentation-only derivations (no state, no new data) -------------
  const figures = model.plans.map(planFigures);
  const topPercentage = model.plans.reduce((max, plan) => Math.max(max, plan.percentage), 0);
  const showUpTo = model.plans.some((plan) => plan.percentage !== topPercentage);

  // "Best value": the strictly largest saving, only when savings are known for
  // at least two plans (a lone plan is not "best" of anything).
  let bestIndex = -1;
  const known = figures.filter((entry) => entry !== null).length;
  if (known >= 2) {
    let bestSave = 0;
    let tie = false;
    figures.forEach((entry, index) => {
      if (!entry) return;
      if (entry.save > bestSave) {
        bestSave = entry.save;
        bestIndex = index;
        tie = false;
      } else if (entry.save === bestSave) {
        tie = true;
      }
    });
    if (tie) bestIndex = -1;
  }

  const dateParts = model.endsOn ? DATE_PARTS.exec(model.endsOn.trim()) : null;
  const marqueeItems = [model.endsOn ? "Limited time" : null, model.eyebrow, model.title].filter(
    (item): item is string => Boolean(item)
  );

  // Ghost type shrinks for long names; the panel crops whatever still overflows.
  const ghostScale = Math.max(0.5, Math.min(1, 9 / Math.max(1, model.title.length)));

  const panelStyle = {
    ...(accent && HEX_COLOUR.test(accent) ? { "--offer-accent": accent } : null),
    "--offer-ghost-scale": ghostScale,
  } as CSSProperties;

  const heroPhrase =
    topPercentage > 0
      ? `${showUpTo ? "Up to " : ""}${topPercentage}% ${model.labels.discount}`
      : null;

  return (
    <div className="factory-offer-modal">
      <div
        aria-hidden="true"
        className="factory-offer-backdrop"
        onClick={() => closeDialog()}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="factory-offer-title"
        tabIndex={-1}
        data-offer-state={stateKey}
        data-offer-phase={model.phase}
        onKeyDown={onDialogKeyDown}
        style={panelStyle}
        className="factory-offer-panel"
      >
        {/* ---- Voucher stub: strip, eyebrow, hero, deadline ---- */}
        <div className="factory-offer-stub">
          <div aria-hidden="true" className="factory-offer-decor">
            <PlateRings />
            <span className="factory-offer-ghost">
              <span>{model.title}</span>
              <span>{model.title}</span>
            </span>
          </div>

          <div aria-hidden="true" className="factory-offer-marquee">
            <div className="factory-offer-marquee__track">
              {[0, 1].map((group) => (
                <span key={group} className="factory-offer-marquee__group">
                  {[0, 1, 2].flatMap((round) =>
                    marqueeItems.map((item, index) => (
                      <span key={`${round}-${index}`} className="factory-offer-marquee__item">
                        {item}
                      </span>
                    ))
                  )}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close offer"
            onClick={() => closeDialog()}
            className="factory-offer-close"
          >
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" width="14" height="14">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <div className="factory-offer-stub__body">
            <p className="factory-offer-eyebrow factory-offer-stagger" style={{ "--i": 0 } as CSSProperties}>
              <span aria-hidden="true" className="factory-offer-eyebrow__mark" />
              <span>
                {model.title}
                <span aria-hidden="true"> · </span>
                {model.eyebrow}
              </span>
              {model.festivalNote && (
                <span className="factory-offer-eyebrow__note">{model.festivalNote}</span>
              )}
            </p>

            <h2
              id="factory-offer-title"
              className="factory-offer-hero factory-offer-stagger"
              style={{ "--i": 1 } as CSSProperties}
            >
              {heroPhrase ? (
                <>
                  <span className="sr-only">
                    {model.title}: {heroPhrase}
                  </span>
                  <span aria-hidden="true" className="factory-offer-hero__visual">
                    {showUpTo && <span className="factory-offer-hero__upto">Up to</span>}
                    <span className="factory-offer-hero__num">{topPercentage}</span>
                    <span className="factory-offer-hero__unit">
                      <span className="factory-offer-hero__pct">%</span>
                      <span className="factory-offer-hero__off">{model.labels.discount}</span>
                    </span>
                  </span>
                </>
              ) : (
                <span className="factory-offer-hero__name">{model.title}</span>
              )}
            </h2>

            {model.endsOn && (
              <p className="factory-offer-ends factory-offer-stagger" style={{ "--i": 2 } as CSSProperties}>
                <span className="factory-offer-ends__label">{model.labels.ends}</span>
                {dateParts ? (
                  <span className="factory-offer-ends__blocks">
                    <span className="sr-only">{model.endsOn}</span>
                    <span aria-hidden="true" className="factory-offer-ends__block">
                      {dateParts[1]}
                    </span>
                    <span aria-hidden="true" className="factory-offer-ends__block factory-offer-ends__block--month">
                      {dateParts[2]}
                    </span>
                  </span>
                ) : (
                  <span className="factory-offer-ends__text">{model.endsOn}</span>
                )}
              </p>
            )}

            {model.description && (
              <p className="factory-offer-description factory-offer-stagger" style={{ "--i": 2 } as CSSProperties}>
                {model.description}
              </p>
            )}
          </div>
        </div>

        {/* ---- Voucher body: plans + actions (perforated from the stub) ---- */}
        <div className="factory-offer-body">
          {model.plans.length > 0 && (
            <ul
              className="factory-offer-plans"
              role="list"
              data-count={Math.min(model.plans.length, 3)}
              data-has-best={bestIndex >= 0 ? "true" : undefined}
            >
              {model.plans.map((plan, index) => {
                const entry = figures[index];
                const best = index === bestIndex;
                return (
                  <li
                    key={plan.planId}
                    className="factory-offer-plan factory-offer-stagger"
                    data-best={best ? "true" : undefined}
                    style={{ "--i": 3 + index } as CSSProperties}
                  >
                    <div className="factory-offer-plan__card">
                      {best && <span className="factory-offer-plan__ribbon">Best value</span>}
                      <div className="factory-offer-plan__top">
                        <span className="factory-offer-plan__name">{plan.planLabel}</span>
                        <span className="factory-offer-plan__pct">
                          {plan.percentage}% {model.labels.discount}
                        </span>
                      </div>
                      <div className="factory-offer-plan__money">
                        <span className="factory-offer-plan__was">
                          <span className="factory-offer-plan__tag">{model.labels.regularPrice}</span>
                          <s className="factory-offer-plan__regular">{plan.regularPriceText}</s>
                        </span>
                        <span className="sr-only">{model.labels.offerPrice}</span>
                        <OfferPrice plan={plan} figures={entry} />
                        {entry?.perMonth != null && (
                          <span className="factory-offer-plan__month">
                            {entry.format(entry.perMonth)} / mo
                          </span>
                        )}
                      </div>
                      {entry && (
                        <div className="factory-offer-plan__foot">
                          <span className="factory-offer-plan__save">
                            Save {entry.format(entry.save)}
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div
            className="factory-offer-actions factory-offer-stagger"
            style={{ "--i": 3 + Math.min(model.plans.length, 3) } as CSSProperties}
          >
            <Button
              href={model.ctaHref}
              variant="primary"
              onClick={onCtaClick}
              className="factory-offer-cta"
            >
              {model.ctaLabel}
              <span aria-hidden="true" className="factory-offer-cta__arrow">
                →
              </span>
            </Button>
            <button
              type="button"
              onClick={() => closeDialog()}
              className="factory-offer-later"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact floating pill. Stateless: it reads the same view-model as the modal
 * and only asks it to open. Rendered by the floating-contact stack, above the
 * WhatsApp action, whenever the engine has selected a campaign (any phase).
 */
export function OfferReminder({ model }: { model: OfferExperienceModel }) {
  const summary = model.headline
    ? `${model.headline.percentage}% ${model.labels.discount} · ${model.headline.planLabel}`
    : model.eyebrow;

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={`${model.title}. ${summary}. View offer details`}
      data-offer-state={model.stateKey}
      data-offer-phase={model.phase}
      onClick={() => window.dispatchEvent(new Event(OFFER_OPEN_EVENT))}
      className="factory-offer-reminder factory-focus"
    >
      <span aria-hidden="true" className="factory-offer-reminder__mark" />
      <span className="factory-offer-reminder__text">
        <span className="factory-offer-reminder__title">{model.title}</span>
        <span className="factory-offer-reminder__summary">{summary}</span>
      </span>
    </button>
  );
}
