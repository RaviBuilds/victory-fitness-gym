import type { CSSProperties } from "react";
import { whyChooseUs, whyChooseUsConfiguration } from "@/lib/why-choose-us";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Section 03 — THE ROOF.
 *
 * One solid accent-colour poster between two dark chapters. After Section 02's
 * photography-led spread and before Section 04's data readouts, this is the
 * page's single flat colour field: no photograph, no grid, no technical
 * graphics, only type.
 *
 * Role: the REASONS to choose the gym — method, education, nutrition and how
 * the services connect. It deliberately does not repeat facility statistics,
 * amenities or program names; Section 01 (About) and Section 02 (Programs) own
 * those facts.
 *
 * Composition: Programs' statement grammar across the top (small eyebrow
 * offset left, one headline right), then the reasons as equal columns, each
 * opened by a hairline rule. Columns adapt to 1-4 reasons.
 *
 * Colour: the field is --brand-primary-ui (the AA-safe fill variant) and all
 * text is --accent-foreground at full strength. Secondary-role colour and
 * dimmed greys are not used here because neither holds contrast on the field.
 *
 * Source-First: every title and description is `whyChooseUs` verbatim; the
 * eyebrow and headline come from `whyChooseUsConfiguration`. No numerals,
 * counts or labels are derived or invented.
 *
 * Server Component. Entrance motion is the existing Reveal primitive plus
 * .factory-stagger-child — no animation library, no client island.
 */
export function WhyChooseUs() {
  if (whyChooseUs.length === 0) return null;

  const { eyebrow, headline } = whyChooseUsConfiguration;
  const columns = Math.min(Math.max(whyChooseUs.length, 1), 4);

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="factory-poster scroll-mt-[calc(var(--header-h)+0.5rem)]"
    >
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <p className="factory-poster-eyebrow lg:col-span-2 lg:pt-[0.9em]">{eyebrow}</p>
          <h2
            id="why-choose-us-heading"
            className="factory-poster-headline lg:col-span-10 xl:col-span-9"
          >
            {headline}
          </h2>
        </Reveal>

        <Reveal delayMs={140} className="factory-poster-reasons">
          <ul
            className="factory-poster-columns"
            style={{ "--poster-columns": columns } as CSSProperties}
          >
            {whyChooseUs.map((item, i) => (
              <li
                key={item.title}
                className="factory-poster-column factory-stagger-child"
                style={{ transitionDelay: `${120 + i * 110}ms` }}
              >
                <h3 className="factory-poster-title">{item.title}</h3>
                <p className="factory-poster-desc">{item.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
