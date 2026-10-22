import { business } from "@/lib/business";
import { offerEngine } from "@/lib/festival-offers";
import { formatWindowEnd, getActiveOffer, resolvePlanOffers } from "@/lib/offer-engine";
import { buildOfferExperience } from "@/lib/offer-experience";
import { getOfferNow } from "@/lib/offer-preview";
import { pricing } from "@/lib/pricing";
import { sections } from "@/lib/sections";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { KineticStrip } from "@/components/sections/KineticStrip";
import { Trust } from "@/components/sections/Trust";
import { About } from "@/components/sections/About";
import { TrainingTools } from "@/components/sections/TrainingTools";
import { Programs } from "@/components/sections/Programs";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Transformations } from "@/components/sections/Transformations";
import { TrainingIntelligence } from "@/components/sections/TrainingIntelligence";
import { Reviews } from "@/components/sections/Reviews";
import { BetweenSessions } from "@/components/sections/BetweenSessions";
import { Membership, formatPrice } from "@/components/sections/Membership";
import { Gallery } from "@/components/sections/Gallery";
import { Instagram } from "@/components/sections/Instagram";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Location } from "@/components/sections/Location";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { FloatingContact } from "@/components/sections/FloatingContact";
import { ContactDialog } from "@/components/motion/ContactDialog";
import { OfferModal, OfferReminder } from "@/components/motion/OfferExperience";
import { transformations } from "@/lib/transformations";

/**
 * Runtime revalidation window, in seconds.
 *
 * The Festival & Seasonal Offer Engine decides which campaign is current from
 * the `new Date()` read below. Without this export the homepage would be
 * rendered once at build time and the campaign state would be frozen into the
 * build output — a site deployed in October would still be advertising the
 * October campaign in December.
 *
 * With it, the page uses incremental static regeneration with
 * stale-while-revalidate semantics. Once 3600 seconds have passed since the
 * page was LAST GENERATED, the next request is still served the cached (now
 * stale) HTML and triggers a regeneration in the background; a later request
 * receives the fresh page. The hour is counted from the last generation, not
 * from IST midnight, so it is NOT aligned to the day boundary.
 *
 * Consequence, accepted deliberately: after a campaign phase change (run-up to
 * live, live to the next run-up, a seasonal band changing) the first visitor(s)
 * — most visibly on a low-traffic site — may briefly still see the previous
 * campaign, including its prices and "Ends" date, until regeneration finishes.
 * There is no guarantee that the offer changes within an hour of a transition
 * or exactly at 00:00 IST. The campaign does advance on its own, with no
 * deploy, no environment variable and no manual date entry.
 *
 * The trade-off buys static/ISR performance: the rest of the page stays
 * statically rendered, costing nothing in client JavaScript or hydration work,
 * and the app is deliberately NOT switched to force-dynamic for a
 * day-granularity feature. If per-request accuracy is ever required instead,
 * Replace this with `export const dynamic = "force-dynamic";` — the engine
 * itself is unchanged, because it reads the instant it is handed.
 */
export const revalidate = 3600;

export default function Home() {
  const whatsappHref = buildWhatsAppHref(business.whatsapp);
  const consentVerifiedTransformation = transformations.find((t) => t.consentVerified);

  /*
   * ONE campaign evaluation for the whole page.
   *
   * The hero card and the pricing register must show the same promotion — that
   * is the feature's central acceptance criterion — so the selector runs once
   * here and the result is handed to both. Evaluating it inside each section
   * would work almost always and then, once a year, render a hero advertising
   * one campaign above prices discounted by another, because two `new Date()`
   * reads can land either side of midnight in the configured timezone.
   *
   * `null` is a normal result: it means nothing is running, and both surfaces
   * fall back to their non-promotional state.
   */
  const activeOffer = getActiveOffer(getOfferNow(), offerEngine);

  /*
   * Campaign modal + floating reminder: ONE view-model, built from the SAME
   * `activeOffer` and the SAME resolvePlanOffers() the pricing register uses,
   * so prices cannot drift between surfaces. It exists for EVERY selected
   * campaign — run-up, live or seasonal; the phase shapes the wording, never
   * whether the modal exists. Null only when no campaign is selected or the
   * membership section the CTA points at is not rendered.
   */
  const membershipRendered = sections.membership && pricing.enabled;
  const offerExperience = membershipRendered
    ? buildOfferExperience({
        offer: activeOffer,
        planOffers: resolvePlanOffers(activeOffer, pricing.plans, offerEngine),
        endsOn:
          activeOffer && activeOffer.type === "festival"
            ? formatWindowEnd(activeOffer.end, offerEngine.locale)
            : null,
        festivalOn:
          activeOffer && activeOffer.festivalDate
            ? formatWindowEnd(activeOffer.festivalDate, offerEngine.locale)
            : null,
        formatPrice,
        config: offerEngine,
      })
    : null;

  return (
    <div id="top">
      <Header whatsappHref={whatsappHref} />
      <main>
        <Hero whatsappHref={whatsappHref} offer={activeOffer} />
        <KineticStrip />
        {sections.trust && <Trust />}
        {sections.about && <About />}
        <TrainingTools />
        {sections.programs && <Programs whatsappHref={whatsappHref} />}
        {sections.whyChooseUs && <WhyChooseUs />}
        {sections.transformations && <Transformations />}
        {sections.trainingIntelligence && (
          <TrainingIntelligence whatsappHref={whatsappHref} />
        )}
        {sections.reviews && <Reviews />}
        {sections.betweenSessions && (
          <BetweenSessions whatsappHref={whatsappHref} />
        )}
        {sections.membership && (
          <Membership whatsappHref={whatsappHref} offer={activeOffer} />
        )}
        {sections.gallery && <Gallery />}
        {sections.instagram && <Instagram />}
        {sections.faq && <Faq />}
        {sections.contact && <Contact whatsappHref={whatsappHref} />}
        {sections.location && <Location />}
        <FinalCta whatsappHref={whatsappHref} />
      </main>

      <Footer />

      <FloatingContact
        whatsappHref={whatsappHref}
        reminder={
          offerExperience ? <OfferReminder model={offerExperience} /> : undefined
        }
      />
      {offerExperience && <OfferModal model={offerExperience} />}
      <ContactDialog
        suppress={Boolean(offerExperience)}
        whatsappHref={whatsappHref}
        image={consentVerifiedTransformation?.image}
        imageAlt={
          consentVerifiedTransformation
            ? `${consentVerifiedTransformation.personName ?? "Member"} transformation photo`
            : undefined
        }
      />
    </div>
  );
}

