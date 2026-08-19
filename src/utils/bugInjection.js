// Bug Injection Engine: applies a small, deterministic set of understandable
// transformations to a code snippet, simulating the kind of subtle drift an
// AI assistant might introduce once context gets large and noisy. Given the
// same code + severity, it always produces the same output — the "random"
// pool order is seeded from a hash of the input rather than Math.random().
import { STALE_CODE_FRAGMENTS, IRRELEVANT_CODE_FRAGMENTS } from "../data/bugFragments";
import { clamp } from "./number";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// mulberry32: small, fast, seedable PRNG — good enough for deterministic
// "randomness" in a UI simulation, not for anything security-sensitive.
function mulberry32(seed) {
  let state = seed;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function shuffle(list, rng) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renameDeclaredVariable(lines, rng) {
  const pattern = /^(\s*)(const|let|var)\s+([a-zA-Z_$][\w$]*)(\s*=.*)$/;
  const candidates = [];
  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (match) candidates.push({ index, match });
  });
  if (!candidates.length) return null;

  const { index, match } = pick(candidates, rng);
  const original = match[3];
  const suffix = pick(["Data", "Info", "Result", "Value"], rng);
  if (original.endsWith(suffix)) return null;
  const renamed = `${original}${suffix}`;

  const newLines = [...lines];
  newLines[index] = `${match[1]}${match[2]} ${renamed}${match[4]}`;
  return {
    lines: newLines,
    description: `Renamed declared variable \`${original}\` → \`${renamed}\`, leaving later references to \`${original}\` unchanged.`,
  };
}

function swapFunctionCallPrefix(lines, rng) {
  const prefixes = ["get", "fetch", "load", "read"];
  const pattern = new RegExp(`\\b(${prefixes.join("|")})([A-Z]\\w*)(\\s*\\()`);
  const candidates = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) candidates.push(index);
  });
  if (!candidates.length) return null;

  const index = pick(candidates, rng);
  const match = lines[index].match(pattern);
  const altPrefixes = prefixes.filter((prefix) => prefix !== match[1]);
  const newPrefix = pick(altPrefixes, rng);

  const newLines = [...lines];
  newLines[index] = lines[index].replace(pattern, `${newPrefix}$2$3`);
  return {
    lines: newLines,
    description: `Renamed function call \`${match[1]}${match[2]}()\` → \`${newPrefix}${match[2]}()\`.`,
  };
}

function deepenPropertyAccess(lines, rng) {
  const pattern = /\b([a-zA-Z_$][\w$]*)\.([a-zA-Z_$][\w$]*)\b(?!\s*\()/;
  const candidates = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) candidates.push(index);
  });
  if (!candidates.length) return null;

  const index = pick(candidates, rng);
  const match = lines[index].match(pattern);
  const wrapper = pick(["profile", "data", "details"], rng);
  if (match[2] === wrapper) return null;

  const newLines = [...lines];
  newLines[index] = lines[index].replace(pattern, `${match[1]}.${wrapper}.${match[2]}`);
  return {
    lines: newLines,
    description: `Deepened property access \`${match[1]}.${match[2]}\` → \`${match[1]}.${wrapper}.${match[2]}\`.`,
  };
}

function removeCallArgument(lines, rng) {
  const pattern = /\(([^()]*[a-zA-Z0-9_$][^()]*)\)/;
  const candidates = [];
  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (match && match[1].trim()) candidates.push(index);
  });
  if (!candidates.length) return null;

  const index = pick(candidates, rng);
  const line = lines[index];
  const match = line.match(pattern);
  const args = match[1]
    .split(",")
    .map((arg) => arg.trim())
    .filter(Boolean);
  if (!args.length) return null;
  const removed = args.shift();

  const newLines = [...lines];
  newLines[index] = line.replace(pattern, `(${args.join(", ")})`);
  return { lines: newLines, description: `Removed argument \`${removed}\` from a function call.` };
}

function duplicateRandomLine(lines, rng) {
  const nonEmptyIndexes = lines.map((line, index) => (line.trim() ? index : -1)).filter((index) => index >= 0);
  if (!nonEmptyIndexes.length) return null;

  const index = pick(nonEmptyIndexes, rng);
  const newLines = [...lines.slice(0, index + 1), lines[index], ...lines.slice(index + 1)];
  return { lines: newLines, description: "Duplicated a line of code." };
}

function mutateImportPath(lines, rng) {
  const pattern = /^(import\s+.+\s+from\s+)(["'])([^"']+)\2(;?)$/;
  const candidates = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) candidates.push(index);
  });
  if (!candidates.length) return null;

  const index = pick(candidates, rng);
  const match = lines[index].match(pattern);
  const original = match[3];
  const mutated = original.startsWith(".") ? original.replace(/\/[^/]+$/, "/legacy") : `${original}-legacy`;

  const newLines = [...lines];
  newLines[index] = `${match[1]}${match[2]}${mutated}${match[2]}${match[4]}`;
  return { lines: newLines, description: `Changed import path \`${original}\` → \`${mutated}\`.` };
}

function alterEndpointPath(lines, rng) {
  const pattern = /(["'])(\/[\w-]+(?:\/[\w-]+)*)\1/;
  const candidates = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) candidates.push(index);
  });
  if (!candidates.length) return null;

  const index = pick(candidates, rng);
  const line = lines[index];
  const match = line.match(pattern);
  const original = match[2];
  const mutated = rng() > 0.5 ? `${original}/v2` : original.replace(/\/[^/]+$/, "/legacy");

  const newLines = [...lines];
  newLines[index] = line.replace(pattern, `${match[1]}${mutated}${match[1]}`);
  return { lines: newLines, description: `Altered endpoint path \`${original}\` → \`${mutated}\`.` };
}

function insertForeignFragment(lines, rng, pool, description) {
  const fragment = pick(pool, rng);
  const position = Math.floor(rng() * (lines.length + 1));
  const newLines = [...lines.slice(0, position), fragment, ...lines.slice(position)];
  return { lines: newLines, description };
}

const TRANSFORMATIONS = [
  renameDeclaredVariable,
  swapFunctionCallPrefix,
  deepenPropertyAccess,
  removeCallArgument,
  duplicateRandomLine,
  mutateImportPath,
  alterEndpointPath,
  (lines, rng) =>
    insertForeignFragment(
      lines,
      rng,
      STALE_CODE_FRAGMENTS,
      "Mixed in a stale fragment carried over from earlier context.",
    ),
  (lines, rng) =>
    insertForeignFragment(lines, rng, IRRELEVANT_CODE_FRAGMENTS, "Inserted unrelated code not present in the original context."),
];

// severity is 0–1. Returns { code, issues } where issues is a list of
// human-readable descriptions of each applied transformation, suitable for
// display alongside the output.
export function injectBugs(code, severity, { maxBugs = 6 } = {}) {
  if (!code.trim()) return { code, issues: [] };

  const clampedSeverity = clamp(severity, 0, 1);
  const bugCount = Math.round(clampedSeverity * maxBugs);
  if (bugCount === 0) return { code, issues: [] };

  const seed = hashString(code) + Math.round(clampedSeverity * 1000);
  const rng = mulberry32(seed);
  const order = shuffle(TRANSFORMATIONS, rng);

  let lines = code.split("\n");
  const issues = [];
  for (const transform of order) {
    if (issues.length >= bugCount) break;
    const result = transform(lines, rng);
    if (result) {
      lines = result.lines;
      issues.push(result.description);
    }
  }

  return { code: lines.join("\n"), issues };
}
