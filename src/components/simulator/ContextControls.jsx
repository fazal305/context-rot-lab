import Icon from "../common/Icon";
import "./ContextControls.css";

function DiffStat({ label, before, after, format = (v) => v, lowerIsBetter = true }) {
  const improved = lowerIsBetter ? after < before : after > before;
  const changed = after !== before;
  return (
    <span className={`context-diff-stat${changed ? (improved ? " is-better" : " is-worse") : ""}`}>
      {label}: {format(before)} → {format(after)}
    </span>
  );
}

export default function ContextControls({ operations, onApply, lastOperation }) {
  return (
    <section className="context-controls surface-card" aria-label="Context operations">
      <div className="context-controls-buttons">
        {operations.map((operation) => (
          <button
            key={operation.id}
            type="button"
            className="context-controls-btn"
            title={operation.description}
            onClick={() => onApply(operation)}
          >
            <Icon name={operation.icon} size={16} />
            {operation.label}
          </button>
        ))}
      </div>

      {lastOperation && (
        <div className="context-diff" role="status">
          <strong>{lastOperation.label}</strong>
          <DiffStat
            label="Tokens"
            before={lastOperation.before.tokens}
            after={lastOperation.after.tokens}
            format={(v) => v.toLocaleString()}
          />
          <DiffStat
            label="Noise"
            before={lastOperation.before.noiseScore}
            after={lastOperation.after.noiseScore}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <DiffStat
            label="Accuracy"
            before={lastOperation.before.accuracyScore}
            after={lastOperation.after.accuracyScore}
            format={(v) => `${v}%`}
            lowerIsBetter={false}
          />
        </div>
      )}
    </section>
  );
}
