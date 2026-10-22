/**
 * Accent-foreground derivation.
 *
 * `--accent-foreground` is the text colour used ON a primary-colour fill (the
 * primary button, the Why Choose Us poster). It used to be a fixed white,
 * which is only safe while the gym's accent is dark enough. A yellow or lime
 * accent with white text fails WCAG, so the foreground is derived from the
 * accent instead of being authored per gym.
 *
 * Contrast is measured against the real fill, --brand-primary-ui, which is the
 * accent mixed 5% toward black (see app/globals.css). White is kept whenever
 * it already reaches AA (4.5:1) on that fill, so a gym whose accent works with
 * white (e.g. a red #F00030 is ~4.8:1) is unaffected. Only when white
 * fails does the near-black of the dark base win, if it reads better.
 */

export const LIGHT_FOREGROUND = "#ffffff";
/** Matches --bg-primary in app/globals.css. */
export const DARK_FOREGROUND = "#09090b";

const AA_NORMAL_TEXT = 4.5;
/** --brand-primary-ui is color-mix(in srgb, var(--accent) 95%, black). */
const UI_FILL_KEEP = 0.95;

type Rgb = [number, number, number];

/** Parses "#rgb" or "#rrggbb"; returns null for anything else. */
export function parseHex(hex: string): Rgb | null {
  const value = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(value)) {
    return [0, 1, 2].map((i) => parseInt(value[i] + value[i], 16)) as Rgb;
  }
  if (/^[0-9a-f]{6}$/i.test(value)) {
    return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as Rgb;
  }
  return null;
}

/** WCAG 2.x relative luminance of an sRGB colour (channels 0-255). */
export function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two luminances (order independent). */
export function contrastRatio(a: number, b: number): number {
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** The fill the foreground sits on: the accent, 5% toward black. */
export function uiFill(accent: string): Rgb | null {
  const rgb = parseHex(accent);
  if (!rgb) return null;
  return rgb.map((v) => Math.round(v * UI_FILL_KEEP)) as Rgb;
}

/**
 * Text colour for a primary-colour fill. White unless white fails AA on the
 * fill and the dark base reads better. Unparseable input falls back to white.
 */
export function accentForeground(accent: string): string {
  const fill = uiFill(accent);
  if (!fill) return LIGHT_FOREGROUND;

  const fillLuminance = relativeLuminance(fill);
  const onWhite = contrastRatio(fillLuminance, 1);
  if (onWhite >= AA_NORMAL_TEXT) return LIGHT_FOREGROUND;

  const darkLuminance = relativeLuminance(parseHex(DARK_FOREGROUND) as Rgb);
  const onDark = contrastRatio(fillLuminance, darkLuminance);
  return onDark > onWhite ? DARK_FOREGROUND : LIGHT_FOREGROUND;
}
