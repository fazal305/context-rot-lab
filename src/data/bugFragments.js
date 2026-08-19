// Canned snippets the Bug Injection Engine can splice into simulated output
// to imitate stale or irrelevant content bleeding in from a bloated context.
export const STALE_CODE_FRAGMENTS = [
  "// leftover from a previous revision",
  "const cachedUser = window.__legacyUserCache;",
  "if (typeof legacyMode !== 'undefined') { return legacyMode; }",
  "// TODO: remove after the auth migration ships",
  "// carried over from an earlier turn in this conversation",
];

export const IRRELEVANT_CODE_FRAGMENTS = [
  "function formatCurrency(value) { return `$${value.toFixed(2)}`; }",
  "const PALETTE = ['#111111', '#222222', '#333333'];",
  "export const noop = () => {};",
  "console.warn('This code path is unrelated to the current task.');",
];
