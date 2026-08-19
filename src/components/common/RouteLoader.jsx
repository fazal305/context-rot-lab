import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import Loader from "./Loader";
import "./RouteLoader.css";

// Suspense fallback for lazy-loaded route chunks. Mounts immediately but
// only renders visible content once useDelayedLoading's threshold passes,
// so fast chunk loads never flash a spinner.
export default function RouteLoader() {
  const showLoader = useDelayedLoading(true);

  if (!showLoader) return null;

  return (
    <div className="route-loader" role="status">
      <Loader label="Loading module…" size="lg" />
    </div>
  );
}
