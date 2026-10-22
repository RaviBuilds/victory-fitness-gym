"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { BodyMapModule } from "@/lib/types";
import {
  AXIS_SPLIT,
  AXIS_X,
  BODY_MAP_VIEWS,
  BRACKET_X,
  DEFINITION_PATHS,
  FIGURE_CROP_W,
  FIGURE_STATES,
  FLOOR_FROM,
  FLOOR_TO,
  FLOOR_Y,
  FRAME_H,
  FRAME_W,
  LABEL_GUTTER_LEFT,
  MIRROR_TRANSFORM,
  REGION_GEOMETRY,
  REGION_IDS,
  SILHOUETTE,
  TIE_X,
  VIEW_BOX,
  framePercent,
  layoutLabels,
  regionsForView,
  viewForGroup,
  type BodyMapView,
  type ResolvedGroup,
} from "@/components/sections/bodyMap";

/**
 * Section 07, Chapter B — THE BODY MAP.
 *
 * ONE FIGURE, SPLIT DOWN ITS OWN CENTRE AXIS. The left half is the drawing
 * without regular training; the right half is the same drawing with the
 * contours of consistent work. Both halves render the SAME path data (see
 * components/sections/bodyMap.ts — one half is authored, the other is a
 * mirror transform of it), so the comparison cannot become a physique claim:
 * nothing is enlarged, nothing morphs, and the difference is line weight,
 * region differentiation and a few definition marks.
 *
 * WHY THIS AND NOT TWO FIGURES SIDE BY SIDE
 *   - Two figures invite "before and after". One figure split by an axis says
 *     "same body, different routine", which is the honest claim.
 *   - Comparison becomes simultaneous instead of remembered, so no
 *     before/consistent toggle is needed at all — one less interactive system,
 *     and the education works with zero interaction.
 *   - It is the only version of this idea that survives a 375px viewport: two
 *     bodies at that width are two illegible bodies, while one body is simply
 *     a narrower body.
 *
 * WHY THE FIGURE IS NOT CLICKABLE. Every region is reachable from the labelled
 * region controls beside it. Making the silhouette's shapes interactive as well
 * would add a second set of controls for the same actions — duplicate tab
 * stops for keyboard users, and touch targets well under the minimum size for
 * a calf or a deltoid at mobile widths. So the figure is `role="img"` with a
 * visually-hidden region summary, and all interaction lives in real buttons.
 * That is the better design, not an accessibility compromise.
 *
 * NOT SECTIONS 01-06's GRAMMAR
 *   - Section 03 wires perimeter annotations radially to a photograph. Here
 *     there is no photograph: the selected region carries ONE dot and ONE
 *     hairline running straight out to its name, and nothing else is drawn on
 *     the figure but the shared axis and the floor.
 *   - Section 05's instrument is a horizontal calibrated rail with a travelling
 *     pin. Here the instrument is the figure, and the selector is a quiet index.
 *   - Nothing here is a card, a photograph, a chart or a dial.
 *
 * INTERACTION SEMANTICS. Front/back is a real radio group (a view mode, with
 * arrow keys and a single tab stop). The region selector is a tab list with
 * automatic activation (one control governing one panel of downstream content),
 * arrow keys, Home/End and a roving tabindex. Pointer, touch and keyboard all
 * reach identical state, and no information is hover-gated: the active region's
 * labels and its educational note are in normal document flow at every
 * breakpoint.
 */
export function BodyMap({
  bodyMap,
  groups,
  summary,
}: {
  bodyMap: BodyMapModule;
  groups: ResolvedGroup[];
  summary: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState<BodyMapView>(
    () => groups[0]?.views[0] ?? "front"
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const viewRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const total = groups.length;
  const group = groups[activeIndex] ?? groups[0];
  if (!group) return null;

  const viewLabels = { front: bodyMap.frontLabel, back: bodyMap.backLabel };
  const activeRegions = regionsForView(group, view);
  const placements = layoutLabels(activeRegions);
  const activeIds = new Set(group.regions.map((region) => region.id));

  /**
   * Select a group. The view follows the group only when the group has nothing
   * to show on the current side of the figure — see viewForGroup.
   */
  const selectGroup = (next: number, moveFocus: boolean) => {
    const index = (next + total) % total;
    setActiveIndex(index);
    setView((current) => viewForGroup(groups[index], current));
    if (moveFocus) tabRefs.current[index]?.focus();
  };

  const onGroupKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        selectGroup(activeIndex + 1, true);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        selectGroup(activeIndex - 1, true);
        break;
      case "Home":
        event.preventDefault();
        selectGroup(0, true);
        break;
      case "End":
        event.preventDefault();
        selectGroup(total - 1, true);
        break;
      default:
        break;
    }
  };

  const selectView = (next: BodyMapView, moveFocus: boolean) => {
    setView(next);
    if (moveFocus) {
      viewRefs.current[BODY_MAP_VIEWS.indexOf(next)]?.focus();
    }
  };

  const onViewKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    ) {
      return;
    }
    event.preventDefault();
    const step = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const index = BODY_MAP_VIEWS.indexOf(view);
    const nextIndex =
      (index + step + BODY_MAP_VIEWS.length) % BODY_MAP_VIEWS.length;
    selectView(BODY_MAP_VIEWS[nextIndex], true);
  };

  return (
    <div
      className="s07-map"
      style={
        {
          // The drawing frame's own numbers, handed to CSS so the figure box,
          // the phone crop and the label gutter all derive from the geometry
          // module instead of repeating magic numbers in the stylesheet.
          "--s07-label-left": LABEL_GUTTER_LEFT,
          "--s07-axis-split": AXIS_SPLIT,
          "--s07-frame-w": FRAME_W,
          "--s07-frame-h": FRAME_H,
          "--s07-crop-w": FIGURE_CROP_W,
        } as CSSProperties
      }
    >
      {/* ------------------------------------------------- chapter B header */}
      <div className="s07-map-head">
        <div className="s07-map-title">
          <p className="s07-map-eyebrow">{bodyMap.label}</p>
          <h3 className="s07-map-display">
            {bodyMap.headlineLines.map((line, i) => (
              <span
                key={line}
                className="s07-map-display-line factory-stagger-child"
                data-accent={i === bodyMap.headlineLines.length - 1 || undefined}
                style={{ transitionDelay: `${60 + i * 80}ms` }}
              >
                {line}
              </span>
            ))}
          </h3>
        </div>

        <p className="s07-map-deck">{bodyMap.deck}</p>
      </div>

      {/* --------------------------------------------------------- the stage */}
      <div className="s07-map-stage">
        {/* The plate: one figure, split on its own axis, with the view control
            set directly beneath it. */}
        <div className="s07-figure-col">
          <div className="s07-figure-wrap">
            <p className="s07-axis-note">{bodyMap.axisLabel}</p>

            {/*
              The state labels are real text sitting directly above the half
              they describe — the row is split on the figure's own centre axis
              (AXIS_SPLIT), so the association holds at every viewport width
              instead of relying on a caption in a side column.
            */}
            <div className="s07-figure-head">
              <div className="s07-state" data-state="base">
                <span className="s07-state-rule" aria-hidden="true" />
                <p className="s07-state-label">{bodyMap.baseState.label}</p>
                <p className="s07-state-caption">{bodyMap.baseState.caption}</p>
              </div>

              <div className="s07-state" data-state="trained">
                <span className="s07-state-rule" aria-hidden="true" />
                <p className="s07-state-label">{bodyMap.trainedState.label}</p>
                <p className="s07-state-caption">{bodyMap.trainedState.caption}</p>
              </div>
            </div>

            <div className="s07-figure" data-view={view}>
              <svg
                viewBox={VIEW_BOX}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={bodyMap.figureDescription}
                className="s07-svg"
              >
                {/*
                  Per-state clip paths and per-part occlusion masks.

                  The clip path keeps every muscle region and definition mark
                  inside the silhouette. The masks solve the assembly problem:
                  the figure is four overlapping parts, so without them the
                  torso's flank would print straight through the arm and the
                  leg's groin edge would print an arc across the hips. Each
                  occluded part is masked by the part drawn in front of it.

                  Both are referenced from inside their own half's <g>, so they
                  resolve in that group's user space and therefore apply to the
                  mirrored half correctly.
                */}
              <defs>
                {FIGURE_STATES.map((state) => (
                  <clipPath key={state} id={`s07-body-clip-${state}`}>
                    {SILHOUETTE[state].map((part) => (
                      <path key={`clip-${state}-${part.id}`} d={part.d} />
                    ))}
                  </clipPath>
                ))}

                {FIGURE_STATES.flatMap((state) =>
                  SILHOUETTE[state]
                    .filter((part) => part.occludedBy?.length)
                    .map((part) => (
                      <mask
                        key={`mask-${state}-${part.id}`}
                        id={`s07-mask-${state}-${part.id}`}
                        maskUnits="userSpaceOnUse"
                        x={-400}
                        y={-400}
                        width={1200}
                        height={1200}
                      >
                        <rect x={-400} y={-400} width={1200} height={1200} fill="#fff" />
                        {(part.occludedBy ?? []).map((frontId) => {
                          const front = SILHOUETTE[state].find(
                            (candidate) => candidate.id === frontId
                          );
                          return front ? (
                            <path key={frontId} d={front.d} fill="#000" />
                          ) : null;
                        })}
                      </mask>
                    ))
                )}
              </defs>

                {/* Drawing field, reduced to what the composition needs: the
                    single centre axis both states share, and the floor the
                    figure stands on. Drawn ONCE, never mirrored. */}
                <g className="s07-svg-field">
                  <line
                    x1={AXIS_X}
                    y1={14}
                    x2={AXIS_X}
                    y2={486}
                    className="s07-svg-axis"
                  />
                  <line
                    x1={FLOOR_FROM}
                    y1={FLOOR_Y}
                    x2={FLOOR_TO}
                    y2={FLOOR_Y}
                    className="s07-svg-floor"
                  />
                </g>

              {/*
                The two halves. ONE shared anatomy, resolved to two contours:
                `base` (not training regularly) mirrored to the left of the
                axis, `trained` (training regularly) on the right. Identical
                height, head, joints and limb placement — see `derive` in
                components/sections/bodyMap.ts, which only ever moves x.
              */}
              {FIGURE_STATES.map((state) => (
                <g
                  key={state}
                  className="s07-svg-half"
                  data-state={state}
                  transform={state === "base" ? MIRROR_TRANSFORM : undefined}
                >
                  <g className="s07-svg-body">
                    {SILHOUETTE[state].map((part) => (
                      <path
                        key={part.id}
                        d={part.d}
                        className="s07-svg-part"
                        mask={
                          part.occludedBy?.length
                            ? `url(#s07-mask-${state}-${part.id})`
                            : undefined
                        }
                      />
                    ))}
                  </g>

                  {/* Both views' regions stay mounted so switching front/back
                      is a crossfade rather than a remount. Each region draws
                      THIS state's shape, so a highlight always fills the
                      contour it belongs to. */}
                  <g
                    className="s07-svg-regions"
                    clipPath={`url(#s07-body-clip-${state})`}
                  >
                    {REGION_IDS.map((id) => (
                      <path
                        key={id}
                        d={REGION_GEOMETRY[id].d[state]}
                        className="s07-svg-region"
                        data-view={REGION_GEOMETRY[id].view}
                        data-active={activeIds.has(id) || undefined}
                      />
                    ))}
                  </g>

                  {/* Both bodies carry the shared marks — softly on the
                      untrained side, because the muscles are present in both.
                      The `trained` set is the extra separation that only the
                      training side shows, so the difference is structural and
                      not merely a change of opacity. */}
                  <g
                    className="s07-svg-definition"
                    clipPath={`url(#s07-body-clip-${state})`}
                  >
                    {BODY_MAP_VIEWS.map((option) => (
                      <g key={option} data-view={option}>
                        {DEFINITION_PATHS[option].shared.map((d) => (
                          <path key={d} d={d} className="s07-svg-def" />
                        ))}
                        {state === "trained" &&
                          DEFINITION_PATHS[option].trained.map((d) => (
                            <path key={d} d={d} className="s07-svg-def" data-extra="true" />
                          ))}
                      </g>
                    ))}
                  </g>
                </g>
              ))}

                {/* The one callout per selected region: a dot on the muscle and
                    a hairline running out to its name in the label gutter. */}
                <g className="s07-svg-dims">
                  {placements.map((place) => (
                    <g key={`dim-${place.id}`} className="s07-svg-dim">
                      <path
                        d={`M ${place.cx} ${place.bracketY} H ${BRACKET_X} L ${BRACKET_X + 9} ${place.labelY} H ${TIE_X}`}
                        pathLength={1}
                        className="s07-svg-tie"
                      />
                      <circle
                        cx={place.cx}
                        cy={place.bracketY}
                        r={3}
                        className="s07-svg-dot"
                      />
                    </g>
                  ))}
                </g>
              </svg>

              {/*
                The visible region names. Positioned in the figure's own
                coordinate space (see LABEL_GUTTER_LEFT / framePercent), so a
                label always meets the leader that arrives at it. Marked
                aria-hidden because the same names are read out by the live
                region in the readout — this set is the visual half of that
                information, not a second copy of it.
              */}
              <ul className="s07-label-set" aria-hidden="true">
                {placements.map((place) => (
                  <li
                    key={`label-${place.id}`}
                    className="s07-label-item"
                    style={{ top: framePercent(place.labelY) }}
                  >
                    <span className="s07-label-text">{place.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              role="radiogroup"
              aria-label={bodyMap.viewLabel}
              className="s07-view"
              onKeyDown={onViewKeyDown}
            >
              {BODY_MAP_VIEWS.map((option, i) => {
                const checked = option === view;
                return (
                  <button
                    key={option}
                    ref={(node) => {
                      viewRefs.current[i] = node;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    tabIndex={checked ? 0 : -1}
                    data-active={checked || undefined}
                    className="s07-view-option factory-focus"
                    onClick={() => selectView(option, false)}
                  >
                    {viewLabels[option]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* The index and the readout: one column, read top to bottom. */}
        <div className="s07-map-side">
          <div className="s07-groups-block">
            <p className="s07-map-eyebrow" id="s07-group-label">
              {bodyMap.groupLabel}
            </p>
            <div
              role="tablist"
              aria-labelledby="s07-group-label"
              aria-orientation="vertical"
              className="s07-groups"
              onKeyDown={onGroupKeyDown}
            >
              {groups.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[i] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`s07-group-${item.id}`}
                    aria-selected={isActive}
                    aria-controls="s07-region-readout"
                    tabIndex={isActive ? 0 : -1}
                    data-active={isActive || undefined}
                    className="s07-group factory-focus"
                    onClick={() => selectGroup(i, false)}
                  >
                    <span className="s07-group-index" aria-hidden="true">
                      {item.index}
                    </span>
                    <span className="s07-group-label">{item.label}</span>
                    <span className="s07-group-mark" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="s07-region-readout"
            role="tabpanel"
            aria-labelledby={`s07-group-${group.id}`}
            className="s07-readout"
          >
            {/* The region names and the current view, for assistive tech. The
                live region covers the case where selecting a group also turns
                the figure around. */}
            <p className="sr-only" aria-live="polite">
              {viewLabels[view]} view. {activeRegions.map((r) => r.label).join(", ")}.
            </p>

            <p className="s07-map-eyebrow">{bodyMap.noteLabel}</p>

            <p key={`${group.id}-${view}`} className="s07-readout-title s07-swap">
              {activeRegions.map((region) => (
                <span key={region.id} className="s07-readout-name">
                  {region.label}
                </span>
              ))}
            </p>

            <p key={group.id} className="s07-readout-note s07-swap">
              {group.note}
            </p>
          </div>
        </div>
      </div>

      {/*
        Outcome-variability line. Deliberately NOT inside a Reveal and never
        conditional: a disclaimer that only appears once an observer fires is a
        disclaimer that can fail to appear.
      */}
      <p className="s07-map-scope">
        <span className="s07-map-scope-tag" aria-hidden="true">
          Illustrative
        </span>
        {bodyMap.disclaimer}
      </p>

      <p className="sr-only">
        {bodyMap.summaryLabel}: {summary}
      </p>
    </div>
  );
}
