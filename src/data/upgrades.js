// Upgrade definitions for Dementia Code. Fictional game mechanics only —
// none of these represent real products or claim to change any actual
// external AI model's behavior.
export const UPGRADES = [
  {
    id: "token-pruner",
    name: "Token Pruner",
    description: "Trims redundant tokens from every generation before they hit context.",
    baseCost: 15,
    costGrowth: 1.6,
    maxLevel: 5,
    effect: { tokenGrowthMultiplier: 0.85 },
  },
  {
    id: "cursorrules",
    name: "Write .cursorrules",
    description: "Pins down conventions so simulated output drifts less as context grows.",
    baseCost: 30,
    costGrowth: 1,
    maxLevel: 1,
    effect: { decayResistance: 1.6 },
  },
  {
    id: "context-cleaner",
    name: "Automated Context Cleaner",
    description: "Every 5th generation, automatically prunes a chunk of stale context.",
    baseCost: 40,
    costGrowth: 1.8,
    maxLevel: 3,
    effect: { autoCleanAmount: 0.12 },
  },
  {
    id: "qa-tester",
    name: "Human QA Tester",
    description: "Catches the worst regressions before they tank build health.",
    baseCost: 25,
    costGrowth: 1.5,
    maxLevel: 5,
    effect: { healthDecayMultiplier: 0.8 },
  },
  {
    id: "better-model",
    name: "Better AI Model",
    description: "Raises the accuracy ceiling before context even starts piling up.",
    baseCost: 60,
    costGrowth: 2,
    maxLevel: 3,
    effect: { accuracyBonus: 3 },
  },
  {
    id: "rubber-duck",
    name: "Rubber Duck",
    description: "A small, silent, surprisingly effective reduction in technical debt.",
    baseCost: 10,
    costGrowth: 1.4,
    maxLevel: 5,
    effect: { debtGrowthMultiplier: 0.9 },
  },
];
