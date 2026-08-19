import { useEffect, useState } from "react";
import { LOADER_DELAY_MS } from "../config/appConfig";

// Returns true only once `isLoading` has been true for longer than `delay`.
// Prevents loading spinners from flashing on operations that finish almost
// instantly, per the app's "no loader under ~200ms" UX rule.
export function useDelayedLoading(isLoading, delay = LOADER_DELAY_MS) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowLoader(false);
      return undefined;
    }
    const timer = setTimeout(() => setShowLoader(true), delay);
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showLoader;
}
