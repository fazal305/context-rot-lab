// Centralized tuning values for Dementia Code. A fictional, satirical game
// loop — none of these numbers model any real AI product's behavior.

export const CURRENCY_NAME = "Story Points";
export const MAX_CONTEXT_ENTRIES = 220;

export const BASE_LOC_PER_GENERATION = 8;
export const LOC_GROWTH_PER_DEBT = 0.15;

export const MAX_GAME_CONTEXT_TOKENS = 20000;
export const BASE_ACCURACY = 99;
export const ACCURACY_FLOOR = 4;

export const BASE_BUILD_HEALTH_DECAY = 0.25;
export const DEBT_HEALTH_DECAY_FACTOR = 0.0015;

export const BASE_DEBT_PER_GENERATION = 3;
export const DEBT_GROWTH_WITH_NOISE = 6;

export const BASE_STORY_POINTS_PER_GENERATION = 3;
export const STORY_POINTS_ACCURACY_BONUS = 5;

// Ordered descending by `min` — the first tier whose min the current
// accuracy meets or exceeds applies.
export const ACCURACY_TIERS = [
  { id: "pristine", label: "Pristine", min: 90, tone: "signal" },
  { id: "solid", label: "Solid", min: 70, tone: "signal" },
  { id: "shaky", label: "Shaky", min: 45, tone: "warning" },
  { id: "crumbling", label: "Crumbling", min: 20, tone: "noise" },
  { id: "meltdown", label: "Meltdown", min: 0, tone: "noise" },
];
