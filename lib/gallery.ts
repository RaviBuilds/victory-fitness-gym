import type { GalleryItem } from "./types";

/**
 * Master gallery data. This array is authoritative for display order —
 * filename order is not a data dependency. Every item requires alt text
 * describing the actual image.
 *
 * VICTORY FITNESS CLUB — operator-supplied photographs in
 * public/assets/gallery/victory-fitness-club-punjagutta-gallery-<subject>.jpg.
 * Each alt describes only what is visible in that frame (equipment type and
 * area); no brand, count, claim or superlative is encoded.
 *
 * NOT INCLUDED: `jj.jpg` (two people at a certificate presentation) is a
 * people/credential photo, not a facility photo, and no consent or
 * certification claim is verified for it. It is left unreferenced in the
 * folder; add it only with owner approval.
 *
 * ORDER is editorial: the floor, free weights, cardio, then strength machines.
 */
const GALLERY = "/assets/gallery/victory-fitness-club-punjagutta-gallery";

export const galleryItems: GalleryItem[] = [
  {
    src: `${GALLERY}-gym-interior.jpg`,
    alt: "Victory Fitness Club training floor with strength machines, a hanging punching bag and yellow-and-grey pillars",
  },
  {
    src: `${GALLERY}-dumbbell-rack.jpg`,
    alt: "Two-tier dumbbell rack above rubber floor tiles with benches and mirrors behind",
  },
  {
    src: `${GALLERY}-treadmills.jpg`,
    alt: "Row of motorized treadmills beside a glass wall at Victory Fitness Club",
  },
  {
    src: `${GALLERY}-treadmill-and-stair-climber.jpg`,
    alt: "Treadmill and stair climber on the cardio floor by the windows",
  },
  {
    src: `${GALLERY}-stair-climber.jpg`,
    alt: "Stair-climber machine on the cardio floor",
  },
  {
    src: `${GALLERY}-spin-bikes.jpg`,
    alt: "Two indoor spin bikes beside the glass wall",
  },
  {
    src: `${GALLERY}-elliptical-trainers.jpg`,
    alt: "Two elliptical cross-trainers on the cardio floor",
  },
  {
    src: `${GALLERY}-recumbent-bike.jpg`,
    alt: "Recumbent exercise bike with elliptical trainers beside it",
  },
  {
    src: `${GALLERY}-chest-press-machine.jpg`,
    alt: "Seated chest press machine with a red pad",
  },
  {
    src: `${GALLERY}-shoulder-press-machine.jpg`,
    alt: "Seated shoulder press machine with a red pad",
  },
  {
    src: `${GALLERY}-seated-press-machine.jpg`,
    alt: "Selectorized seated press machine with the training floor behind",
  },
  {
    src: `${GALLERY}-lat-pulldown-machine.jpg`,
    alt: "Lat pulldown machine with a red seat and thigh pads",
  },
  {
    src: `${GALLERY}-seated-row-machine.jpg`,
    alt: "Seated row machine with a red chest pad",
  },
  {
    src: `${GALLERY}-functional-trainer.jpg`,
    alt: "Dual-cable functional trainer on the rubber-tiled floor",
  },
  {
    src: `${GALLERY}-plate-loaded-press.jpg`,
    alt: "Plate-loaded press machine with weight plates and a red bench",
  },
];
