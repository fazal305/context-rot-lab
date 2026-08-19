import "./StatusIndicator.css";

// tone maps to a token-driven color: "signal" | "noise" | "warning" | "info" | "accent" | "muted"
export default function StatusIndicator({ label, tone = "muted" }) {
  return (
    <span className={`status-indicator status-indicator-${tone}`}>
      <span className="status-indicator-dot" aria-hidden="true" />
      <span className="status-indicator-label">
        {label}
        <span className="visually-hidden"> status</span>
      </span>
    </span>
  );
}
