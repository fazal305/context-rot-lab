import { getTokenHealth, TOKEN_HEALTH_LEVEL_ORDER } from "../../utils/tokenEstimator";
import "./TokenHealthBar.css";

export default function TokenHealthBar({ tokens, maxTokens }) {
  const health = getTokenHealth(tokens, maxTokens);
  const pct = Math.min(100, Math.round((tokens / maxTokens) * 100));

  return (
    <div className="token-health" role="img" aria-label={`Token health: ${health.label}, ${pct}% of context window`}>
      <div className="token-health-track">
        <div className={`token-health-fill token-health-${health.level}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="token-health-levels">
        {TOKEN_HEALTH_LEVEL_ORDER.map((level) => (
          <span key={level} className={`token-health-level${level === health.level ? " is-active" : ""}`}>
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}
