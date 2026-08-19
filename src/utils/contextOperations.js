// Pure text transformations behind the Context Rot Simulator's control
// buttons. Each takes the current context string and returns a new one.
import { LOG_LINE_PATTERN } from "./contextRot";

export function pruneLogs(text) {
  return text
    .split("\n")
    .filter((line) => !LOG_LINE_PATTERN.test(line))
    .join("\n");
}

export function removeDuplicateLines(text) {
  const seen = new Set();
  return text
    .split("\n")
    .filter((line) => {
      const key = line.trim();
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join("\n");
}

export function summarizeContext(text) {
  const lines = text.split("\n");
  if (lines.length <= 40) return text;
  const head = lines.slice(0, 20);
  const tail = lines.slice(-10);
  const collapsedCount = lines.length - head.length - tail.length;
  return [...head, `// … summarized ${collapsedCount} lines …`, ...tail].join("\n");
}

export function compressContext(text) {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .filter((line) => !/^\s*(\/\/|#)/.test(line));

  const collapsed = lines.filter((line, index) => !(line.trim() === "" && lines[index - 1]?.trim() === ""));
  return collapsed.join("\n").trim();
}

export function startNewThread(text) {
  const lines = text.split("\n");
  const signalIndexes = [];
  lines.forEach((line, index) => {
    if (line.trim() && !LOG_LINE_PATTERN.test(line) && !/^\s*(\/\/|#)/.test(line)) {
      signalIndexes.push(index);
    }
  });
  const keep = new Set(signalIndexes.slice(-12));
  return lines.filter((_, index) => keep.has(index)).join("\n");
}

export function applyContextOperation(operationId, text) {
  switch (operationId) {
    case "prune-logs":
      return pruneLogs(text);
    case "remove-duplicates":
      return removeDuplicateLines(text);
    case "summarize":
      return summarizeContext(text);
    case "compress":
      return compressContext(text);
    case "new-thread":
      return startNewThread(text);
    default:
      return text;
  }
}
