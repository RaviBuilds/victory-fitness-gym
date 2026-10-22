/**
 * /start — "Find Your Starting Point" logic layer.
 *
 * Every question, option, recommendation rule and derived string the Start
 * Check renders is computed here, in one pure module with no React and no DOM —
 * the same separation precedent as components/sections/reviewSignal.ts. The
 * client component (components/motion/StartCheck.tsx) only holds interaction
 * state and renders; the educational content and the deterministic mapping
 * from answers to a starting point live here where they can be read and
 * reasoned about in isolation.
 *
 * GYM-AGNOSTIC: this module imports no gym data. Everything gym-specific
 * (verified programs, documented equipment, opening hours) arrives through a
 * `GymContext` that app/start/page.tsx derives from the existing data layer
 * (lib/services.ts, lib/about.ts, lib/business.ts) via `deriveGymContext`.
 * Equipment is only ever mentioned when a keyword appears in that verified
 * data — nothing is invented, and an unverified program yields no copy.
 *
 * The rule that matters most in this file: NO MEDICAL OR MEASUREMENT CLAIM.
 * There is no height, weight, age, BMI, calorie or heart-rate field anywhere;
 * the recommendation is a plain-language training-structure suggestion derived
 * from five qualitative answers, never a prescription.
 */

export interface StartQuestionOption {
  value: string;
  label: string;
}

export interface StartQuestion {
  id: string;
  prompt: string;
  options: StartQuestionOption[];
}

/**
 * The five questions, in order. Ids are stable keys referenced by StartAnswers
 * and the summary/message builders — never rename them without updating both.
 */
export const START_QUESTIONS: StartQuestion[] = [
  {
    id: "goal",
    prompt: "WHAT ARE YOU TRAINING FOR?",
    options: [
      { value: "fat-loss", label: "FAT LOSS" },
      { value: "strength", label: "BUILD STRENGTH" },
      { value: "muscle", label: "BUILD MUSCLE" },
      { value: "general-fitness", label: "GENERAL FITNESS" },
      { value: "returning", label: "GET BACK INTO TRAINING" },
    ],
  },
  {
    id: "experience",
    prompt: "WHERE ARE YOU RIGHT NOW?",
    options: [
      { value: "new", label: "I'M NEW TO THE GYM" },
      { value: "returning", label: "I USED TO TRAIN" },
      { value: "occasional", label: "I TRAIN OCCASIONALLY" },
      { value: "regular", label: "I TRAIN REGULARLY" },
    ],
  },
  {
    id: "days",
    prompt: "HOW MANY DAYS CAN YOU REALISTICALLY TRAIN?",
    options: [
      { value: "2", label: "2 DAYS" },
      { value: "3", label: "3 DAYS" },
      { value: "4", label: "4 DAYS" },
      { value: "5+", label: "5+ DAYS" },
    ],
  },
  {
    id: "time",
    prompt: "WHEN CAN YOU TRAIN?",
    options: [
      { value: "early-morning", label: "EARLY MORNING" },
      { value: "morning", label: "MORNING" },
      { value: "afternoon", label: "AFTERNOON" },
      { value: "evening", label: "EVENING" },
      { value: "varies", label: "IT VARIES" },
    ],
  },
  {
    id: "support",
    prompt: "WHAT WOULD MAKE STARTING EASIER?",
    options: [
      { value: "routine", label: "A SIMPLE ROUTINE" },
      { value: "trainer", label: "A TRAINER TO GUIDE ME" },
      { value: "membership", label: "A CLEAR MEMBERSHIP OPTION" },
      { value: "first-visit", label: "A FIRST VISIT" },
      { value: "unsure", label: "I'M NOT SURE YET" },
    ],
  },
];

export interface StartAnswers {
  goal: string;
  experience: string;
  days: string;
  time: string;
  support: string;
}

/* ------------------------------------------------------------------------ */
/* Small text helpers                                                        */
/* ------------------------------------------------------------------------ */

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function sentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const SMALL_WORDS = new Set(["and", "or", "to", "of", "the", "a"]);

function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      i > 0 && SMALL_WORDS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function dayCount(days: string): number {
  if (days === "2") return 2;
  if (days === "3") return 3;
  if (days === "4") return 4;
  return 5;
}

/* ------------------------------------------------------------------------ */
/* Gym context (derived from the gym's own verified data)                    */
/* ------------------------------------------------------------------------ */

export interface HoursEntry {
  day: string;
  open: string;
  close: string;
}

/**
 * The gym-specific facts the result may reference. Every field is optional /
 * possibly empty: when the gym's data does not document something, the copy
 * that would mention it is simply not produced.
 */
export interface GymContext {
  /** Name of the verified weight-training program, if any. */
  weightTrainingName?: string;
  /** Name of the verified cardio program, if any. */
  cardioName?: string;
  /** Documented description of the cardio zone, if the gym has one. */
  cardioDetail?: string;
  /** Name + description of the verified personal-training program, if any. */
  personalTrainingName?: string;
  personalTrainingDescription?: string;
  /** Equipment named in the gym's verified data, e.g. "free weights". */
  strengthEquipment: string[];
  /** Cardio equipment named in the gym's verified data, e.g. "treadmills". */
  cardioEquipment: string[];
  hours: HoursEntry[];
}

export interface GymContextInput {
  services: { id: string; name: string; description: string; verified: boolean }[];
  zones: { label: string; detail?: string; verified: boolean }[];
  attributes: { id: string; label: string; verified: boolean }[];
  hours: HoursEntry[];
}

const STRENGTH_EQUIPMENT: [RegExp, string][] = [
  [/free weights?/i, "free weights"],
  [/dumbbells?/i, "dumbbells"],
  [/barbells?/i, "barbells"],
  [/\bcables?\b/i, "cable machines"],
  [/(resistance|strength) machines?/i, "resistance machines"],
];

const CARDIO_EQUIPMENT: [RegExp, string][] = [
  [/treadmills?/i, "treadmills"],
  [/air\s?bikes?/i, "air bikes"],
  [/(exercise|stationary|spin) bikes?|cycles\b/i, "exercise bikes"],
  [/\browers?\b|rowing machines?/i, "rowers"],
  [/ellipticals?|cross[- ]?trainers?/i, "cross trainers"],
  [/stair (climbers?|machines?)|steppers?/i, "stair machines"],
];

/**
 * Reduce the gym's existing data to the facts the result may mention. Only
 * `verified: true` entries are read, and equipment is matched by keyword
 * against that verified text — so a piece of equipment the gym has not
 * documented can never appear in the result.
 */
export function deriveGymContext(input: GymContextInput): GymContext {
  const services = input.services.filter((s) => s.verified);
  const byId = (id: string) => services.find((s) => s.id === id);

  const weights = byId("strength-training") ?? byId("bodybuilding");
  // Only treat the "conditioning" program as cardio when its own verified text
  // says so; a gym whose program of that id is something else (e.g. general
  // gym access) must not get cardio copy it has not documented.
  const conditioning = byId("conditioning");
  const cardio =
    conditioning &&
    /cardio|conditioning|treadmill|bike|rowing|interval/i.test(
      `${conditioning.name} ${conditioning.description}`
    )
      ? conditioning
      : undefined;
  const trainer = byId("personal-training");

  const zones = input.zones.filter((z) => z.verified);
  const attributes = input.attributes.filter((a) => a.verified);

  const hasCardioZone = zones.some((z) => /cardio/i.test(z.label));
  const hasTrainerAttribute = attributes.some((a) => a.id === "personal-training");

  const corpus = [
    ...zones.map((z) => `${z.label} ${z.detail ?? ""}`),
    ...services.map((s) => `${s.name} ${s.description}`),
    ...attributes.map((a) => a.label),
  ].join(" \n ");

  const detect = (table: [RegExp, string][]) =>
    table.filter(([re]) => re.test(corpus)).map(([, label]) => label);

  return {
    weightTrainingName: weights?.name,
    cardioName: cardio?.name ?? (hasCardioZone ? "Cardio" : undefined),
    cardioDetail: zones.find((z) => /cardio/i.test(z.label))?.detail,
    personalTrainingName:
      trainer?.name ?? (hasTrainerAttribute ? "Personal Training" : undefined),
    personalTrainingDescription: trainer?.description,
    strengthEquipment: detect(STRENGTH_EQUIPMENT),
    cardioEquipment: detect(CARDIO_EQUIPMENT),
    hours: input.hours,
  };
}

/* ---- opening-hours helpers ---- */

function toMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(match[2]);
}

function openSpan(entry: HoursEntry): [number, number] | null {
  const open = toMinutes(entry.open);
  let close = toMinutes(entry.close);
  if (open === null || close === null) return null;
  if (close <= open) close += 24 * 60;
  return [open, close];
}

/** "Mon–Sat 05:30 AM – 10:00 PM, Sun 06:00 AM – 10:00 PM", or null if >3 windows. */
function summariseHours(hours: HoursEntry[]): string | null {
  const groups: { days: string[]; open: string; close: string }[] = [];
  for (const entry of hours) {
    if (!entry.day || !entry.open || !entry.close) return null;
    const last = groups[groups.length - 1];
    if (last && last.open === entry.open && last.close === entry.close) {
      last.days.push(entry.day);
    } else {
      groups.push({ days: [entry.day], open: entry.open, close: entry.close });
    }
  }
  if (groups.length === 0 || groups.length > 3) return null;
  const short = (d: string) => d.trim().slice(0, 3);
  return groups
    .map((g) => {
      const label =
        g.days.length === 1
          ? short(g.days[0])
          : `${short(g.days[0])}\u2013${short(g.days[g.days.length - 1])}`;
      return `${label} ${g.open} \u2013 ${g.close}`;
    })
    .join(", ");
}

/** Preferred-time windows, in minutes from midnight. */
const TIME_WINDOWS: Record<string, { label: string; from: number; to: number }> = {
  "early-morning": { label: "early mornings", from: 5 * 60, to: 8 * 60 },
  morning: { label: "mornings", from: 8 * 60, to: 12 * 60 },
  afternoon: { label: "afternoons", from: 12 * 60, to: 17 * 60 },
  evening: { label: "evenings", from: 17 * 60, to: 21 * 60 + 30 },
};

/* ------------------------------------------------------------------------ */
/* Recommendation (title + why)                                              */
/* ------------------------------------------------------------------------ */

export interface StartRecommendation {
  title: string;
  description: string;
  /** One sentence explaining which answers led to this starting point. */
  rationale: string;
}

const EXPERIENCE_REASON: Record<string, string> = {
  new: "you're new to the gym",
  returning: "you used to train",
  occasional: "you train occasionally",
  regular: "you already train regularly",
};

const GOAL_REASON: Record<string, string> = {
  "fat-loss": "your goal is fat loss",
  strength: "you want to build strength",
  muscle: "you want to build muscle",
  "general-fitness": "you want general fitness",
  returning: "you want to get back into training",
};

function buildRationale(answers: StartAnswers): string {
  const parts: string[] = [];
  const experience = EXPERIENCE_REASON[answers.experience];
  const goal = GOAL_REASON[answers.goal];
  if (experience) parts.push(experience);
  if (goal) parts.push(goal);
  parts.push(
    `you can train ${answers.days === "5+" ? "5+" : dayCount(answers.days)} days a week`
  );
  return `Chosen because ${joinList(parts)}.`;
}

/**
 * Map the five answers to a single starting point. A SIMPLE deterministic
 * if/else, not a scoring system: experience is evaluated first because it is
 * the strongest signal for someone deciding where to begin, then goal. No
 * description makes a medical claim or promises a result.
 */
export function getRecommendation(answers: StartAnswers): StartRecommendation {
  const rationale = buildRationale(answers);

  if (answers.experience === "new") {
    return {
      title: "FOUNDATION TRAINING",
      description:
        "Start by learning the basic movements and building a consistent habit first. Everything else is easier once showing up is routine.",
      rationale,
    };
  }

  if (answers.experience === "returning") {
    return {
      title: "CONSISTENCY FIRST",
      description:
        "Rebuild gradually rather than picking up where you left off. Consistency matters more than intensity when you're getting back into training.",
      rationale,
    };
  }

  if (answers.goal === "returning") {
    return {
      title: "RETURN TO TRAINING",
      description:
        "Ease back in with a repeatable weekly rhythm, and let effort build naturally once the habit is back.",
      rationale,
    };
  }

  if (answers.goal === "strength") {
    return {
      title: "STRENGTH FOUNDATION",
      description:
        "Begin with a strength-focused starting structure built around a few core lifts you can repeat and progress week to week.",
      rationale,
    };
  }

  if (answers.goal === "muscle") {
    return {
      title: "MUSCLE BUILDING FOUNDATION",
      description:
        "Focus on consistent resistance training across the week, repeating movements often enough to build a steady base.",
      rationale,
    };
  }

  if (answers.goal === "fat-loss") {
    return {
      title: "CONSISTENCY FIRST",
      description:
        "Combine consistent strength work with regular conditioning, kept simple enough to repeat week after week.",
      rationale,
    };
  }

  return {
    title: "BALANCED FOUNDATION",
    description:
      "A balanced mix of strength and cardio gives you a well-rounded starting point you can build on in any direction later.",
    rationale,
  };
}

/* ------------------------------------------------------------------------ */
/* Weekly plan                                                               */
/* ------------------------------------------------------------------------ */

export type PlanDayKind = "lower" | "upper" | "full" | "conditioning" | "recovery";

export interface PlanDay {
  id: string;
  /** "DAY 01" */
  dayLabel: string;
  /** "LOWER BODY" */
  title: string;
  kind: PlanDayKind;
  /** Muscle groups or qualities trained, rendered joined with " · ". */
  focus: string[];
  /** What the session consists of, in general educational terms. */
  training: string;
}

export interface WeeklyPlan {
  label: string;
  /** One line explaining why the week is split the way it is. */
  summary: string;
  days: PlanDay[];
  /** Optional single line of practical guidance, driven by the answers. */
  note?: string;
}

type SlotVariant = "a" | "b" | "c" | "cond";
interface Slot {
  kind: PlanDayKind;
  variant: SlotVariant;
}

const slot = (kind: PlanDayKind, variant: SlotVariant = "a"): Slot => ({
  kind,
  variant,
});

/**
 * Choose the session pattern. The number of days sets the size of the week;
 * experience decides how hard it is (novices get full-body repetition and
 * built-in easy days); the goal decides where strength vs conditioning sits.
 */
function getSlots(answers: StartAnswers): Slot[] {
  const n = dayCount(answers.days);
  const novice = answers.experience === "new" || answers.experience === "returning";
  const goal = answers.goal;
  const lifting = goal === "strength" || goal === "muscle";

  switch (n) {
    case 2:
      return goal === "fat-loss"
        ? [slot("full", "a"), slot("full", "cond")]
        : [slot("full", "a"), slot("full", "b")];

    case 3:
      if (novice) {
        return lifting
          ? [slot("full", "a"), slot("full", "b"), slot("full", "c")]
          : [slot("full", "a"), slot("conditioning"), slot("full", "b")];
      }
      if (lifting) return [slot("lower"), slot("upper"), slot("full")];
      if (goal === "fat-loss") {
        return [slot("full", "a"), slot("conditioning"), slot("full", "b")];
      }
      return [slot("lower"), slot("upper"), slot("conditioning")];

    case 4:
      if (novice) {
        return [slot("full", "a"), slot("conditioning"), slot("full", "b"), slot("recovery")];
      }
      if (goal === "muscle") {
        return [slot("lower"), slot("upper"), slot("lower", "b"), slot("upper", "b")];
      }
      if (goal === "strength") {
        return [slot("lower"), slot("upper"), slot("full"), slot("conditioning")];
      }
      return [slot("lower"), slot("upper"), slot("conditioning"), slot("full")];

    default:
      if (answers.experience === "new") {
        return [
          slot("full", "a"),
          slot("conditioning"),
          slot("full", "b"),
          slot("recovery"),
          slot("full", "c"),
        ];
      }
      if (answers.experience === "returning") {
        return [
          slot("full", "a"),
          slot("conditioning"),
          slot("full", "b"),
          slot("recovery"),
          slot("conditioning", "b"),
        ];
      }
      if (goal === "muscle") {
        return [
          slot("lower"),
          slot("upper"),
          slot("lower", "b"),
          slot("upper", "b"),
          slot("conditioning"),
        ];
      }
      if (goal === "strength") {
        return [
          slot("lower"),
          slot("upper"),
          slot("full"),
          slot("conditioning"),
          slot("recovery"),
        ];
      }
      if (goal === "fat-loss") {
        return [
          slot("lower"),
          slot("upper"),
          slot("conditioning"),
          slot("full"),
          slot("conditioning", "b"),
        ];
      }
      return [
        slot("lower"),
        slot("upper"),
        slot("conditioning"),
        slot("full"),
        slot("recovery"),
      ];
  }
}

interface PhraseSet {
  beginner: string;
  base: string;
  strength?: string;
  muscle?: string;
}

/** Choose the wording that fits the visitor's experience, then their goal. */
function pickPhrase(answers: StartAnswers, phrases: PhraseSet): string {
  if (answers.experience === "new") return phrases.beginner;
  if (answers.experience === "returning") return phrases.base;
  const text =
    (answers.goal === "strength" && phrases.strength) ||
    (answers.goal === "muscle" && phrases.muscle) ||
    phrases.base;
  return answers.experience === "regular"
    ? `${text} Add load or reps gradually.`
    : text;
}

/** Where to do conditioning: the gym's documented cardio kit, else generic. */
function conditioningLocation(ctx: GymContext): string {
  if (ctx.cardioEquipment.length > 0) return ` on ${joinList(ctx.cardioEquipment)}`;
  if (ctx.cardioName && /cardio/i.test(ctx.cardioName)) return " in the gym's cardio area";
  return " (walking, cycling or another low-impact option)";
}

function buildDay(slotDef: Slot, answers: StartAnswers, ctx: GymContext): Omit<PlanDay, "id" | "dayLabel"> {
  const novice = answers.experience === "new";
  const easing = novice || answers.experience === "returning";
  const { kind, variant } = slotDef;

  switch (kind) {
    case "lower":
      if (variant === "b") {
        return {
          title: "LOWER BODY",
          kind,
          focus: ["Hamstrings", "Glutes", "Calves", "Core"],
          training: pickPhrase(answers, {
            beginner: "Hinge, glute bridge and calf-raise basics with light core work.",
            base: "Hinge lifts, glute and hamstring work, with calf and core finishers.",
          }),
        };
      }
      return {
        title: "LOWER BODY",
        kind,
        focus: ["Quads", "Hamstrings", "Glutes", "Calves"],
        training: pickPhrase(answers, {
          beginner: "Learn squat, hinge and lunge patterns with light loads.",
          base: "Squats, leg press, lunges and hamstring work.",
          strength: "Squat and hinge lifts plus leg press, repeated so you can add load.",
          muscle: "Squats, leg press, lunges and hamstring curls in controlled, moderate reps.",
        }),
      };

    case "upper":
      if (variant === "b") {
        return {
          title: "UPPER BODY",
          kind,
          focus: ["Shoulders", "Arms", "Upper back"],
          training: pickPhrase(answers, {
            beginner: "Light shoulder, arm and upper-back work on machines or dumbbells.",
            base: "Extra shoulder, arm and upper-back volume to balance the week.",
          }),
        };
      }
      return {
        title: "UPPER BODY",
        kind,
        focus: ["Chest", "Back", "Shoulders", "Arms"],
        training: pickPhrase(answers, {
          beginner: "Learn basic pushing and pulling on machines or light dumbbells.",
          base: "Balanced pushing and pulling, plus shoulder and arm work.",
          strength: "Press and row patterns, with shoulder and arm accessory work.",
          muscle: "Pressing, rowing, shoulder and arm work in controlled, moderate reps.",
        }),
      };

    case "full": {
      const focus = novice
        ? ["Total-body basics", "Movement skills"]
        : ["Total-body strength", "Core"];
      if (variant === "cond") {
        return {
          title: "FULL BODY + CONDITIONING",
          kind,
          focus: ["Total-body strength", "Conditioning"],
          training: `Compound strength work finished with a short conditioning block${conditioningLocation(ctx)}.`,
        };
      }
      if (variant === "b") {
        return {
          title: "FULL BODY",
          kind,
          focus,
          training: pickPhrase(answers, {
            beginner: "A second pass at the basics: hinge, lunge, overhead press, pulldown and core.",
            base: "Hinge, lunge, overhead press and pulldown variations with core work.",
          }),
        };
      }
      if (variant === "c") {
        return {
          title: "FULL BODY",
          kind,
          focus,
          training: pickPhrase(answers, {
            beginner: "Repeat the key patterns — squat, press, pull — and focus on smooth technique.",
            base: "Repeat the key patterns and note what feels easier than last time.",
          }),
        };
      }
      return {
        title: "FULL BODY",
        kind,
        focus,
        training: pickPhrase(answers, {
          beginner: "Squat or leg press, a push, a pull and a core move — kept light and simple.",
          base: "Compound movements for legs, push and pull, with core work.",
          strength: "Big compound lifts across legs, push and pull, with core work.",
          muscle: "Compound lifts plus a few targeted moves for every major muscle group.",
        }),
      };
    }

    case "conditioning": {
      const where = conditioningLocation(ctx);
      let training: string;
      if (variant === "b") {
        training = `A longer, easier steady session${where} at a conversational pace.`;
      } else if (novice) {
        training = `Steady, conversational-pace cardio${where}; build minutes gradually.`;
      } else if (answers.experience === "returning") {
        training = `Easy-to-moderate steady cardio${where}; ease back in.`;
      } else if (answers.goal === "strength") {
        training = `Easy aerobic work${where} to support recovery between lifting days.`;
      } else if (answers.goal === "muscle") {
        training = `Short, moderate conditioning${where} that supports fitness without crowding recovery.`;
      } else {
        training = `Steady cardio and simple intervals${where}.`;
      }
      return {
        title: "CONDITIONING",
        kind,
        focus: easing ? ["Cardio fitness", "Stamina"] : ["Cardio fitness", "Work capacity"],
        training,
      };
    }

    default:
      return {
        title: "ACTIVE RECOVERY",
        kind: "recovery",
        focus: ["Mobility", "Recovery", "Light conditioning"],
        training: novice
          ? "Easy walking and gentle mobility — this day is for recovering, not pushing."
          : "Walking, mobility, stretching or light cardio.",
      };
  }
}

function buildPlanSummary(slots: Slot[]): string {
  const has = (k: PlanDayKind) => slots.some((s) => s.kind === k);
  const hasSplit = has("lower") || has("upper");
  if (!hasSplit) {
    return "Full-body sessions keep every day simple and easy to repeat.";
  }
  if (has("conditioning") || has("recovery")) {
    return "Lower and upper days are balanced with conditioning and recovery.";
  }
  return "Lower and upper days alternate so each muscle group gets time to recover.";
}

function buildPlanNote(answers: StartAnswers): string | undefined {
  if (answers.experience === "new" && answers.days === "5+") {
    return "Starting out, keep the lighter days genuinely light and add effort gradually.";
  }
  if (answers.experience === "returning" || answers.goal === "returning") {
    return "Begin a step below where you used to train and build back gradually.";
  }
  if (answers.support === "routine") {
    return "Repeat this same week for a few weeks before changing anything.";
  }
  return undefined;
}

/**
 * Build the weekly structure from the visitor's answers and the gym's own
 * documented facilities. General educational structure, not a prescription.
 */
export function getWeeklyPlan(answers: StartAnswers, ctx: GymContext): WeeklyPlan {
  const slots = getSlots(answers);

  const days: PlanDay[] = slots.map((s, i) => ({
    id: `day-${i + 1}`,
    dayLabel: `DAY ${String(i + 1).padStart(2, "0")}`,
    ...buildDay(s, answers, ctx),
  }));

  // Mention the gym's documented strength equipment once, on the first
  // strength-type day, instead of repeating it on every card.
  if (ctx.strengthEquipment.length > 0) {
    const first = days.find((d) => d.kind !== "conditioning" && d.kind !== "recovery");
    if (first) {
      first.training = `${first.training} Options include ${joinList(ctx.strengthEquipment)}.`;
    }
  }

  return {
    label: `${days.length}-Day ${days.length === 5 ? "Weekly" : "Starting"} Structure`,
    summary: buildPlanSummary(slots),
    days,
    note: buildPlanNote(answers),
  };
}

/* ------------------------------------------------------------------------ */
/* "Why this fits" items                                                     */
/* ------------------------------------------------------------------------ */

export interface WhyItem {
  id: string;
  title: string;
  /** Short paragraphs shown when the item is expanded. */
  body: string[];
}

function weightTrainingItem(
  answers: StartAnswers,
  plan: WeeklyPlan,
  ctx: GymContext
): WhyItem | null {
  if (!ctx.weightTrainingName) return null;

  const lead =
    answers.goal === "strength"
      ? "Weight training is a structured way to build strength, and your week centres on lifts you can repeat and add to over time."
      : answers.goal === "muscle"
        ? "Resistance training is how you build muscle, and your week repeats key movements often enough to build a steady base."
        : answers.goal === "fat-loss"
          ? "Resistance work is the backbone of your week alongside conditioning, giving you a balanced structure you can repeat."
          : "Weight training is a structured way to build strength and improve movement over time.";

  const setup =
    ctx.strengthEquipment.length > 0
      ? `The gym's documented setup includes ${joinList(ctx.strengthEquipment)}, so there are options from simple machine work to free-weight lifts.`
      : "Your sessions can use whatever the gym floor offers, from simple machines to free-weight lifts.";

  const level =
    answers.experience === "new"
      ? "Early sessions are about learning the basics and showing up consistently, not lifting heavy."
      : answers.experience === "returning"
        ? "Start a step below where you left off and build back gradually."
        : answers.experience === "occasional"
          ? "Repeat a consistent set of movements so progress is easy to see."
          : "Track your main lifts and progress load or reps gradually.";

  const strengthDays = plan.days.filter(
    (d) => d.kind !== "conditioning" && d.kind !== "recovery"
  ).length;
  const strengthLine =
    strengthDays === plan.days.length
      ? `Every day of your ${plan.days.length}-day week is built around strength work.`
      : `${strengthDays} of your ${plan.days.length} days are built around strength work.`;

  return {
    id: "weights",
    title: ctx.weightTrainingName,
    body: [lead, setup, `${level} ${strengthLine}`],
  };
}

function cardioItem(
  answers: StartAnswers,
  plan: WeeklyPlan,
  ctx: GymContext
): WhyItem | null {
  if (!ctx.cardioName) return null;

  const options =
    ctx.cardioEquipment.length > 0
      ? `Cardio training supports your conditioning and overall fitness through options such as ${joinList(ctx.cardioEquipment)}, all documented at the gym.`
      : ctx.cardioDetail
        ? `${ctx.cardioDetail.replace(/\.?\s*$/, ".")} That supports your conditioning and overall fitness, and simple options such as brisk walking or steady low-impact cardio count towards your week.`
        : `${ctx.cardioName} is part of what the gym documents, and it supports your conditioning and overall fitness. Even without specific machines named, simple options such as brisk walking or steady low-impact cardio count towards your week.`;

  const goal =
    answers.goal === "fat-loss"
      ? "With fat loss as your goal, steady sessions and simple intervals keep your week active without every session needing to be hard."
      : answers.goal === "strength" || answers.goal === "muscle"
        ? "Kept short and easy, it supports fitness and recovery without crowding your lifting."
        : "It balances the strength work in your week and builds a base for whatever you choose next.";

  const level =
    answers.experience === "new" || answers.experience === "returning"
      ? "Intensity stays conversational while you build the habit, and you can increase it as you feel ready."
      : "Intensity can be raised with intervals or longer sessions as your fitness builds.";

  const count = plan.days.filter((d) => d.kind === "conditioning").length;
  const planLine =
    count > 0
      ? `Your plan includes ${count} conditioning day${count === 1 ? "" : "s"}.`
      : "Your plan has no dedicated conditioning day, but easy cardio after a session is a simple way to add some.";

  return {
    id: "cardio",
    title: ctx.cardioName,
    body: [options, goal, `${level} ${planLine}`],
  };
}

/**
 * Some gyms only document an OPENING time (no closing time). Describe exactly
 * that — never invent a closing hour — and point the visitor to the gym for
 * the rest.
 */
function openOnlyHoursItem(
  answers: StartAnswers,
  plan: WeeklyPlan,
  ctx: GymContext
): WhyItem | null {
  const opens = Array.from(new Set(ctx.hours.map((h) => h.open.trim())));
  const minutes = ctx.hours
    .map((h) => toMinutes(h.open))
    .filter((m): m is number => m !== null);
  if (minutes.length === 0) return null;

  const earliest = Math.min(...minutes);
  const earliestLabel = ctx.hours[minutes.indexOf(earliest)]?.open ?? opens[0];
  const sessions = `${plan.days.length} session${plan.days.length === 1 ? "" : "s"}`;
  const everyDay = opens.length === 1 && ctx.hours.length >= 7;

  const lead = everyDay
    ? `The gym's documented opening time is ${opens[0]}, every day of the week.`
    : `The gym's documented opening time starts from ${earliestLabel}.`;

  const window = TIME_WINDOWS[answers.time];
  let fit: string;
  if (!window) {
    fit = `You said your schedule varies, so the earlier start gives you room to fit your ${sessions} around work and life without losing your week.`;
  } else if (window.to <= 12 * 60 && earliest < window.to - 60) {
    fit = `You prefer training in the ${window.label.replace(/s$/, "")}, which lines up with that opening time, so your ${sessions} can sit in the same slot each week.`;
  } else {
    fit = `You prefer training in the ${window.label.replace(/s$/, "")}. Closing times are not documented here, so ask the gym which slots are available at that time.`;
  }

  return {
    id: "hours",
    title: "Training hours",
    body: [
      lead,
      fit,
      "A fixed slot is one of the easiest ways to keep a routine going. Confirm the full daily schedule with the gym before you plan your week.",
    ],
  };
}

function hoursItem(answers: StartAnswers, plan: WeeklyPlan, ctx: GymContext): WhyItem | null {
  if (ctx.hours.length > 0 && ctx.hours.every((h) => h.open && !h.close)) {
    return openOnlyHoursItem(answers, plan, ctx);
  }

  const spans = ctx.hours.map(openSpan);
  if (ctx.hours.length === 0 || spans.some((s) => s === null)) return null;

  const valid = spans as [number, number][];
  const flexible = valid.every(([open, close]) => close - open >= 10 * 60);
  const summary = summariseHours(ctx.hours);
  const hoursText = summary ? ` (${summary})` : "";
  const sessions = `${plan.days.length} session${plan.days.length === 1 ? "" : "s"}`;

  let body: string[];
  const window = TIME_WINDOWS[answers.time];

  if (!window) {
    body = [
      `You said your schedule varies. The gym's documented opening hours${hoursText} leave room to move sessions around work and life without losing your week.`,
      `Picking the same ${sessions} each week, even at different times, keeps the routine intact.`,
    ];
  } else {
    const covered = valid.filter(([open, close]) => {
      const overlap = Math.min(close, window.to) - Math.max(open, window.from);
      return overlap >= 60;
    }).length;

    if (covered === valid.length) {
      body = [
        `You prefer training in the ${window.label.replace(/s$/, "")}. The gym's documented hours${hoursText} cover that window on every open day.`,
        `That means your ${sessions} can sit in the same slot each week, and a fixed slot is one of the easiest ways to keep a routine going.`,
      ];
    } else if (covered > 0) {
      body = [
        `You prefer training in the ${window.label.replace(/s$/, "")}. The gym's documented hours${hoursText} cover that window on ${covered} of ${valid.length} days.`,
        `Plan your ${sessions} around those days, and ask the gym if you want a backup slot.`,
      ];
    } else {
      body = [
        `You prefer training in the ${window.label.replace(/s$/, "")}, which the documented hours${hoursText} don't clearly cover.`,
        "Ask the gym which nearby time would work best for your week.",
      ];
    }
  }

  return {
    id: "hours",
    title: flexible ? "Flexible training hours" : "Training hours",
    body,
  };
}

function trainerItem(answers: StartAnswers, plan: WeeklyPlan, ctx: GymContext): WhyItem | null {
  if (!ctx.personalTrainingName) return null;

  const documented = ctx.personalTrainingDescription
    ? ctx.personalTrainingDescription
    : "Personal training is available at the gym.";

  const coaching = `A coach can guide your exercise technique, help structure your ${plan.days.length}-day week, keep you accountable and adjust progression as you improve.`;

  const personal =
    answers.support === "trainer"
      ? "You said a trainer would make starting easier, so this is the first thing to ask the gym about."
      : answers.experience === "new"
        ? "For someone new to the gym, technique guidance in the early weeks can make the basics feel far less overwhelming."
        : "It is optional, but useful for reviewing your technique or planning your next step.";

  return {
    id: "trainer",
    title: "Personal training support",
    body: [documented, coaching, personal],
  };
}

/**
 * Personalised "why this gym fits YOUR start" items. Each item renders only
 * when the gym's verified data supports it. When the visitor said a trainer
 * (or a simple routine) would help, the matching item leads.
 */
export function getWhyItems(
  answers: StartAnswers,
  plan: WeeklyPlan,
  ctx: GymContext
): WhyItem[] {
  const items = [
    weightTrainingItem(answers, plan, ctx),
    cardioItem(answers, plan, ctx),
    hoursItem(answers, plan, ctx),
    trainerItem(answers, plan, ctx),
  ].filter((item): item is WhyItem => item !== null);

  const lead = answers.support === "trainer" ? "trainer" : null;
  if (lead) {
    items.sort((a, b) => Number(b.id === lead) - Number(a.id === lead));
  }
  return items;
}

/* ------------------------------------------------------------------------ */
/* Profile (answers) + WhatsApp message                                      */
/* ------------------------------------------------------------------------ */

export interface ProfileRow {
  id: string;
  label: string;
  value: string;
}

/** Display label for each question id, used by the profile readout. */
const PROFILE_LABELS: Record<string, string> = {
  goal: "Goal",
  experience: "Experience",
  days: "Commitment",
  time: "Preferred time",
  support: "Support",
};

/**
 * Resolve the chosen answers to friendly {label, value} rows for the "Your
 * starting profile" readout. A question with no matching answer (or an answer
 * that matches no option) is skipped gracefully.
 */
export function formatProfile(
  answers: StartAnswers,
  questions: StartQuestion[]
): ProfileRow[] {
  const rows: ProfileRow[] = [];

  for (const question of questions) {
    const selected = (answers as unknown as Record<string, string | undefined>)[question.id];
    if (!selected) continue;
    const option = question.options.find((o) => o.value === selected);
    if (!option) continue;
    const text = sentenceCase(option.label);
    rows.push({
      id: question.id,
      label: PROFILE_LABELS[question.id] ?? sentenceCase(question.id),
      value: question.id === "days" ? `${text} / week` : text,
    });
  }

  return rows;
}

/** Resolve one answer id to its human option label, with a graceful fallback. */
function resolveLabel(
  answers: StartAnswers,
  questions: StartQuestion[],
  id: string
): string {
  const selected = (answers as unknown as Record<string, string | undefined>)[id];
  if (!selected) return "Not specified";
  const question = questions.find((q) => q.id === id);
  const option = question?.options.find((o) => o.value === selected);
  return option?.label ?? "Not specified";
}

/**
 * Build the WhatsApp message a visitor sends from the result view.
 *
 * This function only ever has the five quiz answers, the recommendation title
 * and the suggested week — by design there is no height, weight, age or
 * medical field it could include. The gym name is passed in from the gym's
 * own configuration; nothing here is gym-specific.
 */
export function buildWhatsAppSummaryMessage(
  gymName: string,
  answers: StartAnswers,
  questions: StartQuestion[],
  recommendation: StartRecommendation,
  plan?: WeeklyPlan
): string {
  const goal = resolveLabel(answers, questions, "goal");
  const experience = resolveLabel(answers, questions, "experience");
  const days = resolveLabel(answers, questions, "days");
  const time = resolveLabel(answers, questions, "time");
  const support = resolveLabel(answers, questions, "support");

  const lines = [
    `Hi ${gymName},`,
    "",
    "I used your Find Your Starting Point tool.",
    "",
    `My goal: ${goal}`,
    `Experience: ${experience}`,
    `Training commitment: ${days}`,
    `Preferred time: ${time}`,
    `What would help me start: ${support}`,
    "",
    `My starting point: ${recommendation.title}`,
  ];

  if (plan && plan.days.length > 0) {
    lines.push(
      `Suggested week: ${plan.days.map((d) => titleCase(d.title)).join(", ")}`
    );
  }

  lines.push("", "I'd like to know how I can get started.");
  return lines.join("\n");
}
