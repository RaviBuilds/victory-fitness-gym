import Image from "next/image";
import type { CSSProperties } from "react";
import { services } from "@/lib/services";
import { programsConfiguration, type ProgramGroup } from "@/lib/programs";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Section 02 — Programs (docs/Final Redesign.md §8). Editorial, asymmetric.
 *
 * Composition, top to bottom:
 *   1. Statement — one two-tone sentence, offset from a small identifier.
 *      Deliberately NOT Section 01's eyebrow / heading / paragraph grammar.
 *   2. Spread — the core program as a photographic feature that bleeds off
 *      the left edge of the viewport, title set on the photograph; guided
 *      programs as staggered, image-led modules in the remaining column.
 *   3. Classes — group-class names as oversized, staggered type: the
 *      section's typographic signature.
 *   4. Close — supporting services as one quiet line, beside the section's
 *      single primary action.
 *
 * Content: every program field comes from lib/services.ts (verified only);
 * arrangement, labels, crop focus and CTA copy come from lib/programs.ts.
 * Facility statistics are not repeated here — Section 01 owns them.
 *
 * Server Component. Motion is the existing Reveal / .factory-stagger-child /
 * .factory-image-mask system (reduced-motion aware, app/globals.css).
 */

interface ResolvedGroup extends Omit<ProgramGroup, "serviceIds"> {
  items: Service[];
}

function resolvePrograms(verified: Service[]) {
  const { featuredServiceId, groups } = programsConfiguration;
  const byId = new Map(verified.map((s) => [s.id, s]));

  const featured = byId.get(featuredServiceId) ?? verified[0];
  const used = new Set<string>([featured.id]);

  const resolved: ResolvedGroup[] = groups.map(({ serviceIds, ...group }) => {
    const items: Service[] = [];
    for (const id of serviceIds) {
      const service = byId.get(id);
      if (service && !used.has(id)) {
        items.push(service);
        used.add(id);
      }
    }
    return { ...group, items };
  });

  // Never drop a verified program just because it was not assigned.
  const unassigned = verified.filter((s) => !used.has(s.id));
  if (unassigned.length > 0 && resolved.length > 0) {
    const target =
      resolved.find((g) => g.presentation === "classes") ?? resolved[resolved.length - 1];
    target.items.push(...unassigned);
  }

  const live = resolved.filter((g) => g.items.length > 0);
  return {
    featured,
    modules: live.filter((g) => g.presentation === "modules"),
    classes: live.filter((g) => g.presentation === "classes"),
    quiet: live.filter((g) => g.presentation === "quiet"),
  };
}

const focusOf = (id: string): CSSProperties | undefined => {
  const position = programsConfiguration.imageFocus?.[id];
  return position ? { objectPosition: position } : undefined;
};

export function Programs({ whatsappHref }: { whatsappHref: string }) {
  const verified = services.filter((s) => s.verified);
  if (verified.length === 0) return null;

  const { eyebrow, headline, subline, featuredLabel, cta } = programsConfiguration;
  const { featured, modules, classes, quiet } = resolvePrograms(verified);
  const ctaHref = cta.href ?? whatsappHref;

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="factory-programs relative overflow-clip border-b border-(--border) bg-(--bg-primary) pb-20 lg:pb-28"
    >
      {/* ---------- 1. Statement ---------- */}
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <p className="factory-eyebrow lg:col-span-2 lg:pt-[0.9em]">{eyebrow}</p>
          <h2
            id="programs-heading"
            className="factory-programs-statement lg:col-span-10 xl:col-span-9"
          >
            {headline}
            {subline && (
              <>
                {" "}
                <span className="text-(--text-secondary)">{subline}</span>
              </>
            )}
          </h2>
        </Reveal>
      </Container>

      {/* ---------- 2. Spread: core program + guided modules ---------- */}
      <div className="factory-programs-spread mt-14 sm:mt-16 lg:mt-24">
        <Reveal className="factory-programs-feature-media">
          <div className="factory-image-mask absolute inset-0">
            {featured.image && (
              <Image
                src={featured.image}
                alt={`${featured.name} training at the gym`}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
                style={focusOf(featured.id)}
              />
            )}
          </div>
          <div aria-hidden="true" className="factory-programs-feature-shade" />
        </Reveal>

        <Reveal delayMs={120} className="factory-programs-feature-copy">
          <p className="factory-programs-feature-label">{featuredLabel}</p>
          <h3 className="factory-programs-feature-title">{featured.name}</h3>
          <p className="factory-programs-feature-desc">{featured.description}</p>
        </Reveal>

        {modules.length > 0 && (
          <Reveal delayMs={180} className="factory-programs-guided">
            {modules.map((group) => (
              <section
                key={group.id}
                aria-labelledby={`programs-group-${group.id}`}
                className="factory-programs-guided-group"
              >
              <h3 id={`programs-group-${group.id}`} className="factory-programs-kicker">
                {group.label}
              </h3>
              <ul
                className={`factory-programs-modules ${group.items.length === 1 ? "is-single" : ""}`}
              >
                {group.items.map((item, i) => (
                  <li
                    key={item.id}
                    className="factory-programs-module factory-stagger-child"
                    style={{ transitionDelay: `${160 + i * 120}ms` }}
                  >
                    {item.image && (
                      <div className="factory-programs-module-media">
                        <Image
                          src={item.image}
                          alt={`${item.name} at the gym`}
                          fill
                          loading="lazy"
                          sizes="(min-width: 1024px) 22vw, (min-width: 360px) 46vw, 100vw"
                          className="object-cover"
                          style={focusOf(item.id)}
                        />
                      </div>
                    )}
                    <h4 className="factory-programs-module-name">{item.name}</h4>
                    <p className="factory-programs-module-desc">{item.description}</p>
                  </li>
                ))}
              </ul>
              </section>
            ))}
          </Reveal>
        )}
      </div>

      {/* ---------- 3. Group classes: typographic signature ----------
          Its own chapter: a full-bleed graphite band carrying a single
          ghosted plate drawing (PlateDrawing) entering from the right. Each
          class name sits on a construction rule that runs from the end of the
          name, under its description, into the drawing — the rule is what
          ties a description to its class. */}
      {classes.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`programs-group-${group.id}`}
          className="factory-programs-classes-band mt-16 sm:mt-20 lg:mt-24"
        >
          <PlateDrawing />
          <Container className="relative">
            <Reveal>
              <h3 id={`programs-group-${group.id}`} className="factory-programs-kicker">
                {group.label}
              </h3>
              <ul className="factory-programs-classes">
                {group.items.map((item, i) => (
                  <li
                    key={item.id}
                    className="factory-programs-class factory-stagger-child"
                    data-axis={i % 2 === 1 ? "offset" : undefined}
                    style={{ transitionDelay: `${100 + i * 110}ms` }}
                  >
                    <h4 className="factory-programs-class-name">{item.name}</h4>
                    <span aria-hidden="true" className="factory-programs-class-rule" />
                    <p className="factory-programs-class-desc">{item.description}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>
      ))}

      <Container>
        {/* ---------- 4. Close: quiet support + the one primary action ---------- */}
        <Reveal className="mt-14 sm:mt-16 lg:mt-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
            {quiet.map((group) => (
              <section
                key={group.id}
                aria-labelledby={`programs-group-${group.id}`}
                className="grid gap-x-10 gap-y-5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:col-span-8"
              >
                <h3
                  id={`programs-group-${group.id}`}
                  className="factory-programs-kicker sm:min-w-[8.5rem]"
                >
                  {group.label}
                </h3>
                {group.items.map((item) => (
                  <div key={item.id}>
                    <h4 className="text-[0.9375rem] font-medium leading-snug text-(--text-primary)">
                      {item.name}
                    </h4>
                    <p className="mt-1 max-w-[34ch] text-sm leading-relaxed text-(--text-secondary)">
                      {item.description}
                    </p>
                  </div>
                ))}
              </section>
            ))}

            <div
              className={
                quiet.length > 0
                  ? "lg:col-span-4 lg:justify-self-end"
                  : "lg:col-span-12 lg:justify-self-end"
              }
            >
              <Button href={ctaHref} className="w-full sm:w-auto">
                {cta.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}


/*
 * Ghosted technical drawing of a standard competition plate, to scale:
 * Ø450 mm body, rim lip, recessed face, steel insert and the 50.4 mm bore
 * (viewBox units = mm, centred on the bore). Drawn with drafting conventions —
 * hairline outlines and chain-dash centre lines that overrun the outline — so
 * it reads as an engineering sheet behind the class names, not decoration.
 * Pure SVG in currentColor: no asset, nothing gym-specific, identical for
 * every clone. Size, crop and opacity live in .factory-programs-plate.
 */
function PlateDrawing() {
  const hairline = { fill: "none", stroke: "currentColor", vectorEffect: "non-scaling-stroke" } as const;
  const polar = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  };
  // Rim graduation: 120 ticks, every fifth one longer.
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const inner = i % 5 === 0 ? 194 : 200;
    return `M${polar(inner, i * 3)}L${polar(207, i * 3)}`;
  }).join("");
  // Three hand-grip slots through the face, 120° apart, outlined with
  // rounded ends (outer r150 / inner r122 / end radius 14).
  const slots = [0, 120, 240].map((start) => {
    const a1 = start - 20;
    const a2 = start + 20;
    return (
      `M${polar(150, a1)}A150 150 0 0 1 ${polar(150, a2)}` +
      `A14 14 0 0 1 ${polar(122, a2)}A122 122 0 0 0 ${polar(122, a1)}` +
      `A14 14 0 0 1 ${polar(150, a1)}Z`
    );
  });

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="factory-programs-plate"
      viewBox="-262 -262 524 524"
    >
      {/* The plate itself turns slowly on its bore (.factory-programs-plate-body);
          the centre lines stay fixed, as an axle would. Rim ticks and grip
          slots are what make the rotation readable on a symmetric form. */}
      <g className="factory-programs-plate-body">
        {/* Body mass, then the rim band — the only filled areas. */}
        <circle r="225" fill="currentColor" opacity="0.022" />
        <circle r="219" fill="none" stroke="currentColor" strokeWidth="12" opacity="0.025" />

        <circle r="225" {...hairline} strokeWidth="1" opacity="0.16" />
        <circle r="213" {...hairline} strokeWidth="1" opacity="0.09" />
        <path d={ticks} {...hairline} strokeWidth="1" opacity="0.1" />
        <circle r="178" {...hairline} strokeWidth="1" opacity="0.07" />
        {slots.map((d, i) => (
          <path key={i} d={d} {...hairline} strokeWidth="1" opacity="0.12" />
        ))}
        <circle r="72" {...hairline} strokeWidth="1" opacity="0.14" />
        <circle r="52" {...hairline} strokeWidth="1" opacity="0.08" />
        <circle r="25.2" {...hairline} strokeWidth="1" opacity="0.18" />
      </g>

      {/* Centre lines (chain-dash). Static. The vertical line runs the full
          diameter at the composition's right edge; the horizontal one is
          kept to a short overrun around the insert so it never crosses the
          description column. */}
      <g {...hairline} strokeWidth="1" opacity="0.12" strokeDasharray="22 5 3 5">
        <line x1="-96" y1="0" x2="96" y2="0" />
        <line x1="0" y1="-250" x2="0" y2="250" />
      </g>
    </svg>
  );
}
