import StatChip from "../common/StatChip";
import StatusIndicator from "../common/StatusIndicator";
import FileImportButton from "../common/FileImportButton";
import "./ContextInputPanel.css";

export default function ContextInputPanel({ value, onChange, liveStats, tier, examples, onLoadExample }) {
  return (
    <section className="panel surface-card" aria-label="Context input">
      <div className="panel-header">
        <h2 className="panel-title">Context Input</h2>
        <div className="panel-header-actions">
          <FileImportButton onImport={onChange} />
          <label className="context-panel-example-select">
            <span className="visually-hidden">Load example context</span>
            <select
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) onLoadExample(event.target.value);
                event.target.value = "";
              }}
            >
              <option value="" disabled>
                Load example…
              </option>
              {examples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <textarea
        className="code-editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        aria-label="Context input editor"
        placeholder="Paste code, logs, or conversation history here…"
      />

      <div className="panel-footer">
        <div className="context-panel-stats">
          <StatChip label="Characters" value={liveStats.characters.toLocaleString()} />
          <StatChip label="Words" value={liveStats.words.toLocaleString()} />
          <StatChip label="Lines" value={liveStats.lines.toLocaleString()} />
          <StatChip label="Tokens (est.)" value={liveStats.tokens.toLocaleString()} />
        </div>
        <div className="context-panel-quality">
          <span className="context-panel-quality-label">Context quality</span>
          <StatusIndicator label={tier.label} tone={tier.tone} />
        </div>
      </div>
    </section>
  );
}
