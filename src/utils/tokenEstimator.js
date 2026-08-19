// Token estimation heuristic — NOT a real tokenizer (e.g. tiktoken/BPE).
// Blends two common rules of thumb for English/code text:
//   - ~4 characters per token
//   - ~0.75 tokens per whitespace-delimited word
// and averages them, which tracks real BPE tokenizers reasonably well for
// typical source code without requiring a bundled vocabulary/model. Treat
// the result as an order-of-magnitude estimate, not an exact count.
export function estimateTokens(text) {
  if (!text) return 0;
  const charBased = text.length / 4;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const wordBased = wordCount / 0.75;
  return Math.max(0, Math.round((charBased + wordBased) / 2));
}

export function getTextStats(text) {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  const tokens = estimateTokens(text);
  return { characters, words, lines, tokens };
}

const TOKEN_HEALTH_LEVELS = [
  { level: "low", label: "Low", tone: "signal", maxRatio: 0.25 },
  { level: "moderate", label: "Moderate", tone: "info", maxRatio: 0.5 },
  { level: "high", label: "High", tone: "warning", maxRatio: 0.8 },
  { level: "critical", label: "Critical", tone: "noise", maxRatio: Infinity },
];

// Classifies token usage relative to a context window into LOW/MODERATE/
// HIGH/CRITICAL bands, for the Token Health Indicator.
export function getTokenHealth(tokens, maxTokens) {
  const ratio = maxTokens > 0 ? tokens / maxTokens : 0;
  return TOKEN_HEALTH_LEVELS.find((entry) => ratio <= entry.maxRatio) ?? TOKEN_HEALTH_LEVELS[TOKEN_HEALTH_LEVELS.length - 1];
}

export const TOKEN_HEALTH_LEVEL_ORDER = TOKEN_HEALTH_LEVELS.map((entry) => entry.level);
