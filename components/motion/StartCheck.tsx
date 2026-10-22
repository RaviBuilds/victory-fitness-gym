"use client";

import { useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/ui/Button";
import { StartResult } from "@/components/motion/StartResult";
import {
  START_QUESTIONS,
  type GymContext,
  type StartAnswers,
} from "@/components/sections/startCheckLogic";
import { writeToolHandoff } from "@/lib/tool-session";
import type { WhatsAppConfig } from "@/lib/types";

/**
 * /start — the interactive "Find Your Starting Point" instrument.
 *
 * This component owns the WHOLE /start composition and switches between TWO
 * distinct UI states — it is NOT a single card that merely grows:
 *
 *   QUIZ STATE   — an asymmetric split: left brand/media (~42%) carries the
 *                  page's single H1 + concise supporting paragraph + a real
 *                  facility photograph; right (~58%) is the interactive quiz
 *                  card. The first question is visible and answerable in the
 *                  opening viewport without scrolling through editorial copy.
 *
 *   RESULT STATE — delegated to StartResult: a personalised recommendation
 *                  (starting point, weekly plan of day cards, "why this fits"
 *                  accordion, expandable starting profile) with a CTA bar
 *                  below. Everything is in normal document flow — the page
 *                  scrolls; there is no inner scroll container.
 *
 * Quiz interaction/state/logic are UNCHANGED and remain presentation-agnostic:
 * the component receives every gym fact it needs as a typed prop (whatsapp
 * config, gym name, membership anchor, call link, the derived GymContext, a
 * real brand image and the supporting paragraph) and imports no
 * business/services/pricing data itself, so the same component drops into any
 * clone unchanged.
 *
 * SEO/semantics: exactly ONE <h1> exists in BOTH states — the page headline in
 * the left column. It stays mounted in the result state (visually de-emphasised
 * via the `data-result` surface), never duplicated and never removed.
 *
 * Five single-select questions with explicit Next/Back navigation (answers are
 * preserved when going Back, no auto-advance). Entrance motion is a short CSS
 * transition that the site-wide prefers-reduced-motion block already suppresses.
 */

const TOTAL = START_QUESTIONS.length;

/** A, B, C … for the answer tiles — a clear "these are choices" signal. */
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export function StartCheck({
  whatsapp,
  gymName,
  membershipHref,
  callHref,
  gymContext,
  brandImage,
  supportingText,
}: {
  whatsapp: WhatsAppConfig;
  gymName: string;
  membershipHref: string;
  callHref?: string;
  gymContext: GymContext;
  brandImage: { src: string; alt: string };
  supportingText: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<StartAnswers>>({});

  const isResult = step >= TOTAL;
  const question = !isResult ? START_QUESTIONS[step] : null;
  const currentAnswer =
    question !== null
      ? (answers as unknown as Record<string, string | undefined>)[question.id]
      : undefined;
  const isLastQuestion = step === TOTAL - 1;
  const allAnswered = START_QUESTIONS.every(
    (q) => (answers as unknown as Record<string, string | undefined>)[q.id]
  );

  const select = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const next = () => {
    if (!currentAnswer) return;
    if (isLastQuestion) {
      if (allAnswered) {
        // Optional handoff for /first-30-days (never required there).
        writeToolHandoff({
          source: "start",
          experience: answers.experience,
          timePreference: answers.time,
          daysPerWeek: answers.days,
        });
        setStep(TOTAL);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <section
      aria-labelledby="start-check-heading"
      className="start-split"
      data-result={isResult ? "true" : undefined}
    >
      {/* ---------- LEFT COLUMN ----------
          Quiz state: brand + real facility image + the page's single H1.
          Result state: a gym-fit card + personal result (see StartResult).
          The H1 lives in the quiz-state block, which stays mounted (and
          visually de-emphasised) in the result state so there is always
          exactly one <h1> on the page. */}
      <div className="start-brand">
        {/* The single, persistent H1 + its supporting content. */}
        <div className="start-brand-media" aria-hidden="true">
          <Image
            src={brandImage.src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="start-brand-img"
          />
          <span className="start-brand-scrim" />
        </div>

        <div className="start-brand-inner">
          <div className="start-brand-eyebrow">
            <span className="start-brand-tick" aria-hidden="true" />
            <span>Find your starting point</span>
          </div>

          <h1 id="start-check-heading" className="start-brand-display">
            <span className="block">You don&apos;t need to know</span>
            <span className="block">where to start.</span>
            <span className="block text-(--accent)">We&apos;ll help you find it.</span>
          </h1>

          <p className="start-brand-support">{supportingText}</p>

          <p className="start-brand-meta" aria-hidden="true">
            5 Questions · ~60 Sec · No Sign-up
          </p>
        </div>
      </div>

      {/* ---------- RIGHT COLUMN — QUIZ STATE ONLY: the interactive card ---------- */}
      {!isResult && (
        <div className="start-stage">
          <div className="start-card">
            {/* Card identity + step/time, always visible at the top. */}
            <div className="start-card-head">
              <span className="start-card-id">Starting Point Check</span>
              <span className="start-card-step" aria-hidden="true">
                <span className="start-card-stepnum">
                  {String(step + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
                </span>
                <span className="start-card-time">~60 Sec</span>
              </span>
            </div>

            {/* Segmented progress rail — one segment per question. */}
            <div
              className="start-rail"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL}
              aria-valuenow={step + 1}
              aria-label={`Question ${step + 1} of ${TOTAL}`}
            >
              {START_QUESTIONS.map((q, i) => (
                <span
                  key={q.id}
                  className="start-rail-seg"
                  data-state={
                    i < step ? "done" : i === step ? "current" : "upcoming"
                  }
                />
              ))}
            </div>

            {/* The question + answers swap in an aria-live region. */}
            <div className="start-card-body" aria-live="polite">
              <div key={step} className="start-card-flow">
                <h2
                  className="start-question factory-stagger-in"
                  style={{ animationDelay: "40ms" }}
                >
                  {question!.prompt}
                </h2>

                <ul className="start-tiles" role="list">
                  {question!.options.map((option, i) => {
                    const selected = currentAnswer === option.value;
                    return (
                      <li
                        key={option.value}
                        className="factory-stagger-in"
                        style={{ animationDelay: `${90 + i * 40}ms` }}
                      >
                        <button
                          type="button"
                          aria-pressed={selected}
                          data-selected={selected}
                          onClick={() => select(question!.id, option.value)}
                          className="factory-focus start-tile"
                        >
                          <span className="start-tile-letter" aria-hidden="true">
                            {LETTERS[i] ?? String(i + 1)}
                          </span>
                          <span className="start-tile-label">{option.label}</span>
                          <span className="start-tile-mark" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Navigation — Next is primary and disabled until answered. */}
            <div className="start-card-nav">
              <ActionButton
                variant="ghost"
                onClick={back}
                disabled={step === 0}
                className="start-nav-back"
              >
                <span aria-hidden="true">←</span> Back
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={next}
                disabled={!currentAnswer}
                className="start-nav-next"
              >
                {isLastQuestion ? "See My Starting Point" : "Next"}
                <span aria-hidden="true">→</span>
              </ActionButton>
            </div>

            <p className="start-card-reassure">No account. No complicated form.</p>
          </div>
        </div>
      )}

      {/* ---------- RESULT STATE: results workspace (normal flow) ----------
          Spans the grid: gym-fit card, personal result panel, and a
          full-width CTA bar below. No fixed heights or inner scrolling. */}
      {isResult && (
        <StartResult
          answers={answers as StartAnswers}
          whatsapp={whatsapp}
          gymName={gymName}
          membershipHref={membershipHref}
          callHref={callHref}
          gymContext={gymContext}
          onRestart={restart}
        />
      )}
    </section>
  );
}

