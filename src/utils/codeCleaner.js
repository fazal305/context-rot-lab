// Line/regex-based code cleaning heuristics — deliberately NOT a full
// JS/JSX parser (that would need a bundled parser like @babel/parser, which
// this app avoids per its "no unnecessary dependencies" rule). Each
// function is conservative about what it removes and documents its known
// limitations. The UI always shows Original vs Cleaned side by side so the
// result can be visually verified before use.

// Strips // and /* */ comments while treating string and template literal
// contents as opaque, so a URL like "https://example.com" inside a string
// is never mistaken for a comment. Does not special-case regex literals —
// a comment-like sequence inside a /regex/ could, in rare cases, be left
// un-stripped (the safe failure direction: under-stripping, not corrupting
// code).
export function removeComments(code) {
  let result = "";
  let i = 0;
  const len = code.length;

  while (i < len) {
    const char = code[i];
    const two = code.slice(i, i + 2);

    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      let j = i + 1;
      while (j < len) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      result += code.slice(i, j);
      i = j;
      continue;
    }

    if (two === "//") {
      let j = i + 2;
      while (j < len && code[j] !== "\n") j += 1;
      i = j;
      continue;
    }

    if (two === "/*") {
      let j = i + 2;
      while (j < len && code.slice(j, j + 2) !== "*/") j += 1;
      i = j + 2;
      continue;
    }

    result += char;
    i += 1;
  }

  return result;
}

// Only removes lines that are ENTIRELY a console statement, so a
// console.log embedded inside a larger expression is left alone.
const CONSOLE_STATEMENT_PATTERN = /^\s*console\.(log|debug|info|warn|trace)\([^;]*\);?\s*$/;

export function removeConsoleLogs(code) {
  return code
    .split("\n")
    .filter((line) => !CONSOLE_STATEMENT_PATTERN.test(line))
    .join("\n");
}

export function collapseBlankLines(code) {
  const collapsed = code
    .split("\n")
    .filter((line, index, lines) => !(line.trim() === "" && lines[index - 1]?.trim() === ""));
  return collapsed.join("\n").replace(/^\n+/, "").replace(/\n+$/, "\n");
}

const IMPORT_LINE_PATTERN = /^import\s+(.+?)\s+from\s+["']([^"']+)["'];?\s*$/;
const SIDE_EFFECT_IMPORT_PATTERN = /^import\s+["']([^"']+)["'];?\s*$/;
const STYLESHEET_PATTERN = /\.(css|scss|sass|less)$/;

function extractImportedNames(clause) {
  const names = [];
  const namespaceMatch = clause.match(/\*\s+as\s+(\w+)/);
  if (namespaceMatch) names.push(namespaceMatch[1]);

  const namedMatch = clause.match(/\{([^}]*)\}/);
  if (namedMatch) {
    namedMatch[1]
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const asMatch = part.match(/\bas\s+(\w+)$/);
        names.push(asMatch ? asMatch[1] : part.split(/\s+/)[0]);
      });
  }

  const defaultMatch = clause.replace(/\{[^}]*\}/, "").match(/^\s*(\w+)/);
  if (defaultMatch) names.push(defaultMatch[1]);

  return names.filter(Boolean);
}

// Drops an import line only if none of the names it introduces appear
// anywhere else in the file, or if it's a side-effect stylesheet import
// (a common leftover). Side-effect imports of anything else (polyfills,
// global setup) are left alone, since removing them could change behavior.
export function removeUnusedImports(code) {
  const lines = code.split("\n");
  return lines
    .filter((line, index) => {
      const sideEffect = line.match(SIDE_EFFECT_IMPORT_PATTERN);
      if (sideEffect) return !STYLESHEET_PATTERN.test(sideEffect[1]);

      const match = line.match(IMPORT_LINE_PATTERN);
      if (!match) return true;

      const names = extractImportedNames(match[1]);
      if (!names.length) return true;

      const restOfCode = lines.filter((_, i) => i !== index).join("\n");
      return names.some((name) => new RegExp(`\\b${name}\\b`).test(restOfCode));
    })
    .join("\n");
}

// Collapses runs of 2+ spaces to one, only after each line's leading
// indentation, and trims trailing whitespace. Does not touch tabs used for
// indentation, and can't distinguish intentional spacing inside a string
// literal from accidental whitespace — reviewed via the Original/Cleaned
// diff rather than guaranteed safe on every input.
export function collapseDuplicateWhitespace(code) {
  return code
    .split("\n")
    .map((line) => {
      const match = line.match(/^(\s*)(.*)$/s);
      const leading = match[1];
      const rest = match[2].replace(/ {2,}/g, " ").trimEnd();
      return `${leading}${rest}`;
    })
    .join("\n");
}

// Applies enabled options in a safe order: comments first (so later steps
// don't treat comment text as code), then console logs, then unused-import
// detection (run after comments are gone so a comment mentioning an
// identifier doesn't count as a "use"), then whitespace, then blank lines
// as a final cleanup pass.
export function cleanCode(code, options) {
  let result = code;
  if (options.removeComments) result = removeComments(result);
  if (options.removeConsoleLogs) result = removeConsoleLogs(result);
  if (options.removeUnusedImports) result = removeUnusedImports(result);
  if (options.collapseWhitespace) result = collapseDuplicateWhitespace(result);
  if (options.collapseBlankLines) result = collapseBlankLines(result);
  return result;
}
