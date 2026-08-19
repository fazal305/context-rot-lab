import { NavLink } from "react-router-dom";
import { NAV_ITEMS, SETTINGS_NAV_ITEM, FEATURE_FLAGS } from "../../config/appConfig";
import Icon from "../common/Icon";
import "./Sidebar.css";

const VISIBLE_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => item.path !== "/dementia-code" || FEATURE_FLAGS.enableDementiaCode,
);

export default function Sidebar({ mobileOpen, onCloseMobile, collapsed, onToggleCollapsed }) {
  const renderLink = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      end={item.end}
      className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
      onClick={onCloseMobile}
    >
      <Icon name={item.icon} size={18} />
      <span className="sidebar-link-label">{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={onCloseMobile}
        />
      )}
      <nav
        id="app-sidebar"
        className={`sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
        aria-label="Primary"
      >
        <div className="sidebar-nav">{VISIBLE_NAV_ITEMS.map(renderLink)}</div>

        <div className="sidebar-footer">
          {renderLink(SETTINGS_NAV_ITEM)}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="app-sidebar"
          >
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={16} />
            <span className="sidebar-link-label">Collapse</span>
          </button>
        </div>
      </nav>
    </>
  );
}
