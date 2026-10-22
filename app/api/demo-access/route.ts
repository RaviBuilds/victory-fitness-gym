import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_ACCESS_COOKIE_NAME,
  DEMO_ACCESS_MAX_AGE_SECONDS,
} from "@/config/demo-access";
import { DEMO_ACCESS_PAGE } from "@/lib/demo-access/guard";
import { createAccessToken, isPinCorrect, safeNextPath } from "@/lib/demo-access/token";

/**
 * DEMO ACCESS endpoint.
 *
 *   POST /api/demo-access            form post from the PIN screen (pin, next)
 *   GET  /api/demo-access?logout=1   clears the access cookie (dev/testing)
 *
 * The PIN is checked HERE, on the server. On success a signed, HttpOnly
 * cookie is issued; on failure the visitor is sent back to the PIN screen
 * with an error flag. No client JavaScript is involved, so the PIN never
 * exists in any browser-side code.
 */

export const dynamic = "force-dynamic";

// Best-effort brute-force throttle (per server instance). It slows guessing
// down; the real protection is a PIN of sufficient length.
const MAX_FAILURES = 10;
const WINDOW_MS = 10 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

function clientKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isLocked(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    failures.set(key, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

function backToGate(request: NextRequest, error: "1" | "locked", next: string) {
  const url = new URL(DEMO_ACCESS_PAGE, request.url);
  url.searchParams.set("error", error);
  if (next !== "/") url.searchParams.set("next", next);
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const pin = typeof form?.get("pin") === "string" ? (form!.get("pin") as string).trim() : "";
  const next = safeNextPath(typeof form?.get("next") === "string" ? (form!.get("next") as string) : "");

  const key = clientKey(request);
  if (isLocked(key)) return backToGate(request, "locked", next);

  if (!(await isPinCorrect(pin))) {
    recordFailure(key);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return backToGate(request, "1", next);
  }

  failures.delete(key);
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set({
    name: DEMO_ACCESS_COOKIE_NAME,
    value: await createAccessToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEMO_ACCESS_MAX_AGE_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL(DEMO_ACCESS_PAGE, request.url), 303);
  if (request.nextUrl.searchParams.get("logout") === "1") {
    response.cookies.set({
      name: DEMO_ACCESS_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
