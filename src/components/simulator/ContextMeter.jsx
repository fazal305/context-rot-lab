import { MAX_CONTEXT_TOKENS } from "../../config/simulationConfig";
import "./ContextMeter.css";

export default function ContextMeter({ tokens, lineBreakdown }) {
  const utilizationPct = Math.min(100, Math.round((tokens / MAX_CONTEXT_TOKENS) * 100));
  const total = lineBreakdown.total || 1;
  const signalPct = Math.round((lineBreakdown.signal / total) * 100);
  const noisePct = Math.round((lineBreakdown.noise / total) * 100);
  const unusedPct = Math.max(0, 100 - signalPct - noisePct);

  return (
    <section className="context-meter surface-card" aria-label="Context window usage">
      <div className="context-meter-row">
        <span className="context-meter-title">Context Window</span>
        <span className="context-meter-value">
          {tokens.toLocaleString()} / {MAX_CONTEXT_TOKENS.toLocaleString()} tokens
        </span>
      </div>
      <div
        className="context-meter-track"
        role="progressbar"
        aria-valuenow={utilizationPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Context window utilization"
      >
        <div
          className={`context-meter-fill${utilizationPct > 90 ? " is-critical" : ""}`}
          style={{ width: `${utilizationPct}%` }}
        />
      </div>

      <div className="context-meter-legend">
        <div className="context-meter-legend-row">
          <span className="context-meter-legend-label">
            <span className="context-meter-dot context-meter-dot-signal" aria-hidden="true" />
            Signal
          </span>
          <div className="context-meter-bar" role="img" aria-label={`Signal: ${lineBreakdown.signal} lines`}>
            <div className="context-meter-bar-fill context-meter-bar-signal" style={{ width: `${signalPct}%` }} />
          </div>
          <span className="context-meter-legend-count">{lineBreakdown.signal}</span>
        </div>
        <div className="context-meter-legend-row">
          <span className="context-meter-legend-label">
            <span className="context-meter-dot context-meter-dot-noise" aria-hidden="true" />
            Noise
          </span>
          <div className="context-meter-bar" role="img" aria-label={`Noise: ${lineBreakdown.noise} lines`}>
            <div className="context-meter-bar-fill context-meter-bar-noise" style={{ width: `${noisePct}%` }} />
          </div>
          <span className="context-meter-legend-count">{lineBreakdown.noise}</span>
        </div>
        <div className="context-meter-legend-row">
          <span className="context-meter-legend-label">
            <span className="context-meter-dot context-meter-dot-unused" aria-hidden="true" />
            Unused
          </span>
          <div className="context-meter-bar" role="img" aria-label={`Unused: ${lineBreakdown.unused} lines`}>
            <div className="context-meter-bar-fill context-meter-bar-unused" style={{ width: `${unusedPct}%` }} />
          </div>
          <span className="context-meter-legend-count">{lineBreakdown.unused}</span>
        </div>
      </div>
    </section>
  );
}
