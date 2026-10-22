// Zero-dependency tests for Section 03 (Why Choose Us / "The Roof").
// Run: node --test scripts/why-choose-us.test.mjs  (Node >= 22.18 type stripping)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { whyChooseUs, whyChooseUsConfiguration } from "../lib/why-choose-us.ts";

const SECTION_SRC = readFileSync(
  new URL("../components/sections/WhyChooseUs.tsx", import.meta.url),
  "utf8"
);
const CSS_SRC = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const PAGE_SRC = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

// The poster's own stylesheet block, with comments stripped so assertions read
// declarations only.
const POSTER_START = CSS_SRC.lastIndexOf("/*", CSS_SRC.indexOf("Pass 6 (revised)"));
const POSTER_END = CSS_SRC.lastIndexOf("/*", CSS_SRC.indexOf("Pass 8 "));
const POSTER_CSS = CSS_SRC.slice(POSTER_START, POSTER_END).replace(/\/\*[\s\S]*?\*\//g, "");

// --------------------------------------------------------------------- data

test("reasons carry real content and are rendered verbatim", () => {
  assert.ok(whyChooseUs.length >= 1);
  for (const item of whyChooseUs) {
    assert.ok(item.title.trim().length > 0);
    assert.ok(item.description.trim().length > 0);
  }
  assert.match(SECTION_SRC, /\{item\.title\}/);
  assert.match(SECTION_SRC, /\{item\.description\}/);
});

test("the eyebrow and headline are authored data, not hardcoded", () => {
  const { eyebrow, headline } = whyChooseUsConfiguration;
  assert.ok(eyebrow.trim().length > 0);
  assert.ok(headline.trim().length > 0 && headline.length <= 90);
  assert.match(SECTION_SRC, /\{eyebrow\}/);
  assert.match(SECTION_SRC, /\{headline\}/);
  assert.equal(SECTION_SRC.includes(headline), false, "headline text lives in the data file");
});

test("reasons do not repeat facts owned by About or Programs", () => {
  // Section 01 owns counts, floors and amenities; Section 02 owns programs.
  // A reason here states method, education, nutrition or integration, so it
  // carries no figures and none of About's facility vocabulary.
  for (const item of whyChooseUs) {
    const text = `${item.title} ${item.description}`.toLowerCase();
    assert.equal(/\d/.test(text), false, `"${item.title}" carries a figure`);
    for (const owned of [
      "station",
      "air-condition",
      "locker",
      "shower",
      "changing room",
      "wi-fi",
      "floor",
    ]) {
      assert.equal(text.includes(owned), false, `"${item.title}" repeats About's "${owned}"`);
    }
  }
});

test("the headline makes no superlative claim", () => {
  const headline = whyChooseUsConfiguration.headline.toLowerCase();
  for (const banned of ["best", "no.1", "#1", "number one", "leading", "top-rated", "finest"]) {
    assert.equal(headline.includes(banned), false, `headline must not say "${banned}"`);
  }
});

// -------------------------------------------------------------- composition

test("heading hierarchy is one h2 with h3 reason titles", () => {
  assert.equal((SECTION_SRC.match(/<h2/g) ?? []).length, 1);
  assert.match(SECTION_SRC, /id="why-choose-us-heading"/);
  assert.match(SECTION_SRC, /aria-labelledby="why-choose-us-heading"/);
  assert.match(SECTION_SRC, /<h3 className="factory-poster-title">/);
  assert.match(SECTION_SRC, /<ul\b/);
  assert.match(SECTION_SRC, /<li\b/);
  assert.match(SECTION_SRC, /id="why-choose-us"/);
});

test("the section is type only: no photograph, no decoration, no client island", () => {
  assert.equal(SECTION_SRC.includes("<Image"), false);
  assert.equal(/next\/image/.test(SECTION_SRC), false);
  assert.equal(/"use client"/.test(SECTION_SRC), false, "stays a Server Component");
  assert.equal(/aria-hidden/.test(SECTION_SRC), false, "there is nothing decorative to hide");
  assert.equal(/components\/motion\/(?!Reveal)/.test(SECTION_SRC), false);
});

test("columns adapt to the number of reasons", () => {
  assert.match(SECTION_SRC, /--poster-columns/);
  assert.match(SECTION_SRC, /Math\.min\(Math\.max\(whyChooseUs\.length, 1\), 4\)/);
  assert.match(POSTER_CSS, /repeat\(var\(--poster-columns, 3\), minmax\(0, 1fr\)\)/);
  // One column below lg so the headline and reasons stack on phones/tablets.
  assert.match(POSTER_CSS, /\.factory-poster-columns \{\s*display: grid;\s*grid-template-columns: minmax\(0, 1fr\);/);
});

test("descriptions share one line even when a title wraps", () => {
  assert.match(POSTER_CSS, /grid-template-rows: subgrid;/);
  assert.match(POSTER_CSS, /grid-row: span 2;/);
  assert.match(POSTER_CSS, /\.factory-poster-desc \{[^}]*text-wrap: pretty;/);
});

// ------------------------------------------------------------------- colour

test("the field is the AA-safe primary fill and all text is the foreground token", () => {
  assert.match(POSTER_CSS, /\.factory-poster \{[^}]*background: var\(--brand-primary-ui\);/);
  assert.match(POSTER_CSS, /\.factory-poster \{[^}]*color: var\(--accent-foreground\);/);
  for (const cls of [
    ".factory-poster-eyebrow",
    ".factory-poster-headline",
    ".factory-poster-title",
    ".factory-poster-desc",
  ]) {
    const rule = new RegExp(`${cls.replace(".", "\\.")} \\{[^}]*color: var\\(--accent-foreground\\);`);
    assert.match(POSTER_CSS, rule, `${cls} uses the foreground colour`);
  }
});

test("nothing on the field uses a colour that fails contrast there", () => {
  assert.equal(POSTER_CSS.includes("--text-secondary"), false, "no dimmed grey on the field");
  assert.equal(POSTER_CSS.includes("--brand-secondary"), false, "no secondary-role colour on the field");
  assert.equal(/color:\s*var\(--accent\)/.test(POSTER_CSS), false, "no raw accent text on the accent field");
  assert.equal(/opacity\s*:/.test(POSTER_CSS), false, "no opacity-dimmed text");
});

test("the poster is undecorated", () => {
  assert.equal(/gradient|box-shadow|filter:|clip-path|::before|::after|animation:/.test(POSTER_CSS), false);
});

// ---------------------------------------------------------------- lineage

test("the superseded blueprint composition is fully removed", () => {
  for (const gone of [
    "../components/motion/WhyChooseBlueprint.tsx",
    "../components/motion/blueprintField.ts",
    "../components/motion/WhyChooseInteractive.tsx",
  ]) {
    assert.equal(existsSync(new URL(gone, import.meta.url)), false, `${gone} is deleted`);
  }
  for (const dead of [
    "factory-blueprint",
    "factory-annotation",
    "factory-dossier",
    "factory-principle-",
    "--wcu-",
  ]) {
    assert.equal(CSS_SRC.includes(dead), false, `${dead} rules are gone`);
  }
});

test("the section still sits between Programs and Transformations behind its own toggle", () => {
  assert.match(PAGE_SRC, /\{sections\.whyChooseUs && <WhyChooseUs \/>\}/);
  const programs = PAGE_SRC.indexOf("<Programs");
  const why = PAGE_SRC.indexOf("<WhyChooseUs");
  const transformations = PAGE_SRC.indexOf("<Transformations");
  assert.ok(programs !== -1 && why !== -1 && transformations !== -1);
  assert.ok(programs < why && why < transformations);
});

test("entrance motion reuses the shared primitives and respects reduced motion", () => {
  assert.match(SECTION_SRC, /import \{ Reveal \} from "@\/components\/motion\/Reveal"/);
  assert.match(SECTION_SRC, /factory-stagger-child/);
  // The shared reduced-motion block settles both primitives.
  assert.match(
    CSS_SRC,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.factory-stagger-child,\s*\.reveal-visible \.factory-stagger-child \{\s*opacity: 1;/
  );
});

test("frozen sections keep their own surfaces and rows", () => {
  for (const cls of [
    ".factory-program-row",
    ".factory-zone-row",
    ".factory-image-mask",
    ".factory-section-display",
    ".factory-group-label",
    ".factory-index",
  ]) {
    assert.ok(CSS_SRC.includes(cls), `${cls} is still defined`);
  }
});
