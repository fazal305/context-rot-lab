import { useEffect, useState } from "react";

// Returns `value`, but only updates after it has stopped changing for
// `delay` ms — used to keep expensive analysis off the hot keystroke path.
export function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
