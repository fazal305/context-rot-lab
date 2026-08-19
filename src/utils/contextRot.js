// Deterministic-ish Context Rot model:
//   contextSize -> noiseScore -> signalRatio -> accuracyScore -> outputTransformation
//
// This is an educational simulation of the idea that more, noisier context
// can crowd out signal and degrade an AI assistant's effective output — it
// is not a benchmark or prediction of any specific real model's behavior.
import {
  CONTEXT_TIERS,
  MAX_CONTEXT_TOKENS,
  NOISE_ACCURACY_PENALTY,
  CONFIDENCE_OVERCONFIDENCE_BIAS,
  ACCURACY_FLOOR,
  NOISE_WARNING_THRESHOLD,
  UTILIZATION_WARNING_THRESHOLD,
  UNUSED_WARNING_THRESHOLD,
  DUPLICATE_LINE_WARNING_COUNT,
} from "../config/simulationConfig";
import { getTextStats } from "./tokenEstimator";
import { clamp } from "./number";

export const LOG_LINE_PATTERN =
  /^\s*(\[(INFO|DEBUG|WARN|ERROR|TRACE)\]|\d{4}-\d{2}-\d{2}T|console\.(log|debug|info)\(|at\s+\S+\s+\()/i;
const COMMENT_PATTERN = /^\s*(\/\/|#|\*)/;

// Classifies each line of `text` as "signal" (real code), "noise" (logs,
// comments, duplicate content), or "unused" (blank/whitespace padding).
export function classifyLines(text) {
  const lines = text.split("\n");
  const seen = new Map();
  return lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "unused";
    const count = seen.get(trimmed) ?? 0;
    seen.set(trimmed, count + 1);
    if (count > 0 && trimmed.length > 3) return "noise";
    if (LOG_LINE_PATTERN.test(line)) return "noise";
    if (COMMENT_PATTERN.test(line)) return "noise";
    return "signal";
  });
}

export function getContextTier(tokens) {
  return CONTEXT_TIERS.find((tier) => tokens <= tier.maxTokens) ?? CONTEXT_TIERS[CONTEXT_TIERS.length - 1];
}

function countDuplicateLines(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const counts = new Map();
  lines.forEach((line) => counts.set(line, (counts.get(line) ?? 0) + 1));
  let duplicates = 0;
  counts.forEach((count) => {
    if (count > 1) duplicates += count - 1;
  });
  return duplicates;
}

// Returns the last `maxLines` signal lines from `text`, in original order —
// used as the code the simulated output is derived from, rather than
// dumping the entire (possibly huge) noisy context back out.
export function extractFocusSnippet(text, lineClasses, maxLines = 14) {
  const lines = text.split("\n");
  const signalIndexes = [];
  lineClasses.forEach((cls, index) => {
    if (cls === "signal") signalIndexes.push(index);
  });
  if (!signalIndexes.length) return "";
  return signalIndexes
    .slice(-maxLines)
    .map((index) => lines[index])
    .join("\n");
}

export function analyzeContext(text) {
  const stats = getTextStats(text);
  const lineClasses = classifyLines(text);
  const totalLines = lineClasses.length || 1;
  const noiseLines = lineClasses.filter((cls) => cls === "noise").length;
  const unusedLines = lineClasses.filter((cls) => cls === "unused").length;
  const signalLines = totalLines - noiseLines - unusedLines;

  const noiseScore = clamp(noiseLines / totalLines, 0, 1);
  const signalRatio = clamp(signalLines / totalLines, 0, 1);

  const tier = getContextTier(stats.tokens);
  const accuracyScore = clamp(
    Math.round(tier.baseAccuracy - noiseScore * NOISE_ACCURACY_PENALTY),
    ACCURACY_FLOOR,
    99,
  );
  const confidence = clamp(Math.round(accuracyScore + noiseScore * CONFIDENCE_OVERCONFIDENCE_BIAS), 0, 99);
  const utilization = clamp(stats.tokens / MAX_CONTEXT_TOKENS, 0, 1);

  const duplicateCount = countDuplicateLines(text);
  const diagnosticIssues = [];
  if (noiseScore > NOISE_WARNING_THRESHOLD) {
    diagnosticIssues.push(`High noise ratio detected (${Math.round(noiseScore * 100)}% of lines).`);
  }
  if (utilization > UTILIZATION_WARNING_THRESHOLD) {
    diagnosticIssues.push(`Context window nearly full (${Math.round(utilization * 100)}% used).`);
  }
  if (unusedLines / totalLines > UNUSED_WARNING_THRESHOLD) {
    diagnosticIssues.push("Large amount of blank/whitespace padding.");
  }
  if (duplicateCount > DUPLICATE_LINE_WARNING_COUNT) {
    diagnosticIssues.push(`${duplicateCount} duplicate lines detected.`);
  }

  return {
    stats,
    lineClasses,
    tier,
    noiseScore,
    signalRatio,
    accuracyScore,
    confidence,
    utilization,
    lineBreakdown: { signal: signalLines, noise: noiseLines, unused: unusedLines, total: totalLines },
    diagnosticIssues,
  };
}
