import Image from "next/image";
import { services } from "@/lib/services";
import {
  trainingGoals,
  trainingIntelligenceConfiguration,
} from "@/lib/training-intelligence";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrainingLoadout } from "@/components/motion/TrainingLoadout";
import { buildGoalViews } from "@/components/sections/trainingLoadout";

/**
 * Section 05 — TRAINING INTELLIGENCE.
 *
 * The site's teaching chapter, and a deliberate rhythm break. Hero through
 * Section 04 are five dark plates in a row; this one steps onto a warm chalk /
 * training-paper surface with charcoal type, so scrolling out of Section 04
 * reads as entering a different MODE of the site rather than the next panel of
 * the same one. Nothing else on the page changes: the reset is achieved by
 * overriding the surface/ink/border tokens LOCALLY on this section (see the
 * "Pass 9" block in app/globals.css), never by editing the global palette.
 *
 * AN EDITORIAL TRAINING GUIDE, NOT A DASHBOARD. The headline is the one
 * dominant idea ("your goal changes how you train"); a typographic goal index
 * lets the visitor pick their goal, and the guide beneath re-reads for it in a
 * few weighted groups — what the goal leans on, what to prioritise, what to
 * avoid and track, the coach's note — before handing off to the gym's programs.
 * Structure comes from type scale, rules and space, not from boxes or widgets.
 *
 * THE PHOTOGRAPH HAS ITS OWN ROOM. It sits beside the coach's note as a
 * portrait crop at roughly a third of the row (capped at 22rem on small
 * screens) and is optional: a gym without one loses the picture, and the note
 * simply takes the row.
 *
 * SOURCE-FIRST. Every sentence is the reviewed global educational library in
 * lib/training-intelligence.ts verbatim — principles only, and not one
 * calorie, macro, percentage, heart-rate zone or guaranteed timeframe anywhere
 * in the contract to type one into. The only cross-section claim the chapter
 * makes is the program handoff, and that is filtered through
 * `verified: true` in lib/services.ts, so a goal can never point at a program
 * the gym does not actually run.
 *
 * Server Component. The single client island is the goal index's selection state
 * (components/motion/TrainingLoadout.tsx); entrance motion is the existing
 * Reveal primitive plus CSS. No animation library, no new dependency.
 */
export function TrainingIntelligence({ whatsappHref }: { whatsappHref: string }) {
  const {
    index,
    eyebrow,
    headlineLines,
    accentLastLine,
    deck,
    selectorLabel,
    emphasisLabel,
    prioritiesLabel,
    mistakesLabel,
    trackLabel,
    coachNoteLabel,
    gymNoteLabel,
    handoffLabel,
    primaryCtaLabel,
    secondaryCtaLabel,
    ctaMessageTemplate,
    disclaimer,
    reviewedBy,
    artifact,
    levers,
  } = trainingIntelligenceConfiguration;

  const goalViews = buildGoalViews({
    goals: trainingGoals,
    levers,
    services,
    ctaBaseHref: whatsappHref,
    ctaMessageTemplate,
  });

  // No enabled goal means there is no chapter to teach — never an empty
  // "Training Intelligence" heading over a dead instrument.
  if (goalViews.length === 0) return null;

  return (
    <section
      id="training-intelligence"
      aria-labelledby="training-intelligence-heading"
      className="s05-surface relative overflow-hidden border-b border-(--border) py-20 scroll-mt-[calc(var(--header-h)+0.5rem)] sm:py-24 lg:py-32"
    >
      <Container className="relative">
        {/* ------------------------------------------------- chapter intro */}
        <Reveal>
          <div className="s05-chapter">
            <div className="s05-chapter-head">
              <div className="s05-chapter-mark">
                <span className="s05-chapter-index" aria-hidden="true">
                  {index}
                </span>
                <span className="s05-chapter-rule" aria-hidden="true" />
                <span className="s05-chapter-eyebrow">{eyebrow}</span>
              </div>

              <h2 id="training-intelligence-heading" className="s05-display">
                {headlineLines.map((line, i) => (
                  <span
                    key={line}
                    className="s05-display-line factory-stagger-child"
                    data-accent={
                      accentLastLine && i === headlineLines.length - 1
                        ? "true"
                        : undefined
                    }
                    style={{ transitionDelay: `${80 + i * 90}ms` }}
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            {/* Offset deck: sits low and to the outside of the headline on
                desktop, so the chapter opens asymmetrically instead of as a
                centred title block. */}
            <div className="s05-deck">
              <span className="s05-deck-rule" aria-hidden="true" />
              <p className="s05-deck-text">{deck}</p>
            </div>
          </div>
        </Reveal>

        {/* ----------------------------------------- the instrument itself */}
        <Reveal delayMs={120}>
          <TrainingLoadout
            goals={goalViews}
            selectorLabel={selectorLabel}
            emphasisLabel={emphasisLabel}
            prioritiesLabel={prioritiesLabel}
            mistakesLabel={mistakesLabel}
            trackLabel={trackLabel}
            coachNoteLabel={coachNoteLabel}
            gymNoteLabel={gymNoteLabel}
            handoffLabel={handoffLabel}
            primaryCtaLabel={primaryCtaLabel}
            secondaryCtaLabel={secondaryCtaLabel}
            artifact={
              artifact && (
                // The figure is rendered here on the server and handed to the
                // island as a node, where it sits in a children list beside the
                // keyed coach's-note block. It therefore carries its own stable
                // semantic key rather than relying on position.
                <figure key="training-intelligence-artifact" className="s05-artifact">
                  <div className="s05-artifact-frame">
                    <Image
                      src={artifact.src}
                      alt={artifact.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 22rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="s05-artifact-caption">
                    {artifact.caption}
                  </figcaption>
                </figure>
              )
            }
          />
        </Reveal>

        {/*
          Standing scope line. Educational, explicitly not medical advice.

          Deliberately NOT wrapped in Reveal. Every other block in the chapter
          enters on scroll, but .reveal's resting state is opacity: 0 and only
          JavaScript adds .reveal-visible — so a scroll-gated disclaimer is a
          disclaimer that never appears if the observer does not fire. This one
          piece of copy renders unconditionally.
        */}
        <p className="s05-scope">
          {disclaimer}
          {reviewedBy && <span className="s05-scope-review">{reviewedBy}</span>}
        </p>
      </Container>
    </section>
  );
}
