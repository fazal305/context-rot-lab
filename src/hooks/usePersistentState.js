import { useEffect, useState } from "react";
import { getItem, setItem } from "../services/storageService";

// useState backed by localStorage under a namespaced key. Lazily reads the
// stored value on mount and writes back on every change.
export function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(() => getItem(key, defaultValue));

  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
