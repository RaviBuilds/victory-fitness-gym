"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type {
  EmphasisRow,
  LoadoutGoalView,
} from "@/components/sections/trainingLoadout";

/**
 * Section 05 — the goal index and its readout.
 *
 * The only client island in the chapter. The goal names are set as a
 * typographic index (an editorial contents line, not a tab bar), and choosing
 * one re-reads the guide beneath it: what that goal leans on, what to
 * prioritise, what to avoid, what to track, the coach's note and the path into
 * the gym's programs.
 *
 * INTERACTION SEMANTICS. The index is a real WAI-ARIA tab list with automatic
 * activation, because one control genuinely governs one region of content.
 * Left/Right (and Up/Down) move and select, Home/End jump to the ends, roving
 * tabindex keeps the group a single tab stop, and pointer and keyboard reach
 * identical state. The selected goal carries an underline, a darker ink and
 * `aria-selected` — never colour alone.
 *
 * EMPHASIS IS GROUPED BY MEANING. Levers that share a level are read together
 * ("Primary focus: Cardio, Conditioning"), set larger the more the goal leans
 * on them, and the level is always also stated in words. The ordinal weights
 * are teaching weights, not measurements, and the section says so.
 *
 * NO HOVER-GATED CONTENT. Everything for the selected goal is in normal
 * document flow at every breakpoint.
 *
 * SCALES BY DATA. The index wraps naturally for 3, 5, 6 or more enabled goals.
 */

/** Primary focus first: the reader meets what the goal leans on before what it
 *  merely maintains. */
const LEVEL_ORDER = [3, 2, 1] as const;

function groupByLevel(rows: EmphasisRow[]) {
  return LEVEL_ORDER.flatMap((level) => {
    const group = rows.filter((row) => row.level === level);
    return group.length > 0 ? [{ level, rows: group }] : [];
  });
}

export function TrainingLoadout({
  goals,
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
  artifact,
}: {
  goals: LoadoutGoalView[];
  selectorLabel: string;
  emphasisLabel: string;
  prioritiesLabel: string;
  mistakesLabel: string;
  trackLabel: string;
  coachNoteLabel: string;
  gymNoteLabel: string;
  handoffLabel: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  /** Server-rendered photograph. Absent on gyms without one. */
  artifact?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const total = goals.length;
  const goal = goals[active] ?? goals[0];
  if (!goal) return null;

  /** Move selection AND focus together, so the two never drift apart. */
  const select = (next: number) => {
    const index = (next + total) % total;
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select(active - 1);
        break;
      case "Home":
        event.preventDefault();
        select(0);
        break;
      case "End":
        event.preventDefault();
        select(total - 1);
        break;
      default:
        break;
    }
  };

  const tiers = groupByLevel(goal.emphasis);

  return (
    <div className="s05-guide">
      {/* ------------------------------------------------- the goal index */}
      <div
        role="tablist"
        aria-label={selectorLabel}
        aria-orientation="horizontal"
        className="s05-selector"
        onKeyDown={onKeyDown}
      >
        {goals.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`s05-goal-${item.id}`}
              aria-selected={isActive}
              aria-controls="s05-readout"
              tabIndex={isActive ? 0 : -1}
              data-active={isActive || undefined}
              className="s05-goal factory-focus"
              onClick={() => setActive(i)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------- the readout */}
      <div
        id="s05-readout"
        role="tabpanel"
        aria-labelledby={`s05-goal-${goal.id}`}
        className="s05-readout"
      >
        {/* ------------------------------------- the goal + what it leans on */}
        <div className="s05-load">
          <div key={goal.id} className="s05-load-goal s05-swap">
            <p className="s05-load-name">{goal.label}</p>
            <p className="s05-load-premise">{goal.premise}</p>
          </div>

          <div key={`${goal.id}-emphasis`} className="s05-emphasis s05-swap">
            <p className="s05-label">{emphasisLabel}</p>

            <div className="s05-tiers">
              {tiers.map((tier) => (
                <div key={tier.level} className="s05-tier" data-level={tier.level}>
                  <p className="s05-tier-word">{tier.rows[0]?.word}</p>
                  <ul role="list" className="s05-tier-list">
                    {tier.rows.map((row) => (
                      <li key={row.id}>{row.label}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="s05-emphasis-key">
              Relative emphasis, not a measurement.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------- the teaching */}
        <div key={`${goal.id}-teach`} className="s05-teach s05-swap">
          <section className="s05-priorities">
            <h3 className="s05-teach-head">{prioritiesLabel}</h3>
            <ol role="list" className="s05-teach-list">
              {goal.priorities.map((item) => (
                <li key={item.title}>
                  <p className="s05-teach-title">{item.title}</p>
                  <p className="s05-teach-detail">{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="s05-aside">
            <section className="s05-mistakes">
              <h3 className="s05-teach-head">{mistakesLabel}</h3>
              <ol role="list" className="s05-teach-list">
                {goal.mistakes.map((item) => (
                  <li key={item.mistake}>
                    <p className="s05-mistake">{item.mistake}</p>
                    <p className="s05-fix">
                      <span className="s05-fix-arrow" aria-hidden="true">
                        &rarr;
                      </span>
                      <span>{item.instead}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="s05-track">
              <h3 className="s05-teach-head">{trackLabel}</h3>
              <ul role="list" className="s05-teach-list">
                {goal.track.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* ---------------------------------------- coach's note + photograph */}
        <div className="s05-note">
          {artifact}

          <div key={`${goal.id}-note`} className="s05-note-body s05-swap">
            <p className="s05-label" data-accent="true">
              {coachNoteLabel}
            </p>
            <p className="s05-note-text">{goal.coachNote}</p>
            {goal.gymNote && (
              <p className="s05-note-gym">
                <span className="s05-note-gym-label">{gymNoteLabel}</span>
                {goal.gymNote}
              </p>
            )}
          </div>
        </div>

        {/* --------------------------------------------- goal → path handoff */}
        <div className="s05-handoff">
          <p className="s05-label">{handoffLabel}</p>

          <div key={`${goal.id}-handoff`} className="s05-handoff-body s05-swap">
            <p className="s05-handoff-path">
              <span className="s05-handoff-goal">{goal.label}</span>
              <span className="s05-handoff-arrow" aria-hidden="true">
                &rarr;
              </span>
              <span className="s05-handoff-line">
                {/* Keep each "+" with the word before it, so a line never
                    starts with a stray operator. */}
                {goal.path.replace(/ \+ /g, "\u00a0+ ")}
              </span>
            </p>

            <div className="s05-handoff-actions">
              <Button href={goal.ctaHref} className="s05-cta">
                {primaryCtaLabel} &rarr;
              </Button>
              {/* Only rendered when the goal maps to a genuinely verified
                  program — resolved on the server, see trainingLoadout.ts. */}
              {goal.programName && (
                <Button href="#programs" variant="secondary" className="s05-cta-alt">
                  {secondaryCtaLabel}: {goal.programName} &rarr;
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
