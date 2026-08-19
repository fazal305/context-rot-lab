import "./GenerationFeed.css";

const TIER_TONE = {
  pristine: "signal",
  solid: "signal",
  shaky: "warning",
  crumbling: "noise",
  meltdown: "noise",
};

export default function GenerationFeed({ log }) {
  return (
    <section className="panel surface-card generation-feed" aria-label="Generated components">
      <h2 className="panel-title">Generated Components</h2>
      {log.length ? (
        <ul className="generation-feed-list" aria-live="polite">
          {log.map((entry) => (
            <li key={entry.id} className={`generation-feed-item tone-${TIER_TONE[entry.tier] ?? "muted"}`}>
              <div className="generation-feed-item-header">
                <span className="generation-feed-item-name">{entry.name}</span>
                <span className="generation-feed-item-accuracy">{entry.accuracy}%</span>
              </div>
              <p className="generation-feed-item-response">&ldquo;{entry.response}&rdquo;</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-token">Click "Generate Component" to start building.</p>
      )}
    </section>
  );
}
