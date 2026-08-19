// Centralized tuning values and option metadata for ContextShrink.

export const DEFAULT_CLEAN_OPTIONS = {
  removeComments: true,
  removeConsoleLogs: true,
  collapseBlankLines: true,
  removeUnusedImports: false,
  collapseWhitespace: true,
};

// Drives both the checkbox list UI and cleanCode()'s option keys.
export const CLEAN_OPTION_DEFINITIONS = [
  {
    id: "removeComments",
    label: "Remove comments",
    description: "Strips // and /* */ comments, skipping over string and template literal contents.",
  },
  {
    id: "removeConsoleLogs",
    label: "Remove console statements",
    description: "Removes standalone console.log/debug/info/warn/trace lines.",
  },
  {
    id: "collapseBlankLines",
    label: "Collapse blank lines",
    description: "Reduces runs of blank lines to a single blank line.",
  },
  {
    id: "removeUnusedImports",
    label: "Remove unused imports",
    description: "Drops imported names that never appear elsewhere in the code. Review the diff before trusting this on complex files.",
  },
  {
    id: "collapseWhitespace",
    label: "Collapse duplicate whitespace",
    description: "Collapses runs of spaces outside of leading indentation and trims trailing whitespace.",
  },
];

export const ANALYSIS_DEBOUNCE_MS = 250;
