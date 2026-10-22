/**
 * DEMO ACCESS — per-gym configuration. SERVER-ONLY: imported by proxy.ts,
 * lib/demo-access/*, app/demo-access/page.tsx and app/api/demo-access/route.ts.
 * Never import this file from a "use client" component.
 */
import "server-only";

// Change this PIN to update the demo access PIN.
// (Optional: set the DEMO_ACCESS_PIN env var on Vercel to override it without
// a code change.) Changing the PIN also signs out everyone who had access.
export const DEMO_ACCESS_PIN: string = process.env.DEMO_ACCESS_PIN || "2026";

// Signing secret for the access cookie. Set DEMO_ACCESS_SECRET in the Vercel
// project's environment variables (server-side, never NEXT_PUBLIC_). This
// value is only the fallback used when that variable is missing.
export const DEMO_ACCESS_SECRET_FALLBACK = "3449bcdcfbe3df11eef4bff64f48029ba6ecbc134a43edcc34496e0c89432e65";

// Logo shown on the PIN screen (a file inside /public). This exact path is the
// only asset served without the access cookie.
export const DEMO_ACCESS_LOGO = "/assets/brand/logo.jpg";

// Cookie name (unique per gym project so demos on the same host never clash)
// and lifetime of a successful unlock.
export const DEMO_ACCESS_COOKIE_NAME = "demo_access_victory_fitness_club";
export const DEMO_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
