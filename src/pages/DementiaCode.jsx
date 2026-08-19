import PageHeader from "../components/common/PageHeader";
import StatusIndicator from "../components/common/StatusIndicator";
import Icon from "../components/common/Icon";
import GameStatsPanel from "../components/code-game/GameStatsPanel";
import UpgradeShop from "../components/code-game/UpgradeShop";
import GenerationFeed from "../components/code-game/GenerationFeed";
import { useDementiaGame } from "../hooks/useDementiaGame";
import "./DementiaCode.css";

export default function DementiaCode() {
  const {
    linesOfCode,
    contextItems,
    tokens,
    technicalDebt,
    buildHealth,
    storyPoints,
    accuracy,
    tier,
    upgrades,
    log,
    cleanupNote,
    generate,
    buyUpgrade,
    reset,
  } = useDementiaGame();

  const handleReset = () => {
    if (window.confirm("Reset Dementia Code progress? This clears lines of code, upgrades, and history.")) {
      reset();
    }
  };

  return (
    <div>
      <PageHeader
        title="Dementia Code"
        description="A fictional, satirical simulation about AI-assisted software development spiraling out of control as the codebase — and its context — grows. Not a real product or a claim about any actual AI model."
        badge={<StatusIndicator label="GAME" tone="accent" />}
      />

      <div className="dementia-generate-row surface-card">
        <button type="button" className="dementia-generate-btn" onClick={generate}>
          <Icon name="bolt" size={18} />
          Generate Component
        </button>
        {cleanupNote && (
          <span className="dementia-cleanup-note" role="status" aria-live="polite">
            {cleanupNote}
          </span>
        )}
        <button type="button" className="action-button dementia-reset-btn" onClick={handleReset}>
          Reset Game
        </button>
      </div>

      <GameStatsPanel
        linesOfCode={linesOfCode}
        contextItems={contextItems}
        tokens={tokens}
        technicalDebt={technicalDebt}
        buildHealth={buildHealth}
        storyPoints={storyPoints}
        accuracy={accuracy}
        tier={tier}
      />

      <div className="split-grid">
        <GenerationFeed log={log} />
        <UpgradeShop ownedLevels={upgrades} storyPoints={storyPoints} onBuy={buyUpgrade} />
      </div>
    </div>
  );
}
