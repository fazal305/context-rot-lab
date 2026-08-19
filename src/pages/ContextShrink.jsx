import PageHeader from "../components/common/PageHeader";
import StatusIndicator from "../components/common/StatusIndicator";
import CodeInputPanel from "../components/context-shrink/CodeInputPanel";
import CleanOptionsPanel from "../components/context-shrink/CleanOptionsPanel";
import CleanedCodePanel from "../components/context-shrink/CleanedCodePanel";
import StateMapPanel from "../components/context-shrink/StateMapPanel";
import { useContextShrink } from "../hooks/useContextShrink";

export default function ContextShrink() {
  const {
    code,
    setCode,
    options,
    toggleOption,
    rawStats,
    cleaned,
    cleanedStats,
    stateMap,
    summary,
    isRecalculating,
    reset,
  } = useContextShrink();

  return (
    <div>
      <PageHeader
        title="ContextShrink"
        description="Paste a React or JavaScript component to strip noise, map its shape, and export a compact summary for an AI conversation."
        badge={<StatusIndicator label="UTILITY" tone="info" />}
      />

      <div className="split-grid">
        <div>
          <CodeInputPanel value={code} onChange={setCode} stats={rawStats} onReset={reset} />
          <CleanOptionsPanel options={options} onToggle={toggleOption} />
        </div>
        <CleanedCodePanel
          cleaned={cleaned}
          rawStats={rawStats}
          cleanedStats={cleanedStats}
          isRecalculating={isRecalculating}
        />
      </div>

      <StateMapPanel stateMap={stateMap} summary={summary} />
    </div>
  );
}
