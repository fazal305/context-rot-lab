// Metadata for the six Context Rot Simulator control buttons. Kept
// data-driven so the component only handles rendering + dispatch.
export const CONTEXT_OPERATIONS = [
  {
    id: "prune-logs",
    label: "Prune Logs",
    icon: "trash",
    description: "Remove log lines, timestamps, and stack-trace-style noise.",
  },
  {
    id: "remove-duplicates",
    label: "Remove Duplicates",
    icon: "copy",
    description: "Collapse lines that repeat elsewhere in the context.",
  },
  {
    id: "summarize",
    label: "Summarize Context",
    icon: "scissors",
    description: "Collapse the middle of a long context into a summary marker.",
  },
  {
    id: "compress",
    label: "Compress Context",
    icon: "download",
    description: "Strip comments, blank lines, and redundant whitespace.",
  },
  {
    id: "new-thread",
    label: "Start New Thread",
    icon: "play",
    description: "Keep only the most recent signal content, like a fresh conversation.",
  },
  {
    id: "reset",
    label: "Reset Simulation",
    icon: "bolt",
    description: "Restore the original example context.",
  },
];
