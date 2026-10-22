/**
 * CAMPAIGN MODAL — session rule.
 *
 * ONE intentional rule, independent of campaign and phase:
 *
 *   The modal auto-opens once per browser SESSION (tab). After it has opened it
 *   does not auto-open again in that session — not on re-render, not on
 *   navigation, not on reload, not when the engine advances to a different
 *   campaign. A new session (new tab / window, or a browser restart) starts
 *   with empty sessionStorage and therefore opens it again. The floating
 *   reminder remains available to reopen it on demand.
 *
 * The flag is recorded when the modal OPENS, not when it is closed, so a visitor
 * who reloads without dismissing it is not prompted a second time.
 *
 * WHY A SINGLE, VERSIONED KEY
 *   Earlier builds keyed the flag per campaign state (`factory-offer-modal:<id>:<phase>`).
 *   A leftover key from a previous test run could then silently suppress a
 *   campaign for the rest of that tab's life. This rule reads only the one
 *   versioned key below, so legacy keys can never suppress the modal; they are
 *   also removed on first run so nothing stale lingers.
 *
 * Pure functions over a minimal Storage-like interface, so the rule is unit
 * testable without a browser. Storage that throws (privacy mode, disabled
 * storage) degrades to "show once per page load".
 */

/** Current session flag. Bump the suffix to deliberately re-arm every session. */
export const OFFER_SESSION_KEY = "factory-offer-session:v2";

/** Prefix of the retired per-campaign keys. Never read; only cleaned up. */
export const LEGACY_OFFER_SESSION_PREFIX = "factory-offer-modal:";

export interface OfferSessionStore {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** True when the modal has already auto-opened in this session. */
export function hasOfferOpenedThisSession(store: OfferSessionStore | null | undefined): boolean {
  if (!store) return false;
  try {
    return store.getItem(OFFER_SESSION_KEY) !== null;
  } catch {
    return false;
  }
}

/** Records that the modal has auto-opened. Failure only costs persistence. */
export function markOfferOpenedThisSession(store: OfferSessionStore | null | undefined): void {
  if (!store) return;
  try {
    store.setItem(OFFER_SESSION_KEY, "1");
  } catch {
    // Storage unavailable: the guard then lasts for this page load only.
  }
}

/** Removes retired per-campaign flags left by earlier builds or test runs. */
export function clearLegacyOfferFlags(store: OfferSessionStore | null | undefined): void {
  if (!store) return;
  try {
    const stale: string[] = [];
    for (let index = 0; index < store.length; index += 1) {
      const key = store.key(index);
      if (key && key.startsWith(LEGACY_OFFER_SESSION_PREFIX)) stale.push(key);
    }
    for (const key of stale) store.removeItem(key);
  } catch {
    // Best-effort cleanup only.
  }
}
