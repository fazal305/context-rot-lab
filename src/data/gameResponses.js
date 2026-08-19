// Component name parts and canned AI response lines for Dementia Code,
// keyed by accuracy tier so the tone visibly decays as context grows.
export const COMPONENT_NAME_PARTS = {
  simple: ["Button", "Card", "Modal", "Input", "Avatar", "Badge", "Tooltip", "Toggle"],
  compoundPrefixes: ["Smart", "Managed", "Dynamic", "Abstract", "Unified", "Global", "Legacy", "Enterprise"],
  compoundMiddles: ["Button", "Widget", "Component", "Element", "Handler", "Provider"],
  compoundSuffixes: ["Manager", "Factory", "Service", "Controller", "Orchestrator", "Wrapper", "Adapter"],
};

export const AI_RESPONSES = {
  pristine: ["Everything should work now.", "Clean implementation, fully tested in my head.", "Shipped exactly what you asked for."],
  solid: [
    "Looks good — added a small optimization while I was in there.",
    "Done. Let me know if the edge cases need more coverage.",
  ],
  shaky: [
    "I apologize for the confusion. I have rewritten the entire component.",
    "I noticed the previous implementation had a minor issue, so I replaced 47 files.",
    "This should be more robust now.",
  ],
  crumbling: [
    "Actually, let's refactor the entire architecture.",
    "I have introduced a new dependency to solve a problem that did not exist.",
    "I apologize for the confusion. I have rewritten the entire component. Again.",
  ],
  meltdown: [
    "I apologize for the confusion. I have rewritten the entire component.",
    "To be safe, I wrapped everything in three additional abstraction layers.",
    "I'm not fully sure what this does anymore, but the tests pass (there are no tests).",
    "Let's take a step back and reconsider the entire codebase.",
  ],
};
