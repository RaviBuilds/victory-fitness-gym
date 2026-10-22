# Final Redesign --- Gym Website Factory Template

**Status:** Final design direction for the reusable gym website
template\
**Scope:** Visual / UX redesign only\
**Implementation:** Section-by-section in Kiro CLI\
**Hero:** FROZEN\
**Protected manual strips:** FROZEN\
**Prompt B / content replacement:** OUT OF SCOPE\
**Phase 26 browser QA:** ALREADY FINALIZED; DO NOT REOPEN

------------------------------------------------------------------------

## 1. Purpose

This is the final design direction for the **reusable gym website
template**.

It is **not a one-gym redesign**. The structure and presentation are
reusable across gyms; the existing `.ts` data/configuration remains the
source of truth for gym-specific content.

### Non-negotiable rule

**The template owns structure and presentation. The `.ts` files own
content.**

Never hardcode gym names, locations, program names, descriptions,
metrics, opening hours, testimonials, transformation values,
gym-specific claims, or client-specific image URLs into the redesigned
components when those values already come from the data/configuration
layer.

------------------------------------------------------------------------

## 2. Scope Boundaries

### This document IS

A design-system and implementation direction for improving:

-   information hierarchy
-   section composition
-   typography
-   spacing and rhythm
-   image treatment
-   metric hierarchy
-   grouping
-   card usage
-   accent usage
-   responsive behavior
-   restrained motion

### This document IS NOT

**Prompt B.** Prompt B is the content/data replacement workflow and must
not be mixed into this redesign.

Also out of scope:

-   gym research normalization
-   `.ts` content population
-   reopening Prompt B Phase 26 validation
-   exhaustive browser QA
-   a single master implementation pass

Implementation is intentionally **section-by-section**.

------------------------------------------------------------------------

## 3. Frozen Areas

### Hero

The hero is manually designed and finalized.

Do not change its:

-   layout
-   composition
-   typography
-   imagery
-   CTA structure
-   animation
-   spacing
-   navigation relationship

### Protected manual strips

The existing manually designed strips around/below the hero are also
frozen.

Do not redesign them merely to make the page visually uniform.

### Data architecture

Do not replace the existing data architecture. If content is already
supplied by `.ts` configuration/data, render it from there.

------------------------------------------------------------------------

# 4. Design Diagnosis

The current template's main problem is **pattern fatigue**, not lack of
content.

Too many sections currently repeat the same grammar:

-   cyan eyebrow
-   numbered section label
-   large headline
-   second headline line in red
-   mono metadata
-   numbered rows
-   repeated descriptions
-   repeated CTA
-   decorative rules
-   decorative counters

This makes the page feel system-generated rather than art-directed.

The redesign changes the **composition grammar**, not simply the colors.

### Full-page findings

-   **Index inflation:** section numbers, row numbers, case counters,
    FAQ numbers, form-field numbers and price-tier numbers add little
    meaning.
-   **Fact duplication:** major facts such as equipment counts appear in
    multiple sections at equal weight.
-   **Accent overuse:** red and cyan stop signaling importance when used
    everywhere.
-   **Mono overuse:** technical typography loses meaning when every
    label uses it.
-   **Unused space:** some layouts leave large areas empty while
    repeating small rows.
-   **Internal-sounding copy:** implementation/research notes should not
    become visitor-facing UI.

------------------------------------------------------------------------

# 5. Page Story and Rhythm

  Section                       Visitor question       Design grammar
  ----------------------------- ---------------------- --------------------------
  Hero                          What is this?          Frozen
  Training Environment          What is the place?     **Image-led**
  Protected light/tools strip   Where do I start?      Keep existing
  Programs                      What do you offer?     **Asymmetric / grouped**
  Why Us                        Why is it different?   **Editorial statement**
  Transformation                Does it work?          **Data story**
  Reviews                       Who vouches?           **Quote-led**
  Utility sections              What do I do next?     Functional / restrained

Adjacent sections should not feel like the same component repeated with
different copy.

------------------------------------------------------------------------

# 6. Global Design System

## Typography

### Level 1 --- Statement

Large section statements, editorial headlines and dominant outcomes.

### Level 2 --- Primary title

Featured program, philosophy line and major result.

### Level 3 --- Supporting title

Program names, zone names, group titles and card titles.

### Level 4 --- Body

Approximately 15--17px, readable line-height, muted neutral, short
measure.

### Level 5 --- Metadata

Mono / technical styling becomes rare. Use only for source notes,
consent notes, captions and genuinely technical metadata. Target 2--3
metadata elements per screen.

Do **not** force every headline into the same white-first-line /
red-second-line formula.

## Numbers

Keep meaningful numbers such as:

-   verified facility metrics
-   floors
-   transformation outcomes
-   before/after values
-   prices
-   opening hours
-   verified review count/rating

Remove decorative:

-   `01`, `02`, `03`
-   `01 / 06`
-   `05 / 06`
-   `CASE 02 / 02`
-   row counters
-   FAQ numbers
-   form-field numbers
-   decorative price-tier numbers

## Accent budget

**Red:** primary action, one focal point, selected/active emphasis,
dominant result.

**Cyan:** primarily interactive states and subtle system signals.

**Neutrals:** most of the interface.

Do not color every second headline line red or every label cyan.

## Cards

Cards are for peer comparison.

Good uses:

-   two guided-training programs
-   three transformation metrics

Avoid cards for:

-   amenities
-   principles
-   simple metadata
-   support text
-   every individual program

## Borders / decoration

Maximum roughly one structural rule per section unless a functional
reason requires more.

Remove unnecessary:

-   ghost numerals
-   corner markers
-   rings
-   decorative circles
-   excessive hairlines
-   boxed amenity icons
-   meaningless counters

Use whitespace and scale instead.

## Fact ownership

Each fact gets one primary visual home at full scale. Elsewhere it may
appear once as supporting context at a lower weight.

------------------------------------------------------------------------

# 7. Section 01 --- Training Environment

## Goal

Make the visitor understand the physical facility almost immediately.

This should feel like a **visual tour**, not a facility database.

## Hierarchy

1.  Facility image
2.  Important facility metrics
3.  Main training zones
4.  Amenities/support
5.  Opening hours

## Composition

Desktop direction:

``` text
SECTION STATEMENT

┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    LARGE FACILITY IMAGE                      │
│                                                              │
│       METRIC             METRIC             METRIC           │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Group Fitness      Functional Training      Stretching & Mobility
short description  short description        short description

───────────────────────────────────────────────────────────────

Amenities / support                          Opening hours
clean checklist                              compact block
```

The exact DOM can adapt to the existing component, but this hierarchy
must remain.

## Image

Use the strongest existing facility image through the existing
data/configuration.

Do not hardcode a particular gym asset.

Treatment:

-   wide editorial crop on desktop
-   strong visual presence
-   subtle dark gradient/vignette for text legibility
-   no decorative frame
-   no UI clutter

## Metrics

Place the major facility metrics directly over the image on desktop.

Use large numerals and clear labels.

Do not wrap each metric in a separate card.

## Training zones

Use a simple three-column strip:

-   Group Fitness
-   Functional Training
-   Stretching & Mobility

Plain columns, whitespace and optional subtle separators.

No boxed cards.

## Amenities

Use a clean checklist / inline information group.

No amenity cards or icon boxes.

## Opening hours

Compact adjacent information block. Keep it visible but secondary to the
image and metrics.

## Remove

-   row numbers
-   ghost numbers
-   image counters
-   decorative circles
-   boxed amenity icons
-   repeated row CTAs
-   unnecessary metadata

## Motion

If appropriate:

-   subtle image reveal/zoom
-   optional one-time metric animation
-   optional subtle crop response

No aggressive parallax, looping animation or stagger overload.

Respect `prefers-reduced-motion`.

## Responsive

### Desktop

Wide image, overlaid metrics, three-column zone strip, amenities/hours
split.

### Mobile

Keep hierarchy intact:

1.  section statement
2.  facility image
3.  primary metric
4.  remaining metrics
5.  zones
6.  amenities
7.  opening hours

Avoid simply collapsing every desktop element into a long stack.

------------------------------------------------------------------------

# 8. Section 02 --- Programs

Implement later, after Training Environment is manually approved.

Direction:

-   asymmetric composition
-   one featured/core program
-   two peer guided-training cards
-   group classes as a typographic list
-   support offerings as quiet text
-   one primary action

Do not give every program equal visual weight or its own CTA.

The featured program should be determined through reusable
data/configuration rather than hardcoded gym-specific content.

------------------------------------------------------------------------

# 9. Section 03 --- Why Us

Implement later.

Direction:

1.  central philosophy
2.  concise proof
3.  differentiators

Recommended composition:

-   large editorial statement on one side
-   tall supporting image on the other
-   one concise proof line
-   three differentiator groups below

Avoid six equal claims, numbered principles, ghost numerals, decorative
connecting lines and boxed principle cards.

The section should feel like an editorial spread rather than a feature
database.

------------------------------------------------------------------------

# 10. Section 04 --- Transformation

Implement later.

Direction: **data story**.

Hierarchy:

1.  outcome
2.  evidence
3.  method
4.  story

Recommended structure:

``` text
┌───────────────────────────────┬──────────────────────┐
│       DOMINANT OUTCOME        │    BEFORE / AFTER    │
│                               │        IMAGE         │
│          RESULT               │                      │
│        BEFORE → AFTER         │                      │
└───────────────────────────────┴──────────────────────┘

Metric 1             Metric 2             Metric 3

How it happened                         Story / protocol
chips                                   quiet key-value lists
```

Only true peer metrics should become cards.

The outcome must dominate.

Transformation content must remain data-driven and consent-aware. Never
convert template/demo figures into client-specific claims.

------------------------------------------------------------------------

# 11. Template Generalization

Every visual decision must survive different gyms.

The system must handle:

-   different machine counts
-   different floor counts
-   different program counts
-   different copy lengths
-   optional/missing images
-   different opening hours
-   different brand accents

Do not build around the exact text length or values visible in the
current screenshot.

------------------------------------------------------------------------

# 12. Implementation Strategy

Implement one section at a time:

1.  Training Environment
2.  Programs
3.  Why Us
4.  Transformation
5.  Remaining sections only after the core redesign is manually approved

After each section:

1.  implement
2.  run minimal sanity validation
3.  manually inspect
4.  stop

Do not automatically continue to the next section.

------------------------------------------------------------------------

# 13. Minimal Validation Policy

This is a manual-review-driven visual project.

For each section, perform only:

-   smallest relevant TypeScript/build check
-   affected page renders
-   no obvious runtime error
-   no obvious horizontal overflow
-   desktop structure is correct
-   mobile structure is correct
-   content still comes from existing `.ts` data/configuration
-   protected areas remain unchanged

Then stop.

Do **not** build an exhaustive test suite.

Do **not** run a full browser QA cycle.

Do **not** reopen Phase 26.

------------------------------------------------------------------------

# 14. Definition of Done

A section is ready for manual review when:

-   the new composition is implemented
-   repetitive old grammar is removed
-   data remains dynamic
-   no gym-specific content is hardcoded
-   protected areas are untouched
-   desktop works
-   mobile works
-   no obvious build/runtime issue exists
-   minimal checks pass

Then stop and wait for manual review.

------------------------------------------------------------------------

# 15. First Implementation Target

## Training Environment

This is the first section because it establishes the new visual
language:

**image → scale → metrics → grouping → supporting information**

Do not implement Programs, Why Us or Transformation in the same task.

------------------------------------------------------------------------

# 16. Kiro CLI Prompt --- Training Environment Only

Use this prompt with **Opus 5.5**:

``` text
You are implementing ONE section only in the existing reusable gym website template.

TARGET:
Training Environment / facility section immediately after the protected hero and protected manual strips.

PROJECT RULES:

1. This is a reusable gym website TEMPLATE.
2. Do NOT hardcode any gym name, location, program name, metric, opening hour, description, image URL, or client-specific content.
3. Existing `.ts` data/configuration remains the source of truth.
4. Keep existing data/configuration and props architecture.
5. Modify presentation/layout, not content.
6. Do not mix this with Prompt B or content replacement.
7. Do not reopen or modify Phase 26 validation/browser-QA work.
8. Do not touch the hero.
9. Do not touch the protected manual strips.
10. Do not redesign any other section.

DESIGN GOAL:

Redesign the Training Environment section from a repetitive numbered/list layout into an image-led facility showcase.

Hierarchy:

1. physical place
2. important facility metrics
3. main training zones
4. amenities/support
5. opening hours

IMPLEMENTATION:

- Inspect the existing Training Environment component and its related `.ts` data/configuration first.
- Use the strongest existing configured facility image as the visual anchor.
- Do not hardcode a specific gym image.
- Desktop should use a strong wide image composition.
- Overlay the actual facility metrics on the image using existing dynamic data.
- Use large numerals and clear labels.
- Do not create separate cards around each metric.
- Use a subtle dark gradient/vignette only where needed for readability.

Below the image:

- Group the main facility zones into a simple three-column strip:
  Group Fitness / Functional Training / Stretching & Mobility.
- These are plain content columns, NOT boxed cards.
- Keep descriptions data-driven.
- Use whitespace and subtle separators only if useful.

Below that:

- Amenities become a clean checklist / inline information group.
- Do not use individual amenity cards or icon boxes.
- Opening hours become a compact adjacent information block.
- Keep opening hours visible.

REMOVE FROM THIS SECTION:

- decorative row numbers
- ghost numerals
- image counters
- arbitrary 01/05/09/02 labels
- decorative circles
- boxed amenity icons
- repeated per-row CTA patterns
- unnecessary metadata
- redundant borders

TYPOGRAPHY:

Follow the existing project tokens.

Hierarchy:
- section statement = large display
- metrics = very large
- zone titles = medium
- body = readable muted text
- metadata = rare

Do NOT automatically make the second line of the headline red.

ACCENTS:

- Preserve the existing brand colors.
- Red = meaningful focal point/action only.
- Cyan = interactive states primarily.
- Do not invent a new color system.

RESPONSIVE:

Desktop:
- strong wide image
- metrics overlaid
- three-column zone strip
- amenities + hours below

Mobile:
- maintain hierarchy
- practical facility image crop
- primary metric remains prominent
- remaining metrics remain easy to scan
- zones become a clean horizontal or stacked structure
- amenities become compact two-column/stacked checklist
- opening hours remain visible
- no horizontal overflow

MOTION:

If the existing system supports it, use only restrained motion:
- subtle image reveal/zoom
- optional one-time metric animation

No complex animation. Respect prefers-reduced-motion.

IMPLEMENTATION METHOD:

1. Inspect the current section/component and data source.
2. Identify exactly where it is rendered.
3. Reuse existing data fields.
4. Implement the new composition using existing project conventions/utilities.
5. Avoid unrelated refactors.
6. Change only the Training Environment section.
7. Leave hero and protected strips untouched.

MINIMAL VALIDATION ONLY:

After implementation, do only:

- smallest relevant type/build check
- confirm affected page renders
- check for obvious runtime errors
- check desktop structure
- check mobile structure
- check obvious horizontal overflow
- confirm content still comes from `.ts` data/configuration

Do NOT run an exhaustive test suite.
Do NOT perform full browser QA.
Do NOT implement the next section.

When the checks pass, report:
- files changed
- visual changes
- confirmation that data remains dynamic
- minimal validation result
- anything needing manual review

Then STOP.
```

------------------------------------------------------------------------

# 17. Manual Review Gate

After Kiro finishes Training Environment, manually review it before
moving on.

Ask:

-   Does the image feel like the section hero?
-   Do the metrics feel important without becoming dashboard UI?
-   Is the section quieter than the old version?
-   Does it feel premium and human-directed?
-   Are the three zones clearly grouped?
-   Are amenities appropriately de-emphasized?
-   Are opening hours easy to find?
-   Does it still feel like the existing brand?
-   Does mobile feel intentionally designed?
-   Would the structure work for another gym with different content?

Only after approval should Programs be implemented.

------------------------------------------------------------------------

# 18. Final Principle

The objective is not to make the template more complicated.

It is to make it more intentional.

The old system communicates:

> Here are eight things. Here are their numbers. Here are their
> descriptions.

The redesigned system should communicate:

> Here is the place.\
> Here is what matters about it.\
> Here is what you can do here.\
> Here is why it is different.\
> Here is the proof.

That hierarchy is the foundation of the reusable redesign.
