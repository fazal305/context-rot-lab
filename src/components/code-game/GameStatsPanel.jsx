import StatChip from "../common/StatChip";
import MeterBar from "../common/MeterBar";
import StatusIndicator from "../common/StatusIndicator";
import { CURRENCY_NAME, MAX_GAME_CONTEXT_TOKENS } from "../../config/gameConfig";
import "./GameStatsPanel.css";

const HEALTH_TONE_THRESHOLDS = [
  { min: 60, tone: "signal" },
  { min: 30, tone: "warning" },
  { min: 0, tone: "noise" },
];

function getHealthTone(value) {
  return HEALTH_TONE_THRESHOLDS.find((entry) => value >= entry.min)?.tone ?? "noise";
}

export default function GameStatsPanel({
  linesOfCode,
  contextItems,
  tokens,
  technicalDebt,
  buildHealth,
  storyPoints,
  accuracy,
  tier,
}) {
  return (
    <section className="panel surface-card game-stats" aria-label="Game resources">
      <div className="panel-header">
        <h2 className="panel-title">Codebase Status</h2>
        <StatusIndicator label={tier.label} tone={tier.tone} />
      </div>

      <div className="game-stats-meters">
        <MeterBar label="AI Accuracy" value={accuracy} tone={tier.tone === "noise" ? "noise" : tier.tone === "warning" ? "warning" : "signal"} />
        <MeterBar label="Build Health" value={buildHealth} tone={getHealthTone(buildHealth)} />
      </div>

      <div className="game-stats-chips">
        <StatChip label="Lines of Code" value={linesOfCode.toLocaleString()} />
        <StatChip label="Context Size" value={contextItems.toLocaleString()} />
        <StatChip label="Tokens" value={`${tokens.toLocaleString()} / ${MAX_GAME_CONTEXT_TOKENS.toLocaleString()}`} />
        <StatChip label="Technical Debt" value={technicalDebt.toLocaleString()} />
        <StatChip label={CURRENCY_NAME} value={storyPoints.toLocaleString()} />
      </div>
    </section>
  );
}
