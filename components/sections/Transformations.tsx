import Image from "next/image";
import { transformations } from "@/lib/transformations";
import type { TransformationItem, TransformationNotationItem } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TransformationScrubber } from "@/components/motion/TransformationScrubber";
import { TransformationNav } from "@/components/motion/TransformationNav";
import { MethodDisclosure } from "@/components/motion/MethodDisclosure";
import { buildEvidence } from "./transformationDossier";

/**
 * Section 04 — RESULTS / MEMBER EVIDENCE.
 *
 * Each transformation (consent-verified only) is one EVIDENCE SHEET, read in the order a
 * visitor actually asks the questions:
 *
 *   1. Who / what goal / how long   — the case header and its meta line
 *   2. The proof                    — the photograph, directly under the header
 *                                     (phones get a one-line result caption
 *                                     above it, so the first screen already
 *                                     carries a figure)
 *   3. The result                   — ONE headline change (weight first), then
 *                                     at most three supporting figures
 *   4. How they did it              — member account, training, nutrition,
 *                                     what changed (a disclosure on phones)
 *   5. Consent + the way forward    — consent line and a "next case" link
 *
 * ONE COMPOSITION, NOT IMAGE + CARD. The case is a single CSS grid
 * (.factory-evidence-sheet). On desktop the photograph owns the left column
 * from the header rule down, and the result → method → foot stack runs
 * beside it; on phones everything stacks in reading order. Visual order is
 * DOM order at every breakpoint, so focus order matches the composition.
 *
 * FRAME, NOT CROP — the plate is width-driven with a derived aspect-ratio
 * height (see globals.css); photographs are always contained, never cropped.
 *
 * Data integrity: `metrics` are numbers only, and every label, unit, arrow
 * and delta is derived in ./transformationDossier.ts. A figure exists only
 * when both of its halves exist. Missing story/training/nutrition/notes are
 * omitted, not emptied. Names, stories, journeys and notation are
 * `lib/transformations.ts` verbatim. Only `consentVerified: true` items
 * render, and the section returns null when none do.
 *
 * Server Component. Client islands: the optional comparison scrubber (only
 * for genuinely independent before/after assets), the case register's
 * navigation (only for 2+ cases) and the method disclosure (closes itself on
 * phones; server-rendered open, so no-JS shows everything). Entrance motion
 * is the existing Reveal primitive plus CSS — no animation library.
 */
const pad = (n: number) => String(n).padStart(2, "0");

/** Visible case title: a real member name, else the journey, else "Case 01". */
function caseTitle(item: TransformationItem, index: number) {
  return item.personName ?? item.journey ?? `Case ${pad(index + 1)}`;
}

const caseAnchor = (index: number) => `transformations-case-${pad(index + 1)}`;

/**
 * One notation group (training / nutrition & habits): label → value rows on
 * hairlines. Sentence case, verbatim from the data; an optional qualifier
 * ("Coach-led") rides the value as a small tag that never hyphenates.
 */
function NotationGroup({
  label,
  items,
  baseDelayMs,
}: {
  label: string;
  items: TransformationNotationItem[];
  baseDelayMs: number;
}) {
  return (
    <div className="factory-evidence-group">
      <h4 className="factory-group-label factory-evidence-group-label">{label}</h4>
      <dl className="factory-evidence-notation">
        {items.map((item, i) => (
          <div
            key={`${item.label}-${item.value}`}
            className="factory-evidence-notation-item factory-stagger-child"
            style={{ transitionDelay: `${baseDelayMs + i * 60}ms` }}
          >
            <dt className="factory-evidence-notation-label">{item.label}</dt>
            <dd className="factory-evidence-notation-value">
              {item.value}
              {item.note && (
                <span className="factory-evidence-notation-note">{item.note}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Transformations() {
  const cases = transformations.filter((t) => t.consentVerified);
  if (cases.length === 0) return null;

  const total = cases.length;

  return (
    <section
      id="transformations"
      aria-labelledby="transformations-heading"
      className="factory-evidence-surface relative overflow-hidden border-b border-(--border) py-20 scroll-mt-[calc(var(--header-h)+0.5rem)] sm:py-24 lg:py-24"
    >
      {/* Chapter surface: soft graphite pools + one weight-plate ring kept
          clear of the content column + a micro chalk grain. Decorative,
          aria-hidden, static. */}
      <div className="factory-evidence-field" aria-hidden="true" />
      <div className="factory-evidence-grain" aria-hidden="true" />

      <Container className="relative">
        <Reveal>
          <div className="factory-evidence-head">
            <div>
              <div className="flex items-center gap-3">
                <span className="factory-index" aria-hidden="true">
                  04
                </span>
                <span className="h-px w-8 bg-(--brand-secondary) sm:w-12" aria-hidden="true" />
                <span className="factory-eyebrow">Results</span>
              </div>
              <h2
                id="transformations-heading"
                className="factory-section-display mt-4 text-(--text-primary)"
              >
                <span className="block">Real members.</span>
                <span className="block text-(--accent)">Real progress.</span>
              </h2>
            </div>

            <div className="factory-evidence-head-meta">
              {/* A count derived from the data itself — never a claim. */}
              <span className="factory-evidence-filenote">
                {pad(total)} {total === 1 ? "case" : "cases"}
              </span>
              <TransformationNav caseCount={total} />
            </div>
          </div>
        </Reveal>

        <ol
          role="list"
          id="transformations-track"
          className="factory-evidence-track"
          data-single={total === 1 ? "true" : undefined}
        >
          {cases.map((item, i) => {
            const hasSplitAssets = Boolean(item.beforeImage && item.afterImage);
            const { lead, figures, meta } = buildEvidence(item.metrics);
            const hasFigures = Boolean(lead) || figures.length > 0;
            const aspect = item.mediaAspect ?? (hasSplitAssets ? "portrait" : "square");
            const title = caseTitle(item, i);
            const showJourneyTag = Boolean(item.personName && item.journey);
            const hasProtocol = Boolean(
              item.training?.length || item.nutrition?.length || item.coachNotes?.length
            );
            const hasMethod = Boolean(item.story) || hasProtocol;
            const methodHint = [
              item.story && "Story",
              item.training?.length && "Training",
              item.nutrition?.length && "Nutrition",
              item.coachNotes?.length && "Habits",
            ]
              .filter(Boolean)
              .join(" · ");

            const isLast = i === total - 1;
            const nextIndex = isLast ? 0 : i + 1;

            return (
              <li
                key={item.image + i}
                id={caseAnchor(i)}
                data-evidence-case
                className="factory-evidence-case"
              >
                <Reveal delayMs={i === 0 ? 0 : 60}>
                  <article className="factory-evidence-sheet" aria-labelledby={`${caseAnchor(i)}-title`}>
                    <header className="factory-evidence-case-head">
                      <div className="factory-evidence-case-title">
                        <span className="factory-evidence-ref" aria-hidden="true">
                          Case {pad(i + 1)}
                        </span>
                        <h3 id={`${caseAnchor(i)}-title`} className="factory-evidence-member">
                          {title}
                        </h3>
                        {showJourneyTag && (
                          <p className="factory-evidence-journey">{item.journey}</p>
                        )}
                      </div>
                      {meta.length > 0 && (
                        <p className="factory-evidence-case-meta">
                          {meta.map((fact, mi) => (
                            <span key={fact} className="factory-evidence-case-fact">
                              {mi > 0 && (
                                <span className="factory-evidence-case-sep" aria-hidden="true">
                                  ·
                                </span>
                              )}
                              {fact}
                            </span>
                          ))}
                        </p>
                      )}
                    </header>

                    {lead && (
                      // Phones only (hidden from 768px, where the full result
                      // sits beside the plate). A caption for the photograph
                      // below it, so the first screen of a case carries a
                      // result as well as a picture. aria-hidden: the full
                      // ledger after the photograph is the accessible copy.
                      <p className="factory-evidence-glance" aria-hidden="true">
                        <span className="factory-evidence-glance-figure">
                          {lead.note ?? lead.value}
                        </span>
                        {lead.note && (
                          <span className="factory-evidence-glance-span">{lead.value}</span>
                        )}
                      </p>
                    )}

                    <div className="factory-evidence-col factory-evidence-col--plate">
                      <figure className="factory-evidence-media" data-aspect={aspect}>
                        <span className="factory-evidence-marks" aria-hidden="true" />

                        {hasSplitAssets ? (
                          <TransformationScrubber
                            beforeImage={item.beforeImage!}
                            afterImage={item.afterImage!}
                            beforeAlt={item.beforeImageAlt ?? `${title} before progress photograph`}
                            afterAlt={item.afterImageAlt ?? `${title} after progress photograph`}
                            beforeLabel={item.beforeLabel}
                            afterLabel={item.afterLabel}
                          />
                        ) : (
                          <div className="factory-evidence-mask">
                            <Image
                              src={item.image}
                              alt={item.imageAlt}
                              fill
                              loading="lazy"
                              sizes="(min-width: 1024px) 34rem, (min-width: 768px) 42vw, 92vw"
                              className="object-contain object-center"
                            />
                          </div>
                        )}

                        <figcaption className="factory-evidence-axis">
                          <span className="factory-evidence-axis-label">{item.beforeLabel}</span>
                          <span className="factory-evidence-axis-tick" aria-hidden="true" />
                          <span className="factory-evidence-axis-label" data-after="true">
                            {item.afterLabel}
                          </span>
                        </figcaption>
                      </figure>

                      {item.story && (
                        // Desktop only (from 1024px): the member account sits
                        // under the photograph, filling the plate column so the
                        // two columns end together. Below 1024px the same text
                        // lives inside the method block instead, and this copy
                        // is removed from the layout (so it is never read twice).
                        <div className="factory-evidence-story-card">
                          <h4 className="factory-group-label factory-evidence-group-label">
                            Member account
                          </h4>
                          <p className="factory-evidence-story-text">{item.story}</p>
                        </div>
                      )}
                    </div>

                    <div className="factory-evidence-col factory-evidence-col--evidence">
                      {hasFigures && (
                        <dl
                          className="factory-evidence-ledger"
                          style={
                            { "--figure-count": Math.max(1, figures.length) } as React.CSSProperties
                          }
                        >
                          {lead && (
                            <div className="factory-evidence-result factory-stagger-child">
                              <dt className="factory-evidence-metric-label">
                                {lead.note ? `${lead.label} change` : lead.label}
                              </dt>
                              <dd className="factory-evidence-result-value">
                                <span className="factory-evidence-result-figure">
                                  {lead.note ?? lead.value}
                                </span>
                                {lead.note && (
                                  <span className="factory-evidence-result-span">{lead.value}</span>
                                )}
                              </dd>
                            </div>
                          )}

                          {figures.map((cell, ci) => (
                            <div
                              key={cell.key}
                              className="factory-evidence-metric factory-stagger-child"
                              style={{ transitionDelay: `${140 + ci * 70}ms` }}
                            >
                              <dt className="factory-evidence-metric-label">{cell.label}</dt>
                              <dd className="factory-evidence-metric-value">
                                <span className="factory-evidence-metric-figure">
                                  {cell.note ?? cell.value}
                                </span>
                                {cell.note && (
                                  <span className="factory-evidence-metric-span">{cell.value}</span>
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {hasMethod && (
                        <MethodDisclosure
                          summary="How they did it"
                          hint={methodHint}
                          storyOnly={!hasProtocol}
                        >
                          {item.story && (
                            <div className="factory-evidence-story factory-evidence-story--inline">
                              <h4 className="factory-group-label factory-evidence-group-label">
                                Member account
                              </h4>
                              <p className="factory-evidence-story-text">{item.story}</p>
                            </div>
                          )}

                          {hasProtocol && (
                            <div className="factory-evidence-protocol">
                              {item.training && item.training.length > 0 && (
                                <NotationGroup
                                  label="Training"
                                  items={item.training}
                                  baseDelayMs={240}
                                />
                              )}

                              {item.nutrition && item.nutrition.length > 0 && (
                                <NotationGroup
                                  label="Nutrition & habits"
                                  items={item.nutrition}
                                  baseDelayMs={320}
                                />
                              )}

                              {item.coachNotes && item.coachNotes.length > 0 && (
                                <div className="factory-evidence-group factory-evidence-group--notes">
                                  <h4 className="factory-group-label factory-evidence-group-label">
                                    What changed
                                  </h4>
                                  <ul role="list" className="factory-evidence-notes">
                                    {item.coachNotes.map((note, ni) => (
                                      <li
                                        key={note}
                                        className="factory-evidence-note factory-stagger-child"
                                        style={{ transitionDelay: `${400 + ni * 50}ms` }}
                                      >
                                        {note}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </MethodDisclosure>
                      )}

                      <footer className="factory-evidence-foot">
                        <p className="factory-evidence-consent">Shared with member consent</p>
                        {total > 1 && (
                          <a
                            href={`#${caseAnchor(nextIndex)}`}
                            className="factory-evidence-next factory-focus"
                            data-direction={isLast ? "back" : "next"}
                          >
                            <span className="factory-evidence-next-label">
                              {isLast ? "Back to" : "Next case"}
                            </span>
                            <span className="factory-evidence-next-target">
                              {pad(nextIndex + 1)} · {caseTitle(cases[nextIndex], nextIndex)}
                            </span>
                            <span className="factory-evidence-next-arrow" aria-hidden="true">
                              {isLast ? "\u2190" : "\u2192"}
                            </span>
                          </a>
                        )}
                      </footer>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
