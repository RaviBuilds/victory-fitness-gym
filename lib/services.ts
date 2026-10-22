import type { Service } from "./types";

/**
 * Master services data. Only services with verified:true render on the live
 * site. A service can exist here and remain disabled — this is the direct
 * mechanism that prevents an unverified/discontinued program from silently
 * appearing on a gym website.
 *
 * VICTORY FITNESS CLUB — all 4 programs from docs/Gym-research.md
 * (PROGRAMS.*): Strength Training, Cardio Training, Personal Training and
 * Core Exercises. Every entry is PUBLICLY_REPORTED (GBP visual evidence,
 * OnePass, FITPASS); owner verification of current availability, format and
 * schedule is required before final-client production. Descriptions restate
 * the research; no schedule, trainer, outcome or health claim is added.
 * The research reports no martial arts, yoga, Zumba or CrossFit — none is
 * created here.
 *
 * STABLE IDs: `strength-training`, `conditioning` and `personal-training`
 * are cross-referenced by id from the frozen educational module
 * lib/training-intelligence.ts (`programId`, see
 * components/sections/trainingLoadout.ts). These three ids must not be
 * renamed even though the gym-facing program name differs. Here
 * `conditioning` is carried by "Cardio Training" (the research's
 * conditioning-category program).
 *
 * Images are placeholders occupying their final filenames
 * (docs/MASTER-GYM-ASSET-CONTRACT.md); the operator replaces the files in
 * place with real Victory Fitness Club photography — no code change.
 */
const ASSET = "/assets/programs/victory-fitness-club-punjagutta-program";

export const services: Service[] = [
  {
    id: "strength-training",
    name: "Strength Training",
    description:
      "Free-weight training with dumbbells, benches, barbells and weight plates.",
    icon: "strength",
    image: `${ASSET}-strength-training.jpg`,
    verified: true,
    ctaLabel: "Ask about strength training",
    ctaHref: undefined,
  },
  {
    id: "personal-training",
    name: "Personal Training",
    description:
      "Personal training is publicly listed. Ask the gym about trainers and availability.",
    icon: "coaching",
    image: `${ASSET}-personal-training.jpg`,
    verified: true,
    ctaLabel: "Ask about personal training",
    ctaHref: undefined,
  },
  {
    id: "conditioning",
    name: "Cardio Training",
    description: "Cardio training on motorized treadmills.",
    icon: "cardio",
    image: `${ASSET}-cardio-training.jpg`,
    verified: true,
    ctaLabel: "Ask about cardio training",
    ctaHref: undefined,
  },
  {
    id: "core-exercises",
    name: "Core Exercises",
    description: "Core exercises are listed for the gym. Ask about format and availability.",
    icon: "floor",
    image: `${ASSET}-core-exercises.jpg`,
    verified: true,
    ctaLabel: "Ask about core exercises",
    ctaHref: undefined,
  },
];
