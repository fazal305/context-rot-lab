// Centralized tuning values for the Context Rot Simulator. Adjust these to
// change simulation behavior without touching component or utility code.

// Size of the simulated context window, in estimated tokens.
export const MAX_CONTEXT_TOKENS = 16000;

// Context size tiers, ordered ascending by maxTokens. accuracyScore starts
// at a tier's baseAccuracy and is then reduced by noise (see
// NOISE_ACCURACY_PENALTY). tone maps to a design-token color.
export const CONTEXT_TIERS = [
  { id: "low", label: "Low", maxTokens: 2000, baseAccuracy: 97, tone: "signal" },
  { id: "medium", label: "Moderate", maxTokens: 6000, baseAccuracy: 83, tone: "info" },
  { id: "high", label: "High", maxTokens: 12000, baseAccuracy: 62, tone: "warning" },
  { id: "extreme", label: "Critical", maxTokens: Infinity, baseAccuracy: 35, tone: "noise" },
];

// Maximum points subtracted from a tier's baseAccuracy at noiseScore === 1.
export const NOISE_ACCURACY_PENALTY = 20;

// Simulated models "sound" more confident than they are accurate, scaled by
// noise — this is a deliberate illustrative bias, not a claim about real
// models.
export const CONFIDENCE_OVERCONFIDENCE_BIAS = 15;

export const ACCURACY_FLOOR = 12;

// Below this accuracy, the simulated output is treated as too unreliable to
// present as normal code and gets an explicit degraded-output marker.
export const ACCURACY_DEGRADED_THRESHOLD = 40;

// Bug Injection Engine: number of transformations applied scales with
// simulated severity, capped at this count regardless of how low accuracy gets.
export const MAX_BUGS_INJECTED = 6;

// How long input must be idle before the (more expensive) analysis re-runs.
export const ANALYSIS_DEBOUNCE_MS = 300;

// Diagnostic issue thresholds.
export const NOISE_WARNING_THRESHOLD = 0.35;
export const UTILIZATION_WARNING_THRESHOLD = 0.75;
export const UNUSED_WARNING_THRESHOLD = 0.2;
export const DUPLICATE_LINE_WARNING_COUNT = 2;
