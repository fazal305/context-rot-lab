// Thin wrapper around localStorage: namespaces keys, JSON-encodes values,
// and fails silently when storage is unavailable (private browsing, quota
// exceeded) so persistence is best-effort rather than a hard dependency.

const NAMESPACE = "context-rot-lab:";

function isStorageAvailable() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function getItem(key, fallback = null) {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(NAMESPACE + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(NAMESPACE + key);
  } catch {
    // ignore
  }
}

// Removes every key this app has written, across all features/modes.
export function clearAllAppData() {
  if (!isStorageAvailable()) return;
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(NAMESPACE))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
}
