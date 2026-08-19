import { useCallback, useEffect, useMemo } from "react";
import { useDebouncedValue } from "./useDebouncedValue";
import { usePersistentState } from "./usePersistentState";
import { useWorkerTask } from "./useWorkerTask";
import { getTextStats } from "../utils/tokenEstimator";
import { DEFAULT_CLEAN_OPTIONS, ANALYSIS_DEBOUNCE_MS } from "../config/contextShrinkConfig";
import { DEFAULT_SHRINK_EXAMPLE } from "../data/shrinkExamples";

const EMPTY_RESULT = {
  cleaned: "",
  cleanedStats: { characters: 0, words: 0, lines: 0, tokens: 0 },
  stateMap: { componentName: "Component", props: [], state: [], customHooks: [], allHooks: [], effects: [] },
  summary: "",
};

function createCodeProcessorWorker() {
  return new Worker(new URL("../workers/codeProcessor.worker.js", import.meta.url), { type: "module" });
}

export function useContextShrink() {
  const [code, setCode] = usePersistentState("context-shrink-code", DEFAULT_SHRINK_EXAMPLE);
  const [options, setOptions] = usePersistentState("context-shrink-options", DEFAULT_CLEAN_OPTIONS);

  const debouncedCode = useDebouncedValue(code, ANALYSIS_DEBOUNCE_MS);
  const rawStats = useMemo(() => getTextStats(code), [code]);

  // Cleaning + state-map extraction run in a Web Worker so large pasted
  // components never block typing while the (regex-heavy) passes run.
  const { result, isProcessing, run } = useWorkerTask(createCodeProcessorWorker);

  useEffect(() => {
    run({ code: debouncedCode, options });
  }, [debouncedCode, options, run]);

  const toggleOption = useCallback(
    (id) => setOptions((prev) => ({ ...prev, [id]: !prev[id] })),
    [setOptions],
  );

  const reset = useCallback(() => setCode(DEFAULT_SHRINK_EXAMPLE), [setCode]);

  return {
    code,
    setCode,
    options,
    toggleOption,
    rawStats,
    isRecalculating: isProcessing,
    reset,
    ...(result ?? EMPTY_RESULT),
  };
}
