import { useCallback, useEffect, useMemo, useReducer } from "react";
import { getItem, setItem, removeItem } from "../services/storageService";
import { estimateTokens } from "../utils/tokenEstimator";
import { clamp } from "../utils/number";
import {
  getAccuracyTier,
  computeAccuracy,
  computeUpgradeEffects,
  generateComponentName,
  pickAiResponse,
  pickBoilerplateFragment,
  getUpgradeCost,
} from "../utils/gameEngine";
import { UPGRADES } from "../data/upgrades";
import { STALE_CODE_FRAGMENTS, IRRELEVANT_CODE_FRAGMENTS } from "../data/bugFragments";
import * as cfg from "../config/gameConfig";

const STORAGE_KEY = "dementia-game-state";
const BOILERPLATE_POOL = [...STALE_CODE_FRAGMENTS, ...IRRELEVANT_CODE_FRAGMENTS];

function defaultState() {
  return {
    linesOfCode: 0,
    technicalDebt: 0,
    buildHealth: 100,
    storyPoints: 0,
    generationCount: 0,
    contextEntries: [],
    upgrades: {},
    log: [],
    cleanupNote: null,
  };
}

function createInitialState() {
  const saved = getItem(STORAGE_KEY, null);
  return saved ? { ...defaultState(), ...saved } : defaultState();
}

function reducer(state, action) {
  switch (action.type) {
    case "GENERATE": {
      const effects = computeUpgradeEffects(state.upgrades);
      const tokensBefore = estimateTokens(state.contextEntries.join("\n\n"));
      const accuracy = computeAccuracy(tokensBefore, effects);
      const tier = getAccuracyTier(accuracy);

      const name = generateComponentName(tier);
      const response = pickAiResponse(tier);

      const locGained = Math.max(3, Math.round(cfg.BASE_LOC_PER_GENERATION + state.technicalDebt * cfg.LOC_GROWTH_PER_DEBT));
      const debtGained = Math.max(
        1,
        Math.round((cfg.BASE_DEBT_PER_GENERATION + cfg.DEBT_GROWTH_WITH_NOISE * (1 - accuracy / 100)) * effects.debtGrowthMultiplier),
      );
      const healthLoss = Math.max(
        0,
        (cfg.BASE_BUILD_HEALTH_DECAY + state.technicalDebt * cfg.DEBT_HEALTH_DECAY_FACTOR) * effects.healthDecayMultiplier,
      );
      const pointsGained = cfg.BASE_STORY_POINTS_PER_GENERATION + Math.round(cfg.STORY_POINTS_ACCURACY_BONUS * (accuracy / 100));

      const boilerplateCount = clamp(Math.round((1 + state.technicalDebt / 15) * effects.tokenGrowthMultiplier), 1, 10);
      const boilerplate = Array.from({ length: boilerplateCount }, () => pickBoilerplateFragment(BOILERPLATE_POOL));
      const entryText = [`// Generated: ${name}`, `// AI: "${response}"`, ...boilerplate].join("\n");

      let entries = [...state.contextEntries, entryText];
      const generationCount = state.generationCount + 1;

      let cleanupNote = null;
      if (effects.autoCleanAmount > 0 && generationCount % 5 === 0 && entries.length > 5) {
        const removeCount = Math.max(1, Math.round(entries.length * effects.autoCleanAmount));
        entries = entries.slice(removeCount);
        cleanupNote = `Automated Context Cleaner pruned ${removeCount} stale entries.`;
      }

      if (entries.length > cfg.MAX_CONTEXT_ENTRIES) {
        entries = entries.slice(entries.length - cfg.MAX_CONTEXT_ENTRIES);
      }

      const logEntry = { id: `${generationCount}-${name}`, name, response, tier: tier.id, accuracy };

      return {
        ...state,
        linesOfCode: state.linesOfCode + locGained,
        technicalDebt: state.technicalDebt + debtGained,
        buildHealth: Math.round(clamp(state.buildHealth - healthLoss, 0, 100) * 10) / 10,
        storyPoints: state.storyPoints + pointsGained,
        generationCount,
        contextEntries: entries,
        log: [logEntry, ...state.log].slice(0, 30),
        cleanupNote,
      };
    }
    case "BUY_UPGRADE": {
      const upgrade = UPGRADES.find((item) => item.id === action.id);
      if (!upgrade) return state;
      const level = state.upgrades[upgrade.id] ?? 0;
      if (level >= upgrade.maxLevel) return state;
      const cost = getUpgradeCost(upgrade, level);
      if (state.storyPoints < cost) return state;
      return {
        ...state,
        storyPoints: state.storyPoints - cost,
        upgrades: { ...state.upgrades, [upgrade.id]: level + 1 },
      };
    }
    case "RESET":
      return defaultState();
    default:
      return state;
  }
}

export function useDementiaGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    setItem(STORAGE_KEY, state);
  }, [state]);

  const effects = useMemo(() => computeUpgradeEffects(state.upgrades), [state.upgrades]);
  const tokens = useMemo(() => estimateTokens(state.contextEntries.join("\n\n")), [state.contextEntries]);
  const accuracy = useMemo(() => computeAccuracy(tokens, effects), [tokens, effects]);
  const tier = useMemo(() => getAccuracyTier(accuracy), [accuracy]);

  const generate = useCallback(() => dispatch({ type: "GENERATE" }), []);
  const buyUpgrade = useCallback((id) => dispatch({ type: "BUY_UPGRADE", id }), []);
  const reset = useCallback(() => {
    removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
    tokens,
    accuracy,
    tier,
    contextItems: state.contextEntries.length,
    upgradeEffects: effects,
    generate,
    buyUpgrade,
    reset,
  };
}
