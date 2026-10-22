// Zero-dependency tests for Section 04 (Transformations / Member Dossier).
// Run: node --test scripts/transformations.test.mjs  (Node >= 22.18 type stripping)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transformations } from "../lib/transformations.ts";
import {
  buildEvidence,
  buildMetricCells,
  formatFigure,
  LEAD_PRIORITY,
  MAX_FIGURES,
  MAX_METRIC_CELLS,
  METRIC_ORDER,
} from "../components/sections/transformationDossier.ts";

const SECTION_SRC = readFileSync(
  new URL("../components/sections/Transformations.tsx", import.meta.url),
  "utf8"
);
const NAV_SRC = readFileSync(
  new URL("../components/motion/TransformationNav.tsx", import.meta.url),
  "utf8"
);
const SCRUB_SRC = readFileSync(
  new URL("../components/motion/TransformationScrubber.tsx", import.meta.url),
  "utf8"
);
const METHOD_SRC = readFileSync(
  new URL("../components/motion/MethodDisclosure.tsx", import.meta.url),
  "utf8"
);
const CSS_SRC = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

// The Section 04 stylesheet block only — assertions below must never pass or
// fail because of a frozen section's rules. The slice is bounded at BOTH ends:
// it originally ran to the end of the file, which silently absorbed every
// stylesheet block appended after it (Section 05's `box-shadow` and its own
// reduced-motion block both landed inside "Section 04" and broke these tests).
const S4_START = CSS_SRC.indexOf("Pass 8 \u2014 Section 04");
const S4_NEXT = CSS_SRC.indexOf("\n * Pass ", S4_START + 1);
const S4_CSS = CSS_SRC.slice(S4_START, S4_NEXT === -1 ? undefined : S4_NEXT);
assert.ok(S4_CSS.length > 2000, "the Section 04 CSS block was located");
assert.equal(S4_CSS.includes(".s05-"), false, "the slice stops before Section 05");

/** The declaration body of a top-level rule, e.g. rule(".factory-evidence-media"). */
function rule(selector) {
  const at = S4_CSS.indexOf(`\n${selector} {`);
  assert.notEqual(at, -1, `${selector} is defined`);
  const start = S4_CSS.indexOf("{", at);
  return S4_CSS.slice(start + 1, S4_CSS.indexOf("}", start));
}

// ------------------------------------------------------- figure derivation

test("the ledger reads in one fixed commercial order for every gym", () => {
  const cells = buildMetricCells({
    sessionsPerWeek: 4,
    afterWaistCm: 84,
    beforeWaistCm: 96,
    afterBmi: 21.7,
    beforeBmi: 24.9,
    afterBodyFatPct: 19.1,
    beforeBodyFatPct: 28.4,
    afterWeightKg: 71,
    beforeWeightKg: 82,
    durationMonths: 3,
  });
  assert.deepEqual(
    cells.map((c) => c.key),
    ["duration", "weight", "bodyFat", "bmi", "waist", "load"]
  );
  // Authored key order in the data must not change the rendered order.
  assert.deepEqual([...METRIC_ORDER], cells.map((c) => c.key));
  assert.equal(cells.length, MAX_METRIC_CELLS);
});

test("figures render as before → after with a signed derived change", () => {
  const [weight] = buildMetricCells({ beforeWeightKg: 82, afterWeightKg: 71 });
  assert.equal(weight.value, "82 \u2192 71 kg");
  assert.equal(weight.note, "\u221211 kg", "a true minus sign, not a hyphen");

  const [gain] = buildMetricCells({ beforeWeightKg: 64, afterWeightKg: 70.5 });
  assert.equal(gain.value, "64 \u2192 70.5 kg");
  assert.equal(gain.note, "+6.5 kg", "muscle-building cases read as a gain");

  const [bmi] = buildMetricCells({ beforeBmi: 24.9, afterBmi: 21.7 });
  assert.equal(bmi.value, "24.9 \u2192 21.7", "BMI carries no unit");
  assert.equal(bmi.note, "\u22123.2");

  const [fat] = buildMetricCells({ beforeBodyFatPct: 31.2, afterBodyFatPct: 21.6 });
  assert.equal(fat.value, "31.2 \u2192 21.6 %");
  assert.equal(fat.note, "\u22129.6 pts", "percentage points, never % of %");
});

test("a change of zero produces no derived note rather than '0'", () => {
  const [flat] = buildMetricCells({ beforeWeightKg: 80, afterWeightKg: 80 });
  assert.equal(flat.value, "80 \u2192 80 kg");
  assert.equal(flat.note, undefined);
});

test("duration and training load read as athletic notation", () => {
  assert.equal(buildMetricCells({ durationMonths: 1 })[0].value, "01 month");
  assert.equal(buildMetricCells({ durationMonths: 6 })[0].value, "06 months");
  assert.equal(buildMetricCells({ durationMonths: 12 })[0].value, "12 months");
  assert.equal(buildMetricCells({ sessionsPerWeek: 4 })[0].value, "4\u00d7 / week");
});

test("a half-supplied pair renders nothing at all — never 'BMI —'", () => {
  for (const partial of [
    { beforeWeightKg: 82 },
    { afterWeightKg: 71 },
    { beforeBmi: 24.9 },
    { afterBodyFatPct: 19 },
    { beforeWaistCm: 96 },
  ]) {
    assert.deepEqual(buildMetricCells(partial), [], JSON.stringify(partial));
  }
  assert.deepEqual(buildMetricCells(undefined), []);
  assert.deepEqual(buildMetricCells({}), []);
});

test("unusable numbers are dropped, not rendered", () => {
  assert.deepEqual(
    buildMetricCells({
      durationMonths: 0,
      sessionsPerWeek: Number.NaN,
      beforeWeightKg: Number.POSITIVE_INFINITY,
      afterWeightKg: 71,
      beforeBmi: -24.9,
      afterBmi: 21.7,
    }),
    []
  );
  // A string smuggled in from a CMS must not reach the page.
  assert.deepEqual(buildMetricCells({ durationMonths: "3" }), []);
});

test("the ledger is capped, so 'more data' can never break the composition", () => {
  const everything = {
    durationMonths: 3,
    beforeWeightKg: 82,
    afterWeightKg: 71,
    beforeBodyFatPct: 28,
    afterBodyFatPct: 19,
    beforeBmi: 24.9,
    afterBmi: 21.7,
    beforeWaistCm: 96,
    afterWaistCm: 84,
    sessionsPerWeek: 4,
  };
  assert.equal(buildMetricCells(everything).length, MAX_METRIC_CELLS);
  assert.equal(buildMetricCells(everything, 99).length, MAX_METRIC_CELLS);
  assert.equal(buildMetricCells(everything, 4).length, 4);
  assert.deepEqual(buildMetricCells(everything, 0), []);
  assert.equal(formatFigure(21.749), "21.7");
  assert.equal(formatFigure(71.0), "71");
});

// ------------------------------------------------------- evidence summary

test("the headline result is the scale change, never the duration", () => {
  const { lead, figures, meta } = buildEvidence({
    durationMonths: 6,
    beforeWeightKg: 92,
    afterWeightKg: 78,
    beforeBmi: 29.4,
    afterBmi: 24.9,
    beforeBodyFatPct: 31.2,
    afterBodyFatPct: 21.6,
    sessionsPerWeek: 4,
  });
  assert.equal(lead.key, "weight");
  assert.equal(lead.note, "\u221214 kg");
  assert.equal(lead.value, "92 \u2192 78 kg");
  // Supporting figures keep METRIC_ORDER and never include programme facts.
  assert.deepEqual(figures.map((c) => c.key), ["bodyFat", "bmi"]);
  // Duration and load move to the case header, in plain sentence case.
  assert.deepEqual(meta, ["6 months", "4 sessions / week"]);
  assert.deepEqual([...LEAD_PRIORITY], ["weight", "bodyFat", "waist", "bmi"]);
});

test("the lead falls back through the priority list and prefers a real change", () => {
  // No weight: body fat leads.
  assert.equal(
    buildEvidence({ beforeBodyFatPct: 28, afterBodyFatPct: 19, beforeBmi: 25, afterBmi: 22 }).lead
      .key,
    "bodyFat"
  );
  // Weight unchanged but waist changed: the changed pair leads.
  const flat = buildEvidence({
    beforeWeightKg: 80,
    afterWeightKg: 80,
    beforeWaistCm: 96,
    afterWaistCm: 88,
  });
  assert.equal(flat.lead.key, "waist");
  assert.deepEqual(flat.figures.map((c) => c.key), ["weight"]);
  // Nothing changed at all: the top pair still leads, as a plain span.
  const still = buildEvidence({ beforeWeightKg: 80, afterWeightKg: 80 });
  assert.equal(still.lead.key, "weight");
  assert.equal(still.lead.note, undefined);
});

test("programme-only data yields meta and no result — never a fake headline", () => {
  const sparse = buildEvidence({ durationMonths: 1, sessionsPerWeek: 1 });
  assert.equal(sparse.lead, undefined);
  assert.deepEqual(sparse.figures, []);
  assert.deepEqual(sparse.meta, ["1 month", "1 session / week"]);
  assert.deepEqual(buildEvidence(undefined), { lead: undefined, figures: [], meta: [] });
});

test("supporting figures are capped at three", () => {
  const all = buildEvidence({
    beforeWeightKg: 82,
    afterWeightKg: 71,
    beforeBodyFatPct: 28,
    afterBodyFatPct: 19,
    beforeBmi: 24.9,
    afterBmi: 21.7,
    beforeWaistCm: 96,
    afterWaistCm: 84,
  });
  assert.equal(MAX_FIGURES, 3);
  assert.deepEqual(all.figures.map((c) => c.key), ["bodyFat", "bmi", "waist"]);
});

// ------------------------------------------------------------------- data

test("every rendered case is consent verified and photograph backed", () => {
  assert.ok(transformations.length >= 1);
  for (const item of transformations) {
    assert.equal(item.consentVerified, true, "demo data only ships consented cases");
    assert.ok(item.image.startsWith("/assets/transformations/"));
    assert.ok(item.imageAlt.trim().length >= 30, "alt text describes the photograph");
    assert.equal(
      Boolean(item.beforeImage) === Boolean(item.afterImage),
      true,
      "split assets only ever come as a genuine pair"
    );
  }
  // Consent is a hard gate in the component, not a styling choice.
  assert.match(SECTION_SRC, /transformations\.filter\(\(t\) => t\.consentVerified\)/);
  assert.match(SECTION_SRC, /if \(cases\.length === 0\) return null;/);
});

test("a case title never repeats its journey", () => {
  for (const item of transformations) {
    if (item.personName && item.journey) {
      assert.equal(
        item.personName.toLowerCase().includes(item.journey.toLowerCase()),
        false,
        `"${item.personName}" is a synthetic label repeating "${item.journey}"`
      );
    }
  }
  // Title falls back name → journey → case number; the journey tag only
  // renders beside a real name.
  assert.match(SECTION_SRC, /item\.personName \?\? item\.journey \?\? `Case \$\{pad\(index \+ 1\)\}`/);
  assert.match(SECTION_SRC, /showJourneyTag = Boolean\(item\.personName && item\.journey\)/);
});

test("consent is stated once and the headline sells progress, not compliance", () => {
  assert.equal((SECTION_SRC.match(/member consent/g) ?? []).length, 1);
  assert.equal(SECTION_SRC.includes("consented"), false);
  assert.equal(SECTION_SRC.includes("real consent"), false);
  assert.match(SECTION_SRC, /Real progress\./);
});

test("demo figures are labelled synthetic and the sparse case proves degradation", () => {
  const DATA_SRC = readFileSync(new URL("../lib/transformations.ts", import.meta.url), "utf8");
  assert.match(DATA_SRC, /SYNTHETIC FIGURES/, "demo numbers are flagged, never presented as real");

  const [complete, second] = transformations;
  assert.equal(buildMetricCells(complete.metrics).length >= 4, true, "a full dossier shows 4+");
  assert.ok(complete.training?.length && complete.nutrition?.length && complete.coachNotes?.length);
  // Both demo cases are now data-complete.
  assert.equal(buildMetricCells(second.metrics).length >= 4, true);
  assert.ok(second.training?.length && second.nutrition?.length && second.coachNotes?.length);

  // Degradation is proven on a synthetic sparse input, not on the demo data:
  // only what was recorded is shown.
  assert.deepEqual(
    buildMetricCells({ durationMonths: 4, sessionsPerWeek: 5 }).map((c) => c.key),
    ["duration", "load"]
  );
});

test("optional dossier blocks are conditionally rendered, never emptied", () => {
  for (const guard of [
    /\{hasFigures && \(/,
    /\{lead && \(/,
    /\{item\.story && \(/,
    /\{showJourneyTag && \(/,
    /\{meta\.length > 0 && \(/,
    /\{hasMethod && \(/,
    /item\.training && item\.training\.length > 0 && \(/,
    /item\.nutrition && item\.nutrition\.length > 0 && \(/,
    /item\.coachNotes && item\.coachNotes\.length > 0 && \(/,
    /\{hasProtocol && \(/,
  ]) {
    assert.match(SECTION_SRC, guard);
  }
  // Nothing may hardcode a placeholder dash for a missing figure.
  assert.equal(/["'>]\s*\u2014\s*["'<]/.test(SECTION_SRC), false, "no em-dash placeholders");
  assert.equal(SECTION_SRC.includes("N/A"), false);
});

// ------------------------------------------------- media frame (not a crop)

test("the plate is width driven with a derived height at every breakpoint", () => {
  const media = rule(".factory-evidence-media");
  assert.match(media, /aspect-ratio: var\(--evidence-ratio/);
  assert.match(media, /width: 100%/);
  // The whole point: no authored height anywhere in the Section 04 block.
  assert.equal(
    /(^|[\s;{])(height|min-height|max-height):\s*(?!100%)/m.test(
      S4_CSS.replace(/\/\*[\s\S]*?\*\//g, "")
    ),
    true,
    "sanity: the regex below is meaningful"
  );
  const declarations = S4_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const mediaRule = declarations.slice(
    declarations.indexOf(".factory-evidence-media {"),
    declarations.indexOf("}", declarations.indexOf(".factory-evidence-media {"))
  );
  for (const banned of ["height:", "min-height:", "max-height:", "vh"]) {
    assert.equal(mediaRule.includes(banned), false, `the plate declares no ${banned}`);
  }
});

test("three frame tokens cover portrait, diptych and landscape uploads", () => {
  assert.match(S4_CSS, /\[data-aspect="portrait"\]\s*\{\s*--evidence-ratio: 4 \/ 5;/);
  assert.match(S4_CSS, /\[data-aspect="square"\]\s*\{\s*--evidence-ratio: 1 \/ 1;/);
  assert.match(S4_CSS, /\[data-aspect="wide"\]\s*\{\s*--evidence-ratio: 3 \/ 2;/);
  // Default frame for a combined diptych, portrait when a split pair exists.
  assert.match(
    SECTION_SRC,
    /item\.mediaAspect \?\? \(hasSplitAssets \? "portrait" : "square"\)/
  );
});

test("photographs are contained, never cover-cropped", () => {
  assert.match(SECTION_SRC, /className="object-contain object-center"/);
  assert.equal(SECTION_SRC.includes("object-cover"), false);
  assert.equal(SCRUB_SRC.includes("object-cover"), false);
  assert.equal((SCRUB_SRC.match(/object-contain/g) ?? []).length, 2);
});

test("the plate height is capped so it cannot dominate a laptop viewport", () => {
  // ONE width token, consumed by the media column AND the ledger's lead cell:
  // that shared value is what puts the headline figure exactly above the
  // photograph, and (via aspect-ratio) is the section's only height control.
  assert.match(rule(".factory-evidence-sheet"), /--evidence-col: clamp\(16rem, 42vw, 34rem\)/);
  assert.equal(
    (S4_CSS.match(/minmax\(0, var\(--evidence-col\)\)/g) ?? []).length,
    1,
    "the photograph column is the only consumer of the width token"
  );
  // 34rem = 544px: a square frame is then ~544px tall on any display from
  // 1296px up, versus ~915px in the superseded composition. Short laptops
  // lower the CAP (not a height) so the derived height follows.
  assert.match(
    S4_CSS,
    /@media \(min-width: 1024px\) and \(max-height: 800px\) \{\s*\.factory-evidence-sheet \{\s*--evidence-col: clamp\(16rem, 38vw, 30rem\)/
  );
});

test("no neighbouring case ever leaks into view, and every case is reachable", () => {
  // Gap = 2 x gutter: the next case starts one gutter beyond the scrollport,
  // and max scrollLeft equals the last snap position exactly (see the
  // derivation in globals.css). One token, no per-breakpoint arithmetic.
  const track = rule(".factory-evidence-track");
  assert.match(track, /--evidence-gutter: var\(--container-pad\)/);
  assert.match(track, /gap: calc\(2 \* var\(--evidence-gutter\)\)/);
  assert.match(track, /padding-inline: var\(--evidence-gutter\)/);
  assert.match(track, /scroll-padding-inline: var\(--evidence-gutter\)/);
  assert.match(track, /margin-inline: calc\(-1 \* var\(--evidence-gutter\)\)/);
  assert.match(rule(".factory-evidence-case"), /flex: 0 0 100%/);
  // The superseded peek (clipped neighbour text, FAB collisions) is gone.
  assert.equal(S4_CSS.includes("--evidence-peek"), false);
  assert.equal(S4_CSS.includes("100vw - 9rem"), false);
  // The native scrollbar under the sheet read as a bug: hidden everywhere.
  assert.match(track, /scrollbar-width: none/);
  assert.match(S4_CSS, /\.factory-evidence-track::-webkit-scrollbar \{\s*display: none;/);
});

test("each case links to the next one at its foot", () => {
  assert.match(SECTION_SRC, /id=\{caseAnchor\(i\)\}/);
  assert.match(SECTION_SRC, /href=\{`#\$\{caseAnchor\(nextIndex\)\}`\}/);
  assert.match(SECTION_SRC, /\{total > 1 && \(/, "no self-link for a single case");
  assert.match(SECTION_SRC, /isLast \? "Back to" : "Next case"/);
  // Fragment landings clear the floating header.
  assert.match(rule(".factory-evidence-case"), /scroll-margin-top: calc\(var\(--header-h\)/);
});

test("images below the fold stay lazy with real sizes hints", () => {
  assert.match(SECTION_SRC, /loading="lazy"/);
  assert.match(
    SECTION_SRC,
    /sizes="\(min-width: 1024px\) 34rem, \(min-width: 768px\) 42vw, 92vw"/
  );
  assert.match(SCRUB_SRC, /sizes="\(min-width: 1024px\) 34rem/);
});

// ---------------------------------------------------------- the composition

test("the case is one grid: proof second, result beside it, method below", () => {
  const sheet = rule(".factory-evidence-sheet");
  assert.match(sheet, /display: grid/);
  // Phones: identity → result caption → proof → result → method → foot.
  assert.match(sheet, /"head"\s*"glance"\s*"media"\s*"ledger"\s*"method"\s*"foot"/);
  // Tablet: result beside the plate, method spans the sheet.
  assert.match(S4_CSS, /"head\s+head"\s*"media\s+ledger"\s*"method method"\s*"foot\s+foot"/);
  // Desktop: two columns — plate (photograph + member account) and evidence.
  assert.match(S4_CSS, /"head\s+head"\s*"plate evidence"/);
  assert.match(S4_CSS, /grid-template-rows: auto auto;/);
  assert.match(rule(".factory-evidence-col"), /display: contents/);
  assert.match(S4_CSS, /\.factory-evidence-col--plate \{\s*grid-area: plate;/);
  assert.match(S4_CSS, /\.factory-evidence-col--evidence \{\s*grid-area: evidence;/);
  assert.match(rule(".factory-evidence-sheet"), /row-gap: 0/);
  for (const area of ["head", "glance", "media", "ledger", "method", "foot", "plate", "evidence"]) {
    assert.ok(S4_CSS.includes(`grid-area: ${area};`), `${area} is placed`);
  }
  // DOM order equals visual order: header, caption, figure, ledger, method, footer.
  const order = [
    "factory-evidence-case-head",
    "factory-evidence-glance\"",
    "factory-evidence-media",
    "factory-evidence-ledger",
    "<MethodDisclosure",
    "factory-evidence-foot",
  ].map((needle) => SECTION_SRC.indexOf(needle));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.ok(order.every((at) => at > -1));
});

test("phones get a one-line result caption that desktop never renders twice", () => {
  // Same figure as the ledger, hidden from assistive tech (the ledger is the
  // accessible copy) and removed from the layout from 768px.
  assert.match(SECTION_SRC, /<p className="factory-evidence-glance" aria-hidden="true">/);
  assert.match(
    S4_CSS,
    /@media \(min-width: 768px\) \{\s*\.factory-evidence-glance \{\s*display: none;/
  );
  assert.equal(S4_CSS.includes(".factory-evidence-stamp"), false, "the duplicate case stamp is gone");
  assert.equal(SECTION_SRC.includes("factory-evidence-stamp"), false);
  assert.match(rule(".factory-evidence-glance-figure"), /white-space: nowrap/);
});

test("figures never wrap and deltas are neutral, not warning red", () => {
  for (const sel of [
    ".factory-evidence-result-figure",
    ".factory-evidence-result-span",
    ".factory-evidence-metric-figure",
  ]) {
    assert.match(rule(sel), /white-space: nowrap/, `${sel} stays on one line`);
    assert.equal(rule(sel).includes("var(--accent)"), false, `${sel} is not accent`);
  }
  assert.match(rule(".factory-evidence-result-figure"), /color: var\(--text-primary\)/);
  assert.match(
    S4_CSS,
    /\.factory-evidence-axis-label\[data-after="true"\] \{\s*color: var\(--text-primary\);/
  );
  // Primary role kept for the structural rule over the result.
  assert.match(rule(".factory-evidence-ledger"), /border-top: 2px solid var\(--accent\)/);
  // The column count follows the real figure count — no blank third column.
  assert.match(rule(".factory-evidence-ledger"), /repeat\(var\(--figure-count, 3\)/);
  assert.match(SECTION_SRC, /"--figure-count": Math\.max\(1, figures\.length\)/);
});

test("micro type stays readable: no label below 0.6875rem or over-tracked", () => {
  const declarations = S4_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const sizes = [...declarations.matchAll(/font-size:\s*([\d.]+)rem;/g)].map((m) => Number(m[1]));
  assert.ok(Math.min(...sizes) >= 0.6875, `smallest size ${Math.min(...sizes)}rem`);
  const tracking = [...declarations.matchAll(/letter-spacing:\s*([\d.]+)em;/g)].map((m) =>
    Number(m[1])
  );
  assert.ok(Math.max(...tracking) <= 0.14, `widest tracking ${Math.max(...tracking)}em`);
});

test("the method collapses on phones and is open without JavaScript", () => {
  assert.match(METHOD_SRC, /^"use client";/);
  assert.match(
    METHOD_SRC,
    /<details[^>]*className="factory-evidence-method"[^>]*\sopen\s*>/
  );
  assert.match(METHOD_SRC, /<summary className="factory-evidence-method-summary factory-focus">/);
  assert.match(METHOD_SRC, /matchMedia\(PHONE\)/);
  assert.match(METHOD_SRC, /const PHONE = "\(max-width: 767px\)"/);
  // From 768px up there is no disclosure control at all.
  assert.match(
    S4_CSS,
    /@media \(min-width: 768px\) \{\s*\.factory-evidence-method-summary \{\s*display: none;/
  );
  // Once open, the hint (which repeats the group headings) steps aside.
  assert.match(
    S4_CSS,
    /\.factory-evidence-method\[open\] \.factory-evidence-method-hint \{\s*display: none;/
  );
  assert.match(rule(".factory-evidence-method-icon"), /margin-left: auto/);
});

test("exactly two panels, square and flat — nothing else in the section is a card", () => {
  const declarations = S4_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  // The only radii allowed are the consent dot (50%) and explicit resets (0):
  // no softened plates, no rounded panels, no chips.
  const radii = [...declarations.matchAll(/border-radius:\s*([^;]+);/g)].map((m) => m[1].trim());
  assert.deepEqual([...new Set(radii)].sort(), ["0", "50%"]);
  assert.equal(declarations.includes("box-shadow"), false, "no shadows");

  // The two panels — the result ledger and the member account — are the only
  // selectors that take the panel fill. A third would flatten the hierarchy.
  const fills = [...declarations.matchAll(/([^{}]+)\{[^{}]*?\n\s*background:\s*linear-gradient\(/g)]
    .map((m) => m[1].trim().replace(/\s+/g, " "))
    .filter((sel) => sel.includes("factory-evidence-ledger"));
  assert.deepEqual(fills, [".factory-evidence-ledger, .factory-evidence-story-card"]);
  assert.match(
    rule(".factory-evidence-ledger"),
    /border-top: 2px solid var\(--accent\)/,
    "the result panel's top edge is the primary rule"
  );
  // Training, nutrition and what-changed stay open rows, not panels.
  for (const sel of [".factory-evidence-protocol", ".factory-evidence-notation", ".factory-evidence-notes"]) {
    assert.equal(/background:/.test(rule(sel)), false, `${sel} is not a panel`);
  }
});

test("the member account is a desktop card under the photograph, never read twice", () => {
  // One copy inside the plate column (from 1024px), one inside the method
  // block (below 1024px); the other is display: none so assistive tech
  // meets the story once.
  assert.match(SECTION_SRC, /className="factory-evidence-story-card"/);
  assert.match(SECTION_SRC, /className="factory-evidence-story factory-evidence-story--inline"/);
  assert.match(S4_CSS, /\.factory-evidence-story-card \{\s*display: none;/);
  assert.match(
    S4_CSS,
    /@media \(min-width: 1024px\) \{\s*\.factory-evidence-story-card \{\s*display: block;/
  );
  assert.match(
    S4_CSS,
    /@media \(min-width: 1024px\) \{\s*\.factory-evidence-story--inline \{\s*display: none;/
  );
  // A method block holding only the story hides with it — no empty rule.
  assert.match(SECTION_SRC, /storyOnly=\{!hasProtocol\}/);
  assert.match(METHOD_SRC, /data-story-only=\{storyOnly \? "true" : undefined\}/);
  assert.match(S4_CSS, /\.factory-evidence-method\[data-story-only="true"\] \{\s*display: none;/);
  // The story card sits in the plate column, after the figure.
  const plate = SECTION_SRC.indexOf("factory-evidence-col--plate");
  const evidence = SECTION_SRC.indexOf("factory-evidence-col--evidence");
  const card = SECTION_SRC.indexOf('className="factory-evidence-story-card"');
  assert.ok(plate < card && card < evidence);
});

test("the foot stays left so a fixed contact button never covers 'Next case'", () => {
  assert.match(rule(".factory-evidence-foot"), /justify-content: flex-start/);
  assert.equal(rule(".factory-evidence-foot").includes("space-between"), false);
});

test("'What changed' ticks are glyphs, so every row renders the same", () => {
  const tick = rule(".factory-evidence-note::before");
  assert.match(tick, /content: "\\2014"/);
  assert.equal(/height:\s*1px/.test(tick), false, "no 1px drawn line");
});

// ------------------------------------------------------------- background

test("the horizontal-rule wallpaper is gone and not reintroduced", () => {
  assert.equal(CSS_SRC.includes("factory-ledger"), false, "the old ledger block is deleted");
  assert.equal(CSS_SRC.includes("factory-ledger-rules"), false);
  const declarations = S4_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.equal(
    declarations.includes("repeating-linear-gradient"),
    false,
    "no line wallpaper in any form"
  );
  assert.equal(declarations.includes("repeating-radial-gradient"), false);
});

test("the athletic motif is one masked weight plate kept clear of the copy", () => {
  const ring = rule(".factory-evidence-field::before");
  // Outer rim, inner rim, collar and hub — one plate, not an icon grid.
  assert.equal((ring.match(/radial-gradient\(\s*circle at 50% 50%/g) ?? []).length, 4);
  // Centred on the chapter's top-right corner and radially faded, so it
  // cannot cross the headline, the sheets or the figures.
  assert.match(ring, /top: calc\(-1 \* min\(22rem, 46vw\)\)/);
  assert.match(ring, /right: calc\(-1 \* min\(22rem, 46vw\)\)/);
  assert.match(ring, /mask-image: radial-gradient\(closest-side/);
  // The diagonal training-plane hairlines that crossed the content are gone.
  assert.equal(S4_CSS.includes(".factory-evidence-field::after"), false);

  const opacities = [rule(".factory-evidence-field::before"), rule(".factory-evidence-grain")].map(
    (body) => Number.parseFloat(body.match(/opacity:\s*([\d.]+)/)[1])
  );
  for (const value of opacities) {
    assert.ok(value >= 0.02 && value <= 0.06, `${value} sits in the 2-6% band`);
  }
  // Decorative surfaces are hidden from assistive tech.
  for (const cls of ["factory-evidence-field", "factory-evidence-grain"]) {
    assert.match(SECTION_SRC, new RegExp(`className="${cls}" aria-hidden="true"`));
  }
});

// ------------------------------------------------- semantics/accessibility

test("heading hierarchy is one h2, an h3 per case and h4 group labels", () => {
  assert.equal((SECTION_SRC.match(/<h2/g) ?? []).length, 1);
  assert.match(SECTION_SRC, /id="transformations-heading"/);
  assert.match(SECTION_SRC, /aria-labelledby="transformations-heading"/);
  assert.match(
    SECTION_SRC,
    /<h3 id=\{`\$\{caseAnchor\(i\)\}-title`\} className="factory-evidence-member">/
  );
  assert.match(SECTION_SRC, /aria-labelledby=\{`\$\{caseAnchor\(i\)\}-title`\}/);
  assert.ok((SECTION_SRC.match(/<h4 className="factory-group-label/g) ?? []).length >= 3);
  assert.equal(NAV_SRC.includes("<h"), false, "the register control adds no headings");
  assert.equal(METHOD_SRC.includes("<h"), false, "the disclosure adds no headings");
});

test("the photograph is a figure whose caption is the before/after axis", () => {
  assert.match(SECTION_SRC, /<figure className="factory-evidence-media"/);
  assert.match(SECTION_SRC, /<figcaption className="factory-evidence-axis">/);
  // The labels are content (they name the halves); only the tick is decorative.
  assert.match(SECTION_SRC, /factory-evidence-axis-tick" aria-hidden="true"/);
  assert.equal(
    /factory-evidence-axis" aria-hidden/.test(SECTION_SRC),
    false,
    "before/after labels stay readable by assistive tech"
  );
  // Figures and notation are description lists, so each value keeps its label.
  assert.ok((SECTION_SRC.match(/<dl\s/g) ?? []).length >= 2);
  assert.match(SECTION_SRC, /<dt className="factory-evidence-metric-label">/);
  assert.match(SECTION_SRC, /<dd className="factory-evidence-metric-value">/);
  assert.match(SECTION_SRC, /<dd className="factory-evidence-result-value">/);
  // Label reads above its figure in DOM order — no visual reordering.
  assert.match(rule(".factory-evidence-metric"), /flex-direction: column;/);
});

test("case navigation is real buttons, labelled, and keyboard operable", () => {
  assert.equal((NAV_SRC.match(/type="button"/g) ?? []).length, 3);
  assert.match(NAV_SRC, /aria-label=\{`Case \$\{pad\(i \+ 1\)\}`\}/);
  assert.match(NAV_SRC, /aria-current=\{i === active \? "true" : undefined\}/);
  assert.match(NAV_SRC, /aria-label="Previous case"/);
  assert.match(NAV_SRC, /aria-label="Next case"/);
  assert.equal((NAV_SRC.match(/factory-focus/g) ?? []).length, 3);
  assert.match(NAV_SRC, /if \(caseCount <= 1\) return null;/);
  // Editorial instrumentation, not carousel chrome: no arrows over the photo.
  assert.equal(CSS_SRC.includes("factory-evidence-edge"), false);
  assert.equal(NAV_SRC.includes("setInterval"), false, "no auto-advance");
  // The register itself is native scroll-snap, so it works without this island.
  assert.match(rule(".factory-evidence-track"), /scroll-snap-type: x mandatory/);
  assert.match(rule(".factory-evidence-case"), /scroll-snap-align: start/);
});

test("the client boundary stays at three small islands", () => {
  assert.equal(SECTION_SRC.includes('"use client"'), false, "the section is a Server Component");
  assert.match(NAV_SRC, /^"use client";/);
  assert.match(SCRUB_SRC, /^"use client";/);
  assert.match(METHOD_SRC, /^"use client";/);
  assert.equal(SECTION_SRC.includes("useState"), false);
  // No animation or carousel dependency was introduced.
  const PKG = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(PKG.dependencies), ["next", "react", "react-dom"]);
});

test("reduced motion settles the composition and survives no-JS staggering", () => {
  const block = S4_CSS.slice(S4_CSS.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(block, /\.factory-evidence-mask[\s\S]*clip-path: inset\(0 0 0 0\)/);
  assert.match(block, /\.factory-evidence-axis-tick::before[\s\S]*scaleY\(1\)/);
  for (const cls of [
    "factory-evidence-metric",
    "factory-evidence-notation-item",
    "factory-evidence-note",
  ]) {
    assert.ok(block.includes(`.${cls}`), `${cls} settles under reduced motion`);
  }
  // Entrance motion is the shared primitives only — no library, no idle loop.
  const declarations = S4_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.equal(/animation:/.test(declarations), false, "no keyframe animation in Section 04");
  assert.match(SECTION_SRC, /factory-stagger-child/);
});

// ---------------------------------------------------------- frozen sections

test("frozen sections and shared primitives are untouched", () => {
  for (const cls of [
    ".factory-container",
    ".factory-section-display",
    ".factory-group-label",
    ".factory-index",
    ".factory-eyebrow",
    ".factory-stagger-child",
    ".factory-programs-surface",
    ".factory-program-row",
    ".factory-zone-row",
    ".factory-image-mask",
    ".factory-hero-stage",
  ]) {
    assert.ok(CSS_SRC.includes(cls), `${cls} is still defined`);
  }
  // Section 04's surface no longer borrows another chapter's background.
  assert.match(rule(".factory-evidence-surface"), /linear-gradient\(180deg, #0b0b0d/);
});
