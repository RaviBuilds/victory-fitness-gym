import type { NextRequest } from "next/server";
import { demoAccessProxy } from "@/lib/demo-access/guard";

/**
 * Next.js 16 "proxy" (formerly middleware). The ONLY thing it does here is
 * the private-demo PIN gate — see lib/demo-access/guard.ts.
 *
 * To remove the demo gate later, delete:
 *   proxy.ts                      (or just the demoAccessProxy call, if other
 *                                  proxy logic has been added since)
 *   config/demo-access.ts
 *   lib/demo-access/
 *   app/demo-access/
 *   app/api/demo-access/
 * and the DEMO_ACCESS_* lines in .env.example / the Vercel env settings.
 */
export async function proxy(request: NextRequest) {
  return demoAccessProxy(request);
}

export const config = {
  // Everything except Next's hashed static build assets and the favicon.
  matcher: ["/((?!_next/static|favicon\\.ico).*)"],
};
