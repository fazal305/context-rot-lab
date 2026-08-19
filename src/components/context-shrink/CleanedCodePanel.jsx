import StatChip from "../common/StatChip";
import CopyButton from "../common/CopyButton";
import { downloadTextFile } from "../../utils/fileUtils";
import { FEATURE_FLAGS } from "../../config/appConfig";
import "./CleanedCodePanel.css";

export default function CleanedCodePanel({ cleaned, rawStats, cleanedStats, isRecalculating }) {
  const charsSaved = Math.max(0, rawStats.characters - cleanedStats.characters);
  const tokensSaved = Math.max(0, rawStats.tokens - cleanedStats.tokens);
  const pctSaved = rawStats.characters ? Math.round((charsSaved / rawStats.characters) * 100) : 0;

  return (
    <section className="panel surface-card" aria-label="Cleaned code">
      <div className="panel-header">
        <h2 className="panel-title">Cleaned{isRecalculating ? " · updating…" : ""}</h2>
        <div className="cleaned-code-actions">
          <CopyButton getText={() => cleaned} label="Copy" copiedLabel="Copied" />
          {FEATURE_FLAGS.enableContextShrinkExport && (
            <>
              <button
                type="button"
                className="action-button"
                onClick={() => downloadTextFile("cleaned-context.txt", cleaned)}
              >
                Download .txt
              </button>
              <button
                type="button"
                className="action-button"
                onClick={() =>
                  downloadTextFile("cleaned-context.md", `\`\`\`\n${cleaned}\n\`\`\`\n`, "text/markdown")
                }
              >
                Download .md
              </button>
            </>
          )}
        </div>
      </div>

      <pre className="code-block" aria-label="Cleaned output code">
        <code>{cleaned}</code>
      </pre>

      <div className="panel-footer">
        <StatChip label="Chars saved" value={charsSaved.toLocaleString()} />
        <StatChip label="Tokens saved" value={tokensSaved.toLocaleString()} />
        <StatChip label="Reduction" value={`${pctSaved}%`} />
      </div>
    </section>
  );
}
