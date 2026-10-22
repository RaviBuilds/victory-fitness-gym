import Link from "next/link";
import Image from "next/image";
import { business } from "@/lib/business";
import { pricing } from "@/lib/pricing";
import { sections } from "@/lib/sections";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/motion/MobileNav";
import { DesktopNav } from "@/components/sections/DesktopNav";

/**
 * Human-readable form of the configured phone number for display only (the
 * `tel:` href always uses the raw stored value). An Indian +91 mobile number
 * is grouped as "+91 99496 96946"; any other shape is shown as stored.
 */
function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  const match = /^\+91(\d{5})(\d{5})$/.exec(digits);
  return match ? `+91 ${match[1]} ${match[2]}` : phone;
}

/**
 * Floating inset header bar. No scroll-driven JS — the bar carries its own
 * bordered, dense surface so it stays legible over any hero image without a
 * client-side scroll listener. See docs/MASTER-PASS-1-DESIGN-DIRECTION.md
 * section 4.
 *
 * Layer contract for the whole page, top to bottom:
 *   50  ContactDialog (true modal)
 *   45  this header — site chrome, and the stacking context the mobile nav
 *       drawer (z-40 inside it) lives in, so an open drawer covers the hero UI
 *       and the floating WhatsApp control
 *   40  hero UI (copy, controls, top-utility metadata) + floating WhatsApp
 *   10-35 hero artwork layers (back type -> athlete -> scrim -> front type)
 * The header must stay above 40: as site chrome it has to remain reachable
 * over in-page UI, and its drawer is modal.
 *
 * Geometry is shared, not duplicated: the inset/row/border below is mirrored
 * by --header-inset and --header-h in app/globals.css, which drive both the
 * mobile drawer offset and the hero's header-safe composition zone
 * (--hero-header-clear). Changing the row height or inset here without
 * updating those tokens would move the hero artwork's head clearance.
 */
export function Header({ whatsappHref }: { whatsappHref: string }) {
  // Joining means reviewing memberships. Only point the primary CTA there when
  // that section actually renders; otherwise keep the WhatsApp enquiry action.
  const membershipAvailable = sections.membership && pricing.enabled;
  const phoneDisplay = business.phone ? formatPhoneDisplay(business.phone) : null;

  return (
    <header className="fixed inset-x-3 top-3 z-45 sm:inset-x-4 sm:top-4">
      {/* Squared editorial bar: a 1px rule over a dense surface. Deliberately
          not rounded and not glassy — the same industrial language as the
          hero's chips, cards and slider controls. */}
      <div className="border border-(--border) bg-(--bg-primary)/90">
        <div className="factory-header-spine flex h-16 items-center justify-between gap-4 sm:h-18">
          {/* Brand: LOGO IMAGE ONLY. The business name is intentionally not
              rendered as visible text. The accessible brand label lives on the
              link and the mark itself is decorative (alt=""), so assistive
              tech announces the brand exactly once. */}
          <Link
            href="#top"
            aria-label={`${business.name} — home`}
            className="factory-focus flex shrink-0 items-center"
          >
            {/* The supplied mark (public/assets/brand/logo.jpg) is a
                646x579 JPEG (neon sign on a black field, which sits on the
                dark header). The intrinsic dimensions give the
                browser the true aspect ratio; object-contain inside an
                auto-width/fixed-height box keeps it undistorted. */}
            <Image
              src="/assets/brand/logo.jpg"
              alt=""
              aria-hidden="true"
              width={646}
              height={579}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          {/* Desktop nav from 1024px: with the brand text gone the row has
              room for the full link set well before 1280px, so tablets in
              landscape get real navigation instead of the drawer. Route-aware
              (resolves section anchors to homepage anchors on /start). */}
          <DesktopNav />

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* Action hierarchy: phone (quiet, desktop only) -> ONE primary
                CTA -> menu. The call action on small screens is the floating
                phone button, so the number is not repeated in the bar. */}
            {business.phone && phoneDisplay && (
              <a
                href={`tel:${business.phone}`}
                aria-label={`Call ${business.name}`}
                className="factory-focus factory-header-phone hidden xl:inline-flex"
              >
                {phoneDisplay}
              </a>
            )}
            {membershipAvailable ? (
              <Button href="/#membership" variant="primary">
                Join Now
              </Button>
            ) : (
              <Button href={whatsappHref} variant="primary">
                WhatsApp
              </Button>
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
