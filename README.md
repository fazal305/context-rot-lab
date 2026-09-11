# 🧠 Context Rot Lab

An interactive playground exploring how large, noisy AI context can degrade
output quality — paired with a real developer utility for trimming context
before it goes to an AI assistant, and a satirical incremental game about
the same idea spiraling out of control.

```
MORE CONTEXT → MORE NOISE → LESS SIGNAL → LOWER SIMULATED ACCURACY
```

> **This is an educational simulation, not a benchmark.** Nothing in this
> app measures, models, or makes claims about the behavior of any specific
> real AI model. The degradation curves, "accuracy" scores, and bug
> injection are illustrative — designed to make the *idea* of context rot
> tangible, not to reproduce any particular system's actual behavior.

---

## Live Demo

**[fazal305.github.io/context-rot-lab](https://fazal305.github.io/context-rot-lab/)**

## What's in here

The app combines three related experiences behind one shared design system:

| Mode | Route | What it is |
|---|---|---|
| **Context Rot Simulator** | `/context-rot` | Paste or load increasingly large/noisy context into a split-screen editor and watch a deterministic, illustrative accuracy model degrade in real time — then use six context-management operations (Prune Logs, Remove Duplicates, Summarize, Compress, Start New Thread, Reset) to bring it back. |
| **ContextShrink** | `/context-shrink` | A real utility: paste a React/JS component and strip comments, console logs, blank-line runs, duplicate whitespace, and (optionally) unused imports. Also extracts a compact "state map" (props/state/hooks/effects) formatted for pasting into an AI conversation, plus live token estimation and a token-health indicator. |
| **Dementia Code** | `/dementia-code` | A fictional, satirical incremental game. Click "Generate Component" repeatedly; watch Lines of Code, Technical Debt, and Context balloon while AI Accuracy and Build Health decay, generated component names grow increasingly absurd, and canned AI responses get progressively more unhinged. Spend earned Story Points on upgrades that slow the decay. |

Dashboard (`/`) and Settings (`/settings`) round out the app shell.

---

## Tech stack

- **React 19** + **Vite 8** (JavaScript, not TypeScript)
- **React Router 7** for client-side routing, with the three heavy tool
  pages code-split via `React.lazy`
- **Bootstrap 5** for base resets/grid utilities (all visual design comes
  from a custom CSS-custom-property token system layered on top — see
  below)
- **jQuery** is a listed dependency per the original brief but the app
  doesn't use it anywhere; every interaction is handled through React.
  Native browser APIs (`Blob`, `FileReader`, Clipboard API, Web Workers)
  cover everything else, deliberately avoiding extra runtime dependencies.
- **Web Workers** (native, via Vite's `new Worker(new URL(...))` support)
  for the two expensive analysis pipelines
- **localStorage** for all persistence (no backend, no accounts, nothing
  ever leaves the browser)

---

## Running it locally

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint
```

---

## Architecture

```
src/
├── components/
│   ├── layout/        # AppShell, TopBar, Sidebar, ThemeToggle
│   ├── common/         # Icon, StatChip, StatusIndicator, MeterBar,
│   │                    # TokenHealthBar, CopyButton, FileImportButton,
│   │                    # PageHeader, ModeCard, Loader, RouteLoader
│   ├── simulator/      # Context Rot Simulator's panels
│   ├── context-shrink/ # ContextShrink's panels
│   └── code-game/      # Dementia Code's panels
├── pages/              # One component per route
├── hooks/              # Stateful logic, one hook per page/concern
├── workers/            # The two Web Workers
├── services/           # storageService (the only localStorage gateway)
├── utils/              # Pure functions — the actual "engine" code
├── data/                # Static content: examples, upgrade defs, fragments
├── config/              # Tunable constants, one file per feature area
└── styles/              # tokens.css (design tokens) + patterns.css (shared
                          # structural classes)
```

**Why this split:** utils/ hold pure, framework-free functions (testable in
isolation, and directly reusable inside Web Workers, which can't touch the
DOM or React). hooks/ own React state and wire it to those pure functions.
components/ are thin — they render props and call callbacks, with no
business logic of their own. config/ and data/ exist so tuning the app
(accuracy curves, upgrade costs, example content) never requires touching
component code.

### Design system

Every color, spacing value, font size, radius, shadow, and transition is a
CSS custom property defined once in `src/styles/tokens.css` — dark palette
on `:root`, with a `[data-theme="light"]` override block. Components never
hard-code a color or pixel value. `src/styles/patterns.css` holds shared
structural classes (`.panel`, `.code-block`, `.code-editor`, `.split-grid`,
`.action-button`, …) reused across all three tool pages.

**A specific gotcha this caught:** the three tool pages are separately
lazy-loaded chunks. Early on, shared-looking class names were defined
inside a *page-specific* component stylesheet — which works by accident on
that one page (its CSS chunk is always loaded together with its JS) but
silently breaks the moment another lazy chunk tries to reuse the same class
name, because that chunk's CSS never loads. Anything meant to be reused
across pages now lives in `patterns.css`, which loads globally via
`index.css`.

### Theme system

`useTheme` supports `dark` / `light` / `system`, persisted to localStorage.
"system" is resolved against `prefers-color-scheme` and stays live via a
`matchMedia` change listener. A small inline script in `index.html` applies
the stored preference to `<html data-theme>` **before React mounts**, so
there's no flash of the wrong theme on load.

---

## Context Rot simulation methodology

The pipeline (`src/utils/contextRot.js`) is deliberately simple and
explainable rather than a black box:

```
text
  → classify each line: signal / noise / unused
  → noiseScore = noise lines / total lines
  → tier = lookup by estimated token count (Low/Moderate/High/Critical)
  → accuracyScore = tier.baseAccuracy − noiseScore × penalty
  → confidence = accuracyScore + noiseScore × overconfidence bias
      (a deliberate illustrative touch: the simulated "model" sounds more
      confident than it is accurate as noise increases)
```

Line classification is regex-based: log-format lines (`[INFO]`, ISO
timestamps, `console.log(`, stack-trace-style `at ... (`), comment lines,
and duplicate lines all count as noise; everything else with content
counts as signal.

**Bug Injection Engine** (`src/utils/bugInjection.js`): once accuracy is
known, a severity value drives how many of nine understandable
transformations get applied to a snippet of the input's actual signal
lines — renaming a declared variable but leaving its usages stale, renaming
a function call (`getUser()` → `fetchUser()`), deepening a property access
(`user.name` → `user.profile.name`), dropping a call argument, duplicating
a line, mutating an import path, altering an endpoint string, or splicing
in a stale/irrelevant fragment. Selection is **seeded from a hash of the
input text**, not `Math.random()` — the same context always produces the
same simulated bugs, which is what "deterministic-ish" means here: legible
and reproducible, not literally random-looking noise.

The six context operations (Prune Logs, Remove Duplicates, Summarize,
Compress, Start New Thread, Reset) are plain text transforms
(`src/utils/contextOperations.js`) that visibly move the same tokens/noise/
accuracy numbers back in the other direction.

---

## ContextShrink methodology

`src/utils/codeCleaner.js` implements a **string-scanner**, not a full
JS/JSX parser (adding a parser dependency like `@babel/parser` just for
this would violate the app's "no unnecessary dependencies" rule). The
comment stripper specifically tracks string/template-literal state so it
never mistakes a URL like `"https://example.com"` inside a string for a
comment. Every cleaning option documents its own known limitations in
comments next to the code, and the UI always shows Original vs. Cleaned
side by side so a result can be visually checked rather than trusted
blindly — the unused-import remover, for instance, only ever drops a whole
`import` line, never a partial specifier, and never touches a side-effect
import unless it's a stylesheet.

`src/utils/stateMapGenerator.js` extracts a component's shape via targeted
regexes: `useState` calls (with a best-effort type inference from the
initial value), destructured props, every `use*` call found (split into
built-in vs. custom hooks), and `useEffect`/`useLayoutEffect` calls with
their dependency arrays. The result formats into a compact block meant to
be pasted straight into an AI conversation as pre-digested context.

---

## Token estimation

There is no bundled tokenizer. `src/utils/tokenEstimator.js` blends two
common rules of thumb — roughly 4 characters/token and roughly 0.75
tokens/word — and averages them. This is explicitly documented as a
heuristic in the code and the UI (labeled "Tokens (est.)"), not presented
as an exact count from a real tokenizer.

---

## Dementia Code mechanics

A `useReducer`-driven game loop (`src/hooks/useDementiaGame.js`) built on
the same pure-function philosophy as the simulator: `src/utils/gameEngine.js`
holds the accuracy curve, tier lookup, name/response generation, and
upgrade-effect math as framework-free functions.

Each "Generate Component" click reuses the simulator's own stale/irrelevant
snippet pools (`src/data/bugFragments.js`) to build up an accumulating
"context" blob — a deliberate callback tying the game's satire directly to
the simulator's core mechanic. That blob is capped at 220 entries for
performance; resource counters (Lines of Code, Technical Debt, Story
Points) keep accumulating unbounded as plain numbers, which is cheap
regardless of how long a session runs.

Six upgrades (Token Pruner, Write `.cursorrules`, Automated Context
Cleaner, Human QA Tester, Better AI Model, Rubber Duck) compose
multiplicative/additive effects that slow the decay curves. All of it is
tuned through `src/config/gameConfig.js` and `src/data/upgrades.js` — no
magic numbers live in components.

**Pacing note:** an early build of Build Health decayed roughly 5× too
fast relative to every other resource, crashing to 0% while Accuracy was
still "Solid." Caught during manual testing and retuned
(`BASE_BUILD_HEALTH_DECAY` and `DEBT_HEALTH_DECAY_FACTOR` in
`gameConfig.js`) so all resources now decline together.

---

## Web Worker architecture

Two workers (`src/workers/`) run the expensive parts of the Simulator and
ContextShrink pipelines off the main thread:

- `contextAnalyzer.worker.js` — line classification, accuracy scoring, bug
  injection
- `codeProcessor.worker.js` — code cleaning + state-map extraction

Both import the **exact same pure utils** the main thread would otherwise
call directly — there's no duplicated logic between a "worker path" and a
"fallback path." A shared hook, `useWorkerTask` (`src/hooks/useWorkerTask.js`),
manages each worker's lifecycle (create on mount, `terminate()` on unmount)
and tags every request with an incrementing ID so a slow, superseded
response can never overwrite a newer one on screen.

Cheap operations — character/word/line/token counts shown live while
typing — deliberately stay on the main thread; only the genuinely
expensive regex-heavy passes are debounced (via `useDebouncedValue`) and
then handed to a worker.

---

## Persistence

Everything routes through one gateway, `src/services/storageService.js` —
namespaced keys, JSON encoding, and silent failure if storage is
unavailable (private browsing, quota exceeded), so persistence is
best-effort rather than a hard dependency of the app working at all.

Persisted: theme preference, sidebar collapsed state, the Simulator's
current context text, ContextShrink's last-pasted code and cleaning
options, and all Dementia Code progress (resources, upgrades, log).
Settings → **Clear Local Data** wipes every key the app has written and
reloads, so every hook re-initializes from a clean slate.

---

## Performance decisions

- Expensive text analysis is **debounced** (250–300ms) and then run in a
  **Web Worker**, not on every keystroke on the main thread.
- Route-level code splitting (`React.lazy`) means visiting the Dashboard
  never downloads the Simulator's, ContextShrink's, or Dementia Code's
  bundle.
- A loader only ever appears once an operation has been in flight for
  >200ms (`useDelayedLoading`) — fast operations never flash a spinner.
- `useMemo`/`useCallback` are used where they prevent real recomputation
  (derived analysis results, stable callback identities passed to memoized
  children), not reflexively on every value.
- All `useEffect` cleanup is real: timers are cleared, workers are
  terminated, event listeners are removed — audited pass at the end of the
  build (see [Limitations](#limitations--future-improvements) for the one
  exception).

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`) throughout; a
  skip-to-content link is the first focusable element on every page.
- Every icon is decorative (`aria-hidden`) and always paired with visible
  text; nothing is icon-only.
- Meters and progress-style indicators use `role="progressbar"` /
  `role="img"` with descriptive `aria-label`s (context window usage,
  signal/noise/unused breakdown, token health, AI accuracy, build health).
- Transient state changes are announced: the context-operation diff
  banner, the Copy-button's "Copied" confirmation, and Dementia Code's
  auto-cleanup note are all `role="status" aria-live="polite"`.
- Visible `:focus-visible` outlines everywhere; verified via actual
  keyboard Tab presses (not just code review) that focus order is sane —
  skip link → theme toggle → primary nav — with no traps.
- `prefers-reduced-motion` zeroes out transitions and animations globally.
- The sidebar becomes a genuine off-canvas dialog-like drawer on mobile
  only (closes on Escape, backdrop click, or route change); at tablet
  width and above it's a persistent, user-collapsible sidebar instead of a
  drawer, matching how much screen space is actually available.

---

## Responsive design

Desktop and tablet (≥768px) share one static sidebar that the user can
manually collapse to icon-only; true mobile (<768px) switches to an
off-canvas drawer triggered by a hamburger button. Every split-screen
layout (`.split-grid`) stacks to a single column at the same breakpoint,
verified with no horizontal overflow at 375px width.

---

## Limitations & future improvements

This section is deliberately honest — a portfolio piece that hides its
seams is less interesting than one that names them:

- **The accuracy/noise model is illustrative, not empirical.** It was
  designed to feel plausible and to visibly respond to the six context
  operations, not fit against any real dataset of AI output quality.
- **`codeCleaner.js` and `stateMapGenerator.js` are regex-based, not a real
  parser.** They handle common, reasonably-formatted React/JS well but can
  miss unusual code shapes (deeply nested destructuring, hooks called
  conditionally or inside helper functions, multi-line `console.log`
  calls). The Original/Cleaned diff view exists specifically so this is
  never a silent risk.
- **`useDelayedLoading`'s internal effect** triggers the one lint warning
  the codebase ships with (`react(set-state-in-effect)`). It's a
  legitimate `setTimeout`-based debounce — an external-system
  synchronization that genuinely needs an effect — rather than something
  derivable during render, so it was left as-is rather than contorted to
  silence a heuristic.
- **No automated test suite.** Every feature in this README was verified
  through manual, scripted browser testing during development (documented
  in the build process) rather than unit/integration tests. Adding Vitest
  coverage for the pure `utils/` functions — the highest-leverage,
  easiest-to-test layer — would be the natural next step.
- **No backend, accounts, or cross-device sync.** Everything is
  single-browser localStorage by design; a "share this context" or
  "export/import full app state" feature would need either a backend or a
  file-based export of the whole persisted blob, not just per-page content.
- **jQuery is an unused listed dependency**, kept only because the original
  project brief specified it as available; nothing in the app actually
  imports it, since every interaction is already idiomatic React.
