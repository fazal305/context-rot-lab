// Regex-based extraction of a React component's shape (props/state/hooks/
// effects), for the State Map Generator. Like codeCleaner.js, this is a
// heuristic over source text rather than a full parser — it covers common
// patterns (hooks called directly at the top level of a function component)
// and may miss unusual code shapes.

const BUILTIN_HOOKS = new Set([
  "useState",
  "useEffect",
  "useLayoutEffect",
  "useMemo",
  "useCallback",
  "useRef",
  "useReducer",
  "useContext",
  "useImperativeHandle",
  "useDebugValue",
  "useId",
  "useTransition",
  "useDeferredValue",
  "useSyncExternalStore",
  "useInsertionEffect",
]);

function inferType(initExpression) {
  const trimmed = initExpression.trim();
  if (!trimmed) return "unknown";
  if (/^(true|false)$/.test(trimmed)) return "boolean";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return "number";
  if (/^["'`]/.test(trimmed)) return "string";
  if (trimmed.startsWith("[")) return "Array";
  if (trimmed.startsWith("{")) return "object";
  if (trimmed === "null") return "null";
  if (/^new Map\b/.test(trimmed)) return "Map";
  if (/^new Set\b/.test(trimmed)) return "Set";
  return "unknown";
}

export function extractComponentName(code) {
  const patterns = [
    /export\s+default\s+function\s+([A-Z]\w*)/,
    /function\s+([A-Z]\w*)\s*\(/,
    /const\s+([A-Z]\w*)\s*=\s*\(?.*=>/,
  ];
  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) return match[1];
  }
  return "Component";
}

export function extractProps(code) {
  const patterns = [/function\s+[A-Z]\w*\s*\(\s*\{([^}]*)\}/, /const\s+[A-Z]\w*\s*=\s*\(\s*\{([^}]*)\}/];
  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) {
      return match[1]
        .split(",")
        .map((part) => part.split("=")[0].split(":")[0].trim())
        .filter(Boolean);
    }
  }
  return [];
}

export function extractState(code) {
  const pattern = /const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState(?:<[^>]*>)?\(([^;]*)\)/g;
  const results = [];
  let match = pattern.exec(code);
  while (match) {
    results.push({ name: match[1], setter: match[2], type: inferType(match[3]) });
    match = pattern.exec(code);
  }
  return results;
}

export function extractAllHooks(code) {
  const pattern = /\buse[A-Z]\w*\s*(?=\()/g;
  const found = [];
  const seen = new Set();
  let match = pattern.exec(code);
  while (match) {
    const name = match[0].trim();
    if (!seen.has(name)) {
      seen.add(name);
      found.push(name);
    }
    match = pattern.exec(code);
  }
  return found;
}

export function extractCustomHooks(code) {
  return extractAllHooks(code).filter((name) => !BUILTIN_HOOKS.has(name));
}

export function extractEffects(code) {
  const pattern = /(useEffect|useLayoutEffect)\s*\(/g;
  const results = [];
  let match = pattern.exec(code);
  while (match) {
    const window = code.slice(match.index, match.index + 600);
    const depsMatch = window.match(/\},\s*(\[[^\]]*\])\s*\)/);
    results.push({ hook: match[1], deps: depsMatch ? depsMatch[1] : null });
    match = pattern.exec(code);
  }
  return results;
}

export function generateStateMap(code) {
  return {
    componentName: extractComponentName(code),
    props: extractProps(code),
    state: extractState(code),
    customHooks: extractCustomHooks(code),
    allHooks: extractAllHooks(code),
    effects: extractEffects(code),
  };
}

// Compact, copy-paste-ready summary for pasting into an AI conversation.
export function formatStateMapSummary(stateMap) {
  const lines = [`Component: ${stateMap.componentName}`, "", "Props:"];
  lines.push(...(stateMap.props.length ? stateMap.props.map((prop) => `- ${prop}`) : ["- (none detected)"]));

  lines.push("", "State:");
  lines.push(
    ...(stateMap.state.length
      ? stateMap.state.map((item) => `- ${item.name}: ${item.type}`)
      : ["- (none detected)"]),
  );

  lines.push("", "Hooks:");
  lines.push(...(stateMap.allHooks.length ? stateMap.allHooks.map((hook) => `- ${hook}`) : ["- (none detected)"]));

  return lines.join("\n");
}
