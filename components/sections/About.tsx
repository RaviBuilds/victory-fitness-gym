import Image from "next/image";
import { business } from "@/lib/business";
import { aboutConfiguration, scheduleWindows } from "@/lib/about";
import type { FacilityMetric } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Section 01 — Training Environment. Image-led facility showcase
 * (docs/Final Redesign.md §7).
 *
 * Hierarchy, top to bottom:
 *   1. Statement — eyebrow, display heading, facility narrative.
 *   2. Showcase — the single facility photograph as the section's anchor, with
 *      the verified facility figures set directly on it. The first figure in
 *      data order is primary (largest); the rest step down.
 *   3. Zones — the remaining verified zones as plain typographic columns.
 *   4. Practical — amenities as a quiet checklist, opening hours alongside.
 *
 * Fact ownership: a zone or attribute that carries a `metric` is promoted onto
 * the photograph and is NOT repeated in the zone strip or amenity list.
 *
 * Source-First: the narrative is `business.description`, the locality comes
 * from `business.address`, hours are derived from `business.hours`, and zones
 * / attributes / figures only render when `verified: true`. Nothing in this
 * component authors content.
 *
 * Server Component. Motion is the existing Reveal primitive plus the existing
 * .factory-image-mask / .factory-stagger-child CSS (reduced-motion aware).
 */
export function About() {
  const {
    eyebrow,
    headlineLines,
    accentLastLine,
    image,
    zonesLabel,
    attributesLabel,
    scheduleLabel,
    zones,
    attributes,
    showSchedule,
  } = aboutConfiguration;

  const verifiedZones = zones.filter((zone) => zone.verified);
  const verifiedAttributes = attributes.filter((attribute) => attribute.verified);

  // Figures promoted onto the photograph (zones first, then attributes, both
  // in data order) — each keeps its source label as quiet context.
  const metrics: { id: string; metric: FacilityMetric; context: string }[] = [
    ...verifiedZones,
    ...verifiedAttributes,
  ].flatMap((item) =>
    item.metric ? [{ id: item.id, metric: item.metric, context: item.label }] : []
  );
  const stripZones = verifiedZones.filter((zone) => !zone.metric);
  const amenities = verifiedAttributes.filter((attribute) => !attribute.metric);

  const windows = showSchedule ? scheduleWindows(business.hours) : [];
  const locality = business.address.locality || business.address.city;
  const paragraphs = business.description
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const [primaryMetric, ...secondaryMetrics] = metrics;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden border-b border-(--border) bg-(--bg-secondary) py-20 sm:py-24 lg:py-32"
    >
      <FloorMarkings />
      <Container>
        {/* ---------- 1. Statement ---------- */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="factory-eyebrow">{eyebrow}</p>
            <h2
              id="about-heading"
              className="factory-section-display mt-5 text-(--text-primary)"
            >
              {headlineLines.map((line, i) => (
                <span
                  key={i}
                  className={
                    accentLastLine && i === headlineLines.length - 1
                      ? "block text-(--accent)"
                      : "block"
                  }
                >
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal delayMs={90} className="lg:col-span-5 lg:pb-1">
            <div className="flex max-w-[52ch] flex-col gap-4 text-base leading-7 text-(--text-secondary)">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {locality && <p className="factory-meta-item mt-6">{locality}</p>}
          </Reveal>
        </div>

        {/* ---------- 2. Facility showcase ---------- */}
        <Reveal className="mt-12 sm:mt-14 lg:mt-20">
          <figure className="factory-env-plate relative overflow-hidden rounded-sm bg-(--surface)">
            <div className="factory-image-mask relative aspect-[2/3] w-full min-[480px]:aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1360px) 1264px, 100vw"
                className="object-cover object-[50%_40%]"
              />
            </div>

            {metrics.length > 0 && (
              <>
                <div aria-hidden="true" className="factory-env-scrim" />
                {/* Mobile: primary card on its own row, the rest paired below.
                    Desktop: one bottom-aligned row, primary card largest. */}
                <dl className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-2.5 p-3 min-[480px]:gap-3 min-[480px]:p-4 sm:p-6 md:flex md:items-end md:gap-3 lg:gap-4 lg:p-10">
                  {primaryMetric && (
                    <div className="factory-stagger-child factory-env-glass factory-env-glass--primary col-span-2 flex flex-col-reverse lg:mr-2">
                      <dt className="mt-2 max-w-[24ch] text-[0.9375rem] font-medium leading-snug text-(--text-primary) sm:text-base">
                        {primaryMetric.metric.label}
                        <span className="mt-0.5 block text-sm font-normal text-white/65">
                          {primaryMetric.context}
                        </span>
                      </dt>
                      <dd className="factory-env-figure factory-env-figure--primary">
                        {primaryMetric.metric.value}
                      </dd>
                    </div>
                  )}
                  {secondaryMetrics.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="factory-stagger-child factory-env-glass flex min-w-0 flex-col-reverse justify-end lg:min-w-[12rem]"
                      style={{ transitionDelay: `${140 + i * 90}ms` }}
                    >
                      <dt className="mt-1.5 text-sm font-medium leading-snug text-(--text-primary) [overflow-wrap:anywhere] lg:max-w-[20ch]">
                        {entry.metric.label}
                        <span className="mt-0.5 hidden text-[0.8125rem] font-normal text-white/60 sm:block">
                          {entry.context}
                        </span>
                      </dt>
                      <dd className="factory-env-figure">{entry.metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </figure>
        </Reveal>

        {/* ---------- 3. Training zones ---------- */}
        {stripZones.length > 0 && (
          <Reveal className="mt-14 lg:mt-20">
            <h3 className="factory-group-label">{zonesLabel}</h3>
            <ul className="mt-7 grid gap-y-9 md:grid-cols-3 md:gap-x-8 lg:mt-8 lg:gap-x-12">
              {stripZones.map((zone, i) => (
                <li
                  key={zone.id}
                  className="factory-stagger-child"
                  style={{ transitionDelay: `${80 + i * 80}ms` }}
                >
                  <h4 className="text-xl font-semibold leading-tight tracking-[-0.01em] text-(--text-primary) lg:text-[1.375rem]">
                    {zone.label}
                  </h4>
                  {zone.detail && (
                    <p className="mt-2.5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-(--text-secondary)">
                      {zone.detail}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* ---------- 4. Amenities + opening hours ---------- */}
        {(amenities.length > 0 || windows.length > 0) && (
          <Reveal className="mt-14 lg:mt-20">
            <div className="factory-rule" aria-hidden="true" />
            <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-start lg:gap-10">
              {amenities.length > 0 && (
                <div className={windows.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
                  <h3 className="factory-group-label">{attributesLabel}</h3>
                  <ul className="mt-5 grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                    {amenities.map((attribute) => (
                      <li key={attribute.id} className="factory-env-check">
                        <span>
                          {attribute.label}
                          {attribute.value && (
                            <span className="text-(--text-secondary)">
                              {" "}
                              · {attribute.value}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {windows.length > 0 && (
                <div className="lg:col-span-4 lg:col-start-9">
                  <div className="factory-env-hours sm:max-w-md lg:max-w-none">
                    <h3 className="factory-eyebrow">{scheduleLabel}</h3>
                    <dl className="mt-5 divide-y divide-(--border)">
                      {windows.map((entry) => (
                        <div key={entry.label} className="py-3.5 first:pt-0 last:pb-0">
                          <dt className="text-sm text-(--text-secondary)">{entry.label}</dt>
                          <dd className="mt-1 text-lg font-semibold tabular-nums tracking-[-0.01em] text-(--text-primary) sm:text-xl">
                            {entry.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}


/*
 * Decorative backdrop: painted training-floor markings (turf / sled-lane
 * lines, yard ticks, a hatched plyo zone and one start line) over a fine
 * rubber-floor grain. Pure SVG, no content, no gym-specific asset, so it is
 * identical for every clone. Colours come from tokens via currentColor and
 * var(--accent); visibility is kept to a few percent and faded in from the
 * lower half by a CSS mask (.factory-env-backdrop) so it sits behind the
 * zones / support / schedule bands and never competes with the photograph.
 */
const LANE_YS = [520, 650, 780, 910];
const TICK_XS = Array.from({ length: 22 }, (_, i) => -160 + i * 90);

function FloorMarkings() {
  return (
    <div aria-hidden="true" className="factory-env-backdrop">
      <svg
        className="absolute inset-0 h-full w-full text-(--text-primary)"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          <pattern
            id="factory-env-hatch"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="22" stroke="currentColor" strokeWidth="6" />
          </pattern>
          <filter id="factory-env-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* Rubber-floor grain across the whole plate. */}
        <rect width="1600" height="1000" filter="url(#factory-env-grain)" opacity="0.05" />

        <g transform="rotate(-8 800 700)" fill="none" stroke="currentColor">
          {/* Lane lines. */}
          {LANE_YS.map((y) => (
            <line key={y} x1="-300" y1={y} x2="1900" y2={y} strokeWidth="2" strokeOpacity="0.075" />
          ))}

          {/* Dashed lane centres. */}
          {LANE_YS.slice(0, -1).map((y) => (
            <line
              key={`c${y}`}
              x1="-300"
              y1={y + 65}
              x2="1900"
              y2={y + 65}
              strokeWidth="1"
              strokeOpacity="0.045"
              strokeDasharray="18 22"
            />
          ))}

          {/* Yard ticks along each lane line. */}
          {LANE_YS.map((y) =>
            TICK_XS.map((x, i) => (
              <line
                key={`t${y}-${x}`}
                x1={x}
                y1={y - (i % 5 === 0 ? 16 : 8)}
                x2={x}
                y2={y + (i % 5 === 0 ? 16 : 8)}
                strokeWidth={i % 5 === 0 ? 2 : 1}
                strokeOpacity="0.06"
              />
            ))
          )}

          {/* Hatched plyo / landing zone. */}
          <rect
            x="1180"
            y={LANE_YS[1] + 18}
            width="300"
            height={LANE_YS[3] - LANE_YS[1] - 36}
            fill="url(#factory-env-hatch)"
            fillOpacity="0.035"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="2"
          />

          {/* Start line — the only accent, kept very faint. */}
          <line
            x1="90"
            y1={LANE_YS[0]}
            x2="90"
            y2={LANE_YS[LANE_YS.length - 1]}
            stroke="var(--accent)"
            strokeWidth="4"
            strokeOpacity="0.16"
          />
        </g>
      </svg>
    </div>
  );
}
