// Runs the Context Rot Simulator's analysis pipeline (line classification,
// noise/accuracy scoring, focus-snippet extraction, bug injection) off the
// main thread, so large pasted contexts never block typing or scrolling.
// Imports the exact same pure utils the main thread would otherwise call
// directly — no logic duplication between the worker and a non-worker path.
import { analyzeContext, extractFocusSnippet } from "../utils/contextRot";
import { injectBugs } from "../utils/bugInjection";
import { clamp } from "../utils/number";
import { MAX_BUGS_INJECTED, ACCURACY_DEGRADED_THRESHOLD } from "../config/simulationConfig";

self.onmessage = (event) => {
  const { id, input: text } = event.data;

  const analysis = analyzeContext(text);
  const snippet = extractFocusSnippet(text, analysis.lineClasses);
  const severity = clamp(1 - analysis.accuracyScore / 100, 0, 0.9);
  const { code, issues: bugIssues } = injectBugs(snippet, severity, { maxBugs: MAX_BUGS_INJECTED });
  const isDegraded = analysis.accuracyScore < ACCURACY_DEGRADED_THRESHOLD && snippet.trim().length > 0;
  const outputCode = isDegraded
    ? `${code}\n\n// simulated degraded response — context too large/noisy for a reliable answer`
    : code;

  self.postMessage({ id, payload: { ...analysis, snippet, outputCode, bugIssues, isDegraded } });
};
