import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "../services/storageService";

const STORAGE_KEY = "theme-preference";
export const THEME_OPTIONS = ["dark", "light", "system"];
const DEFAULT_PREFERENCE = "dark";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

function resolveSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

function applyToDocument(resolved) {
  document.documentElement.setAttribute("data-theme", resolved);
}

// Theme preference is one of "dark" | "light" | "system" and persists to
// localStorage. "system" is resolved against prefers-color-scheme at read
// time and re-resolved live if the OS setting changes while active. The
// resolved value ("dark" | "light") is written to <html data-theme>, which
// styles/tokens.css keys off of. index.html applies the stored preference
// synchronously before React mounts, so there is no flash of wrong theme.
export function useTheme() {
  const [preference, setPreference] = useState(() => getItem(STORAGE_KEY, DEFAULT_PREFERENCE));
  const [systemTheme, setSystemTheme] = useState(() => resolveSystemTheme());

  const resolvedTheme = preference === "system" ? systemTheme : preference;

  // Side effect: sync the resolved theme to the DOM attribute tokens.css keys off of.
  useEffect(() => {
    applyToDocument(resolvedTheme);
  }, [resolvedTheme]);

  // Side effect: listen for OS theme changes so "system" stays live.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia(LIGHT_QUERY);
    const handleChange = () => setSystemTheme(resolveSystemTheme());
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next) => {
    if (!THEME_OPTIONS.includes(next)) return;
    setPreference(next);
    setItem(STORAGE_KEY, next);
  }, []);

  return { preference, resolvedTheme, setTheme };
}
