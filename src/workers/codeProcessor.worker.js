// Runs ContextShrink's code cleaning + state-map extraction off the main
// thread, for the same reason as contextAnalyzer.worker.js: large pasted
// components shouldn't block the UI while the (regex-heavy) cleaning
// passes run.
import { cleanCode } from "../utils/codeCleaner";
import { generateStateMap, formatStateMapSummary } from "../utils/stateMapGenerator";
import { getTextStats } from "../utils/tokenEstimator";

self.onmessage = (event) => {
  const { id, input } = event.data;
  const { code, options } = input;

  const cleaned = cleanCode(code, options);
  const cleanedStats = getTextStats(cleaned);
  const stateMap = generateStateMap(code);
  const summary = formatStateMapSummary(stateMap);

  self.postMessage({ id, payload: { cleaned, cleanedStats, stateMap, summary } });
};
