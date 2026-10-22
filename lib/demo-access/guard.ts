/**
 * DEMO ACCESS — request guard used by proxy.ts (Next.js 16 "proxy", the
 * renamed middleware).
 *
 * Every page/API request must carry a valid signed demo-access cookie, except:
 *  - the PIN screen (/demo-access) and its endpoint (/api/demo-access)
 *  - image files under /assets (needed by the image optimizer, see below)
 *  - the gym logo's /_next/image variant shown on the PIN screen
 * Static build assets (/_next/static) and the favicon are excluded by the
 * matcher in proxy.ts.
 *
 * Unauthenticated page requests are redirected to /demo-access; unauthenticated
 * API requests get a 401. Every response passing through gets
 * `X-Robots-Tag: noindex, nofollow`.
 */
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_ACCESS_COOKIE_NAME, DEMO_ACCESS_LOGO } from "@/config/demo-access";
import { verifyAccessToken } from "@/lib/demo-access/token";

export const DEMO_ACCESS_PAGE = "/demo-access";
export const DEMO_ACCESS_API = "/api/demo-access";

function withHeaders(response: NextResponse, noStore: boolean): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (noStore) response.headers.set("Cache-Control", "no-store");
  return response;
}

// Image FILES under /assets. Next's image optimizer (and Vercel's) fetches the
// source file for /_next/image with a bare internal request that does NOT carry
// the visitor's cookie, so these must pass or every optimized image breaks
// after unlocking. Pages, text, scripts and /_next/image itself stay gated; a
// visitor would need to already know an exact image URL to fetch it.
// To tighten later: drop this rule and serve images with `unoptimized`.
const PUBLIC_IMAGE_FILE = /^\/assets\/.+\.(png|jpe?g|webp|avif|gif|svg)$/i;

function isPublicPath(request: NextRequest): boolean {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === DEMO_ACCESS_PAGE || pathname === DEMO_ACCESS_API) return true;
  if (pathname === DEMO_ACCESS_LOGO) return true;
  if (PUBLIC_IMAGE_FILE.test(pathname)) return true;
  // next/image proxy, but ONLY for the PIN-screen logo.
  if (pathname === "/_next/image" && searchParams.get("url") === DEMO_ACCESS_LOGO) return true;
  return false;
}

export async function demoAccessProxy(request: NextRequest): Promise<NextResponse> {
  if (isPublicPath(request)) return withHeaders(NextResponse.next(), false);

  const token = request.cookies.get(DEMO_ACCESS_COOKIE_NAME)?.value;
  if (await verifyAccessToken(token)) return withHeaders(NextResponse.next(), false);

  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return withHeaders(
      NextResponse.json({ error: "Demo access required." }, { status: 401 }),
      true
    );
  }

  const destination = request.nextUrl.clone();
  destination.pathname = DEMO_ACCESS_PAGE;
  destination.search = "";
  if (pathname !== "/" || search) destination.searchParams.set("next", `${pathname}${search}`);
  return withHeaders(NextResponse.redirect(destination), true);
}
