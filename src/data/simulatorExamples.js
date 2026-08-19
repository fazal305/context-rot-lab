// Preset context loads for the Context Rot Simulator, spanning the size
// tiers defined in config/simulationConfig.js. Noise blocks are repeated
// programmatically rather than hand-written at full length, so this file
// stays small while still producing realistically large contexts at runtime.

const CLEAN_FUNCTION = `import { getUser } from "./api/userService";

export function getUsername() {
  const user = getUser();
  return user.name;
}`;

const LOG_NOISE_BLOCK = `[INFO] 2024-01-01T12:00:00Z Handling request GET /api/users/42
[DEBUG] cache miss for key user:42
[DEBUG] querying database via connection pool #3
[INFO] 2024-01-01T12:00:01Z response sent in 42ms`;

const CONVERSATION_NOISE_BLOCK = `--- earlier in this conversation ---
User: can you also handle the case where the user is not found?
Assistant: Sure, I added a null check and a fallback return value below.
User: looks good, but can you rename the helper for clarity?
Assistant: Done — renamed and re-exported from the same module.`;

function repeatBlock(block, times) {
  return Array.from({ length: times }, () => block).join("\n");
}

export const SIMULATOR_EXAMPLES = [
  {
    id: "clean",
    label: "Clean & Minimal",
    tierHint: "low",
    content: CLEAN_FUNCTION,
  },
  {
    id: "with-logs",
    label: "With Debug Logs",
    tierHint: "medium",
    content: `${CLEAN_FUNCTION}\n\n${repeatBlock(LOG_NOISE_BLOCK, 55)}`,
  },
  {
    id: "sprawling",
    label: "Sprawling AI Session",
    tierHint: "extreme",
    content: `${CLEAN_FUNCTION}\n\n${repeatBlock(LOG_NOISE_BLOCK, 220)}\n\n${repeatBlock(CONVERSATION_NOISE_BLOCK, 70)}`,
  },
];

export const DEFAULT_SIMULATOR_EXAMPLE = SIMULATOR_EXAMPLES[0];
