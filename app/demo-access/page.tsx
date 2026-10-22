import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { business } from "@/lib/business";
import {
  DEMO_ACCESS_COOKIE_NAME,
  DEMO_ACCESS_LOGO,
  DEMO_ACCESS_PIN,
} from "@/config/demo-access";
import { DEMO_ACCESS_API } from "@/lib/demo-access/guard";
import { safeNextPath, verifyAccessToken } from "@/lib/demo-access/token";

/**
 * DEMO ACCESS — the private-demo PIN screen.
 *
 * A plain server-rendered page with a native <form method="post"> that posts
 * to /api/demo-access. There is no client JavaScript and the PIN is never
 * sent to the browser. The real website is not rendered here; the gym logo,
 * colours and typography come from the existing site tokens.
 */

export const metadata: Metadata = {
  title: "Private Demo",
  description: "Private demo. Enter the access PIN to continue.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
  openGraph: null,
};

export default async function DemoAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  // Already unlocked? Go straight to the site.
  const jar = await cookies();
  if (await verifyAccessToken(jar.get(DEMO_ACCESS_COOKIE_NAME)?.value)) {
    redirect(next);
  }

  const error =
    params.error === "locked"
      ? "Too many attempts. Please wait a few minutes and try again."
      : params.error
        ? "Incorrect PIN. Please check it and try again."
        : null;

  // Only the *kind* of PIN is exposed (digits vs. text) to pick the mobile
  // keyboard — never the PIN or its length.
  const numeric = /^\d+$/.test(DEMO_ACCESS_PIN);

  return (
    <main className="flex min-h-svh items-center justify-center bg-(--bg-primary) px-5 py-10 text-(--text-primary)">
      <section
        aria-labelledby="demo-access-heading"
        className="relative w-full max-w-md border border-(--border) bg-(--surface) px-6 py-10 sm:px-10"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-(--accent)" />

        <div className="flex flex-col items-center text-center">
          <Image
            src={DEMO_ACCESS_LOGO}
            alt={`${business.name} logo`}
            width={150}
            height={150}
            priority
            className="h-20 w-auto object-contain"
          />

          <p className="factory-eyebrow mt-8">Demo access</p>
          <h1
            id="demo-access-heading"
            className="mt-3 text-3xl font-semibold uppercase tracking-tight sm:text-4xl"
          >
            Private demo
          </h1>
          <p className="mt-3 text-sm leading-6 text-(--text-secondary)">
            Enter the access PIN to view this website.
          </p>
        </div>

        <form action={DEMO_ACCESS_API} method="post" className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />

          <label htmlFor="demo-access-pin" className="text-xs font-medium uppercase tracking-widest text-(--text-secondary)">
            Access PIN
          </label>
          <input
            id="demo-access-pin"
            name="pin"
            type="password"
            inputMode={numeric ? "numeric" : "text"}
            autoComplete="off"
            autoFocus
            required
            maxLength={128}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "demo-access-error" : undefined}
            className="factory-focus w-full border border-(--border) bg-(--bg-primary) px-4 py-3 text-center text-lg tracking-[0.4em] text-(--text-primary) placeholder:text-(--text-secondary)"
          />

          {error && (
            <p id="demo-access-error" role="alert" className="text-sm text-(--text-primary)">
              <span aria-hidden="true" className="mr-2 inline-block size-2 bg-(--accent)" />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="factory-focus inline-flex w-full items-center justify-center gap-2 bg-(--accent) px-6 py-3 text-sm font-semibold uppercase tracking-wide text-(--accent-foreground) transition-colors duration-200 hover:bg-(--accent-hover)"
          >
            View demo
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
