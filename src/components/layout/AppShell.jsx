import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { usePersistentState } from "../../hooks/usePersistentState";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import "./AppShell.css";

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = usePersistentState("sidebar-collapsed", false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes (derived during
  // render rather than via effect, to avoid an extra render pass).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <TopBar onToggleSidebar={() => setMobileOpen((open) => !open)} />
      <div className="app-shell-body">
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
        <main className="app-shell-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
