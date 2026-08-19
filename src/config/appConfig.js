// Centralized application-level configuration: identity, navigation, and
// per-route status metadata. Keep this data-driven so nav/layout components
// never hard-code route strings or labels.

export const APP_NAME = "Context Rot Lab";
export const APP_TAGLINE = "Simulate context rot. Shrink real context. Survive Dementia Code.";

export const NAV_ITEMS = [
  { path: "/", label: "Overview", icon: "grid", end: true },
  { path: "/context-rot", label: "Context Rot", icon: "activity" },
  { path: "/context-shrink", label: "ContextShrink", icon: "scissors" },
  { path: "/dementia-code", label: "Dementia Code", icon: "cpu" },
];

export const SETTINGS_NAV_ITEM = { path: "/settings", label: "Settings", icon: "settings" };

// Status pill shown in the top bar, keyed by route pathname.
export const ROUTE_STATUS = {
  "/": { label: "IDLE", tone: "muted" },
  "/context-rot": { label: "SIMULATION", tone: "signal" },
  "/context-shrink": { label: "UTILITY", tone: "info" },
  "/dementia-code": { label: "GAME", tone: "accent" },
  "/settings": { label: "CONFIG", tone: "muted" },
};

export const DEFAULT_ROUTE_STATUS = { label: "UNKNOWN", tone: "muted" };

// Feature flags — centralized so features can be toggled without hunting
// through components. enableDementiaCode gates its nav item, dashboard
// card, and route; enableContextShrinkExport gates the Download .txt/.md
// buttons (Copy-to-clipboard stays available either way, since it isn't a
// file export).
export const FEATURE_FLAGS = {
  enableDementiaCode: true,
  enableContextShrinkExport: true,
};

// Loaders only appear once an operation has been running longer than this.
export const LOADER_DELAY_MS = 200;
