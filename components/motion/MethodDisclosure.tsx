"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Section 04 — the case's method block (member account, training, nutrition,
 * what changed) as a native <details> disclosure.
 *
 * Why: on a phone a fully expanded case is ~1,500px tall, so the next case
 * sits two screens away from its own navigation. Collapsing the method below
 * 768px keeps each case to header → photograph → figures (about one screen)
 * while every word stays one tap away.
 *
 * Progressive enhancement: the server renders the disclosure OPEN, so with
 * JavaScript unavailable the full method is visible at every width. This
 * island only closes it on mount at phone widths, and re-opens it if the
 * viewport grows past 768px (where the summary is hidden by CSS and the
 * block must never be stuck closed). Native <details>/<summary> supplies the
 * keyboard, screen-reader and find-in-page behaviour — no custom ARIA.
 */
const PHONE = "(max-width: 767px)";

export function MethodDisclosure({
  summary,
  hint,
  storyOnly = false,
  children,
}: {
  summary: string;
  hint?: string;
  /** True when the block holds only the member account. From 1024px that text
   *  is shown under the photograph instead, so the block hides entirely
   *  rather than leaving an empty rule behind. */
  storyOnly?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const query = window.matchMedia(PHONE);
    el.open = !query.matches;
    const onChange = (event: MediaQueryListEvent) => {
      // Growing to tablet/desktop: the summary is hidden there, so the block
      // must be open. Shrinking to a phone: collapse back to the compact case.
      el.open = !event.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <details
      ref={ref}
      className="factory-evidence-method"
      data-story-only={storyOnly ? "true" : undefined}
      open
    >
      <summary className="factory-evidence-method-summary factory-focus">
        <span className="factory-evidence-method-title">{summary}</span>
        {hint && <span className="factory-evidence-method-hint">{hint}</span>}
        <span className="factory-evidence-method-icon" aria-hidden="true" />
      </summary>
      <div className="factory-evidence-method-body">{children}</div>
    </details>
  );
}
