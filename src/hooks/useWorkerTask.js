import { useCallback, useEffect, useRef, useState } from "react";

// Manages a single Web Worker's lifecycle (create on mount, terminate on
// unmount) and exposes a request/response API with stale-response
// filtering: if `run` is called again before a prior request resolves, the
// prior response is discarded rather than overwriting newer state.
export function useWorkerTask(createWorker) {
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const worker = createWorker();
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { id, payload } = event.data;
      if (id !== requestIdRef.current) return;
      setResult(payload);
      setIsProcessing(false);
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [createWorker]);

  const run = useCallback((input) => {
    const worker = workerRef.current;
    if (!worker) return;
    requestIdRef.current += 1;
    setIsProcessing(true);
    worker.postMessage({ id: requestIdRef.current, input });
  }, []);

  return { result, isProcessing, run };
}
