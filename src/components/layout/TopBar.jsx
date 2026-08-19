import { useLocation } from "react-router-dom";
import { APP_NAME, ROUTE_STATUS, DEFAULT_ROUTE_STATUS } from "../../config/appConfig";
import StatusIndicator from "../common/StatusIndicator";
import ThemeToggle from "./ThemeToggle";
import Icon from "../common/Icon";
import "./TopBar.css";

export default function TopBar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const status = ROUTE_STATUS[pathname] ?? DEFAULT_ROUTE_STATUS;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>
        <div className="topbar-brand">
          <span className="topbar-brand-mark" aria-hidden="true">
            <Icon name="bolt" size={16} />
          </span>
          <span className="topbar-brand-name">{APP_NAME}</span>
        </div>
      </div>

      <div className="topbar-right">
        <StatusIndicator label={status.label} tone={status.tone} />
        <ThemeToggle />
      </div>
    </header>
  );
}
