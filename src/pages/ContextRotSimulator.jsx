import PageHeader from "../components/common/PageHeader";
import StatusIndicator from "../components/common/StatusIndicator";
import ContextMeter from "../components/simulator/ContextMeter";
import ContextControls from "../components/simulator/ContextControls";
import ContextInputPanel from "../components/simulator/ContextInputPanel";
import OutputPanel from "../components/simulator/OutputPanel";
import { useContextRotSimulator } from "../hooks/useContextRotSimulator";

export default function ContextRotSimulator() {
  const {
    text,
    setText,
    liveStats,
    simulation,
    isRecalculating,
    lastOperation,
    examples,
    operations,
    loadExample,
    applyOperation,
  } = useContextRotSimulator();

  return (
    <div>
      <PageHeader
        title="Context Rot Simulator"
        description="An educational model of how larger, noisier context can crowd out signal and degrade simulated AI accuracy. Not a benchmark of any real model."
        badge={<StatusIndicator label="SIMULATION" tone="signal" />}
      />

      <ContextMeter tokens={simulation.stats.tokens} lineBreakdown={simulation.lineBreakdown} />
      <ContextControls operations={operations} onApply={applyOperation} lastOperation={lastOperation} />

      <div className="split-grid">
        <ContextInputPanel
          value={text}
          onChange={setText}
          liveStats={liveStats}
          tier={simulation.tier}
          examples={examples}
          onLoadExample={loadExample}
        />
        <OutputPanel simulation={simulation} isRecalculating={isRecalculating} />
      </div>
    </div>
  );
}
