// Pure functions behind Dementia Code's game loop — kept separate from the
// reducer/hook so the "business logic" of the satire (name generation,
// response selection, accuracy curve, upgrade effects) is independently
// testable and free of React/storage concerns.
import { clamp } from "./number";
import { UPGRADES } from "../data/upgrades";
import { COMPONENT_NAME_PARTS, AI_RESPONSES } from "../data/gameResponses";
import { ACCURACY_TIERS, BASE_ACCURACY, ACCURACY_FLOOR, MAX_GAME_CONTEXT_TOKENS } from "../config/gameConfig";

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getAccuracyTier(accuracy) {
  return ACCURACY_TIERS.find((tier) => accuracy >= tier.min) ?? ACCURACY_TIERS[ACCURACY_TIERS.length - 1];
}

export function computeAccuracy(tokens, upgradeEffects) {
  const base = BASE_ACCURACY + upgradeEffects.accuracyBonus;
  const ratio = clamp(tokens / MAX_GAME_CONTEXT_TOKENS / upgradeEffects.decayResistance, 0, 1);
  const accuracy = base - ratio * (base - ACCURACY_FLOOR);
  return clamp(Math.round(accuracy), ACCURACY_FLOOR, 99);
}

export function generateComponentName(tier) {
  const { simple, compoundPrefixes, compoundMiddles, compoundSuffixes } = COMPONENT_NAME_PARTS;
  if (tier.id === "pristine" || tier.id === "solid") {
    return `${pick(simple)}.jsx`;
  }
  if (tier.id === "shaky") {
    return `${pick(compoundPrefixes)}${pick(simple)}.jsx`;
  }
  const wordCount = tier.id === "meltdown" ? 4 : 3;
  const parts = [pick(compoundPrefixes), pick(compoundMiddles)];
  while (parts.length < wordCount) parts.push(pick(compoundSuffixes));
  return `${parts.join("")}.jsx`;
}

export function pickAiResponse(tier) {
  const pool = AI_RESPONSES[tier.id] ?? AI_RESPONSES.meltdown;
  return pick(pool);
}

export function pickBoilerplateFragment(pool) {
  return pick(pool);
}

export function getUpgradeCost(upgrade, currentLevel) {
  return Math.round(upgrade.baseCost * upgrade.costGrowth ** currentLevel);
}

const DEFAULT_EFFECTS = {
  tokenGrowthMultiplier: 1,
  accuracyBonus: 0,
  decayResistance: 1,
  healthDecayMultiplier: 1,
  debtGrowthMultiplier: 1,
  autoCleanAmount: 0,
};

export function computeUpgradeEffects(ownedLevels) {
  const effects = { ...DEFAULT_EFFECTS };
  UPGRADES.forEach((upgrade) => {
    const level = ownedLevels[upgrade.id] ?? 0;
    if (!level) return;
    const { effect } = upgrade;
    if (effect.tokenGrowthMultiplier) effects.tokenGrowthMultiplier *= effect.tokenGrowthMultiplier ** level;
    if (effect.accuracyBonus) effects.accuracyBonus += effect.accuracyBonus * level;
    if (effect.decayResistance) effects.decayResistance *= effect.decayResistance ** level;
    if (effect.healthDecayMultiplier) effects.healthDecayMultiplier *= effect.healthDecayMultiplier ** level;
    if (effect.debtGrowthMultiplier) effects.debtGrowthMultiplier *= effect.debtGrowthMultiplier ** level;
    if (effect.autoCleanAmount) effects.autoCleanAmount += effect.autoCleanAmount * level;
  });
  return effects;
}
