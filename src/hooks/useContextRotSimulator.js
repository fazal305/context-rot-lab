import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useDebouncedValue } from "./useDebouncedValue";
import { useWorkerTask } from "./useWorkerTask";
import { analyzeContext, getContextTier } from "../utils/contextRot";
import { applyContextOperation } from "../utils/contextOperations";
import { getTextStats } from "../utils/tokenEstimator";
import { getItem, setItem } from "../services/storageService";
import { DEFAULT_SIMULATOR_EXAMPLE, SIMULATOR_EXAMPLES } from "../data/simulatorExamples";
import { CONTEXT_OPERATIONS } from "../data/contextOperations";
import { ANALYSIS_DEBOUNCE_MS } from "../config/simulationConfig";

const TEXT_STORAGE_KEY = "simulator-context-text";

function createInitialState() {
  return {
    text: getItem(TEXT_STORAGE_KEY, DEFAULT_SIMULATOR_EXAMPLE.content),
    lastOperation: null,
  };
}

// Shown only for the brief window before the worker's first response
// arrives (normally faster than the loader's 200ms threshold, so this
// never actually flashes on screen for typical input sizes).
const EMPTY_SIMULATION = {
  stats: { characters: 0, words: 0, lines: 0, tokens: 0 },
  lineClasses: [],
  tier: getContextTier(0),
  noiseScore: 0,
  signalRatio: 0,
  accuracyScore: 0,
  confidence: 0,
  utilization: 0,
  lineBreakdown: { signal: 0, noise: 0, unused: 0, total: 0 },
  diagnosticIssues: [],
  snippet: "",
  outputCode: "",
  bugIssues: [],
  isDegraded: false,
};

function snapshotMetrics(text) {
  const analysis = analyzeContext(text);
  return {
    tokens: analysis.stats.tokens,
    noiseScore: analysis.noiseScore,
    accuracyScore: analysis.accuracyScore,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEXT":
      return { text: action.text, lastOperation: null };
    case "LOAD_EXAMPLE":
      return { text: action.content, lastOperation: null };
    case "APPLY_OPERATION": {
      const before = snapshotMetrics(state.text);
      const nextText = applyContextOperation(action.operationId, state.text);
      const after = snapshotMetrics(nextText);
      return {
        text: nextText,
        lastOperation: { id: action.operationId, label: action.label, before, after },
      };
    }
    case "RESET":
      return { text: DEFAULT_SIMULATOR_EXAMPLE.content, lastOperation: null };
    default:
      return state;
  }
}

function createAnalyzerWorker() {
  return new Worker(new URL("../workers/contextAnalyzer.worker.js", import.meta.url), { type: "module" });
}

export function useContextRotSimulator() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const debouncedText = useDebouncedValue(state.text, ANALYSIS_DEBOUNCE_MS);

  useEffect(() => {
    setItem(TEXT_STORAGE_KEY, state.text);
  }, [state.text]);

  // Cheap, instant feedback while typing — runs on the main thread since
  // it's just a couple of regex splits, not worth the postMessage overhead.
  const liveStats = useMemo(() => getTextStats(state.text), [state.text]);

  // Expensive analysis + bug injection, offloaded to a Web Worker so large
  // pasted contexts never block the input while the user is still typing.
  const { result: simulation, isProcessing, run } = useWorkerTask(createAnalyzerWorker);

  useEffect(() => {
    run(debouncedText);
  }, [debouncedText, run]);

  const setText = useCallback((text) => dispatch({ type: "SET_TEXT", text }), []);

  const loadExample = useCallback((exampleId) => {
    const example = SIMULATOR_EXAMPLES.find((item) => item.id === exampleId);
    if (example) dispatch({ type: "LOAD_EXAMPLE", content: example.content });
  }, []);

  const applyOperation = useCallback((operation) => {
    if (operation.id === "reset") {
      dispatch({ type: "RESET" });
      return;
    }
    dispatch({ type: "APPLY_OPERATION", operationId: operation.id, label: operation.label });
  }, []);

  return {
    text: state.text,
    setText,
    liveStats,
    simulation: simulation ?? EMPTY_SIMULATION,
    isRecalculating: isProcessing,
    lastOperation: state.lastOperation,
    examples: SIMULATOR_EXAMPLES,
    operations: CONTEXT_OPERATIONS,
    loadExample,
    applyOperation,
  };
}
