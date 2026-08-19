import StatChip from "../common/StatChip";
import TokenHealthBar from "../common/TokenHealthBar";
import FileImportButton from "../common/FileImportButton";
import { MAX_CONTEXT_TOKENS } from "../../config/simulationConfig";
import "./CodeInputPanel.css";

export default function CodeInputPanel({ value, onChange, stats, onReset }) {
  return (
    <section className="panel surface-card" aria-label="Code input">
      <div className="panel-header">
        <h2 className="panel-title">Paste Code</h2>
        <div className="panel-header-actions">
          <FileImportButton onImport={onChange} />
          <button type="button" className="action-button" onClick={onReset}>
            Load example
          </button>
        </div>
      </div>

      <textarea
        className="code-editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        aria-label="Code input editor"
        placeholder="Paste a React or JavaScript component here…"
      />

      <div className="panel-footer">
        <div className="context-panel-stats">
          <StatChip label="Characters" value={stats.characters.toLocaleString()} />
          <StatChip label="Words" value={stats.words.toLocaleString()} />
          <StatChip label="Lines" value={stats.lines.toLocaleString()} />
          <StatChip label="Tokens (est.)" value={stats.tokens.toLocaleString()} />
        </div>
      </div>

      <div className="code-input-health">
        <span className="code-input-health-label">
          Estimated context: {Math.round((stats.tokens / MAX_CONTEXT_TOKENS) * 100)}%
        </span>
        <TokenHealthBar tokens={stats.tokens} maxTokens={MAX_CONTEXT_TOKENS} />
      </div>
    </section>
  );
}
