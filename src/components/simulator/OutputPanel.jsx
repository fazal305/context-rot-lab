import StatChip from "../common/StatChip";
import "./OutputPanel.css";

function getConfidenceLabel(confidence) {
  if (confidence >= 80) return "High";
  if (confidence >= 55) return "Moderate";
  if (confidence >= 30) return "Low";
  return "Very low";
}

export default function OutputPanel({ simulation, isRecalculating }) {
  const { outputCode, accuracyScore, confidence, utilization, diagnosticIssues, bugIssues, snippet } = simulation;
  const issues = [...diagnosticIssues, ...bugIssues];
  const hasOutput = snippet.trim().length > 0;

  return (
    <section className="panel surface-card" aria-label="Simulated AI output">
      <div className="panel-header">
        <h2 className="panel-title">Simulated AI Output</h2>
        <span className="output-panel-badge">SIMULATED{isRecalculating ? " · updating…" : ""}</span>
      </div>

      <pre className="code-block" aria-label="Simulated output code">
        <code>{hasOutput ? outputCode : "// No signal code detected in the current context."}</code>
      </pre>

      <div className="panel-footer output-panel-metrics">
        <StatChip label="Accuracy" value={`${accuracyScore}%`} />
        <StatChip label="Confidence" value={getConfidenceLabel(confidence)} />
        <StatChip label="Context used" value={`${Math.round(utilization * 100)}%`} />
      </div>

      <div className="output-panel-issues">
        <h3 className="output-panel-issues-title">Detected issues</h3>
        {issues.length ? (
          <ul>
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-token">No issues detected — context is clean.</p>
        )}
      </div>

      <p className="output-panel-disclaimer">
        Educational simulation of context degradation, not a benchmark of any specific real AI model.
      </p>
    </section>
  );
}
