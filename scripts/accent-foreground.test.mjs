// Zero-dependency tests for the accent-foreground derivation.
// Run: node --test scripts/accent-foreground.test.mjs  (Node >= 22.18 type stripping)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  accentForeground,
  contrastRatio,
  parseHex,
  relativeLuminance,
  uiFill,
  LIGHT_FOREGROUND,
  DARK_FOREGROUND,
} from "../lib/color.ts";
import { business } from "../lib/business.ts";

const LAYOUT_SRC = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

const ratioOn = (accent, foreground) =>
  contrastRatio(relativeLuminance(uiFill(accent)), relativeLuminance(parseHex(foreground)));

test("hex parsing accepts 3 and 6 digit values and rejects the rest", () => {
  assert.deepEqual(parseHex("#F00030"), [240, 0, 48]);
  assert.deepEqual(parseHex("f03"), [255, 0, 51]);
  for (const bad of ["", "#12", "#12345", "red", "#gg0000", "rgb(0,0,0)"]) {
    assert.equal(parseHex(bad), null, `${bad} is not a hex colour`);
  }
});

test("House Of Champions keeps white text on its accent (unchanged behaviour)", () => {
  assert.equal(accentForeground(business.accentColor), LIGHT_FOREGROUND);
  // The documented figure: white on the UI fill is ~4.8:1, above AA for small text.
  assert.ok(ratioOn(business.accentColor, LIGHT_FOREGROUND) >= 4.5);
});

test("a light accent gets dark text, and that choice actually reads better", () => {
  for (const light of ["#FFD400", "#C6F432", "#F5F5F5", "#00E5A8"]) {
    assert.equal(accentForeground(light), DARK_FOREGROUND, `${light} needs dark text`);
    assert.ok(
      ratioOn(light, DARK_FOREGROUND) > ratioOn(light, LIGHT_FOREGROUND),
      `${light}: dark beats white`
    );
    assert.ok(ratioOn(light, DARK_FOREGROUND) >= 4.5, `${light}: dark text reaches AA`);
  }
});

test("dark and mid accents that reach AA with white keep white", () => {
  for (const dark of ["#000000", "#1B2A49", "#B00020", "#7A1FA2", "#0B6E4F"]) {
    assert.equal(accentForeground(dark), LIGHT_FOREGROUND, `${dark} keeps white`);
    assert.ok(ratioOn(dark, LIGHT_FOREGROUND) >= 4.5);
  }
});

test("unparseable input falls back to white instead of throwing", () => {
  assert.equal(accentForeground("not-a-colour"), LIGHT_FOREGROUND);
  assert.equal(accentForeground(""), LIGHT_FOREGROUND);
});

test("the dark foreground stays in step with the dark base token", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, new RegExp(`--bg-primary:\\s*${DARK_FOREGROUND};`, "i"));
});

test("the root layout sets --accent-foreground from the derivation", () => {
  assert.match(LAYOUT_SRC, /import \{ accentForeground \} from "@\/lib\/color"/);
  assert.match(
    LAYOUT_SRC,
    /"--accent-foreground":\s*accentForeground\(business\.accentColor\)/
  );
});
