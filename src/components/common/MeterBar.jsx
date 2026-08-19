import "./MeterBar.css";

// Generic labeled percentage bar — used for game resources like accuracy
// and build health, anywhere a StatusIndicator dot is too coarse.
export default function MeterBar({ label, value, tone = "accent", suffix = "%" }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="meter-bar">
      <div className="meter-bar-row">
        <span className="meter-bar-label">{label}</span>
        <span className="meter-bar-value">
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      <div
        className="meter-bar-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`meter-bar-fill meter-bar-${tone}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
