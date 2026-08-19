import PageHeader from "../components/common/PageHeader";
import ThemeToggle from "../components/layout/ThemeToggle";
import { clearAllAppData } from "../services/storageService";
import "./Settings.css";

export default function Settings() {
  const handleClearData = () => {
    const confirmed = window.confirm(
      "Clear all local data? This resets theme preference, the simulator's context, ContextShrink settings, and all Dementia Code progress. This cannot be undone.",
    );
    if (!confirmed) return;
    clearAllAppData();
    window.location.reload();
  };

  return (
    <div>
      <PageHeader title="Settings" description="Application-wide preferences, shared across every mode." />

      <section className="settings-section surface-card">
        <div className="settings-row">
          <div>
            <h2 className="settings-row-title">Theme</h2>
            <p className="settings-row-description">Dark, light, or match your system preference.</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <section className="settings-section surface-card">
        <div className="settings-row">
          <div>
            <h2 className="settings-row-title">Local data</h2>
            <p className="settings-row-description">
              Theme preference, the simulator's context, ContextShrink settings, and Dementia Code progress
              are all saved to this browser's local storage — nothing is sent to a server.
            </p>
          </div>
          <button type="button" className="action-button settings-clear-btn" onClick={handleClearData}>
            Clear Local Data
          </button>
        </div>
      </section>
    </div>
  );
}
