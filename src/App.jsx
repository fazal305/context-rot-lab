import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import RouteLoader from "./components/common/RouteLoader";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { FEATURE_FLAGS } from "./config/appConfig";

const ContextRotSimulator = lazy(() => import("./pages/ContextRotSimulator"));
const ContextShrink = lazy(() => import("./pages/ContextShrink"));
const DementiaCode = lazy(() => import("./pages/DementiaCode"));

function lazyRoute(Component) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Component />
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/context-rot" element={lazyRoute(ContextRotSimulator)} />
        <Route path="/context-shrink" element={lazyRoute(ContextShrink)} />
        <Route
          path="/dementia-code"
          element={FEATURE_FLAGS.enableDementiaCode ? lazyRoute(DementiaCode) : <NotFound />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
