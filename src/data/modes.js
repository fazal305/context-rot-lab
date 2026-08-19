// Descriptive metadata for the three experiences, used on the Dashboard
// overview cards. Kept separate from the page component per the app's
// data-driven architecture convention.
export const MODES = [
  {
    path: "/context-rot",
    icon: "activity",
    tone: "signal",
    title: "Context Rot Simulator",
    tagline: "SIMULATION",
    description:
      "Feed a split-screen editor increasingly large, noisy context and watch a deterministic, educational model of accuracy degrade in real time.",
  },
  {
    path: "/context-shrink",
    icon: "scissors",
    tone: "info",
    title: "ContextShrink",
    tagline: "UTILITY",
    description:
      "A real developer utility: strip noise from React/JS code, generate a compact state map, estimate tokens, and export a clean context summary.",
  },
  {
    path: "/dementia-code",
    icon: "cpu",
    tone: "accent",
    title: "Dementia Code",
    tagline: "GAME",
    description:
      "A satirical incremental game — generate components, grow the codebase, and watch simulated AI quality spiral as context balloons.",
  },
];
