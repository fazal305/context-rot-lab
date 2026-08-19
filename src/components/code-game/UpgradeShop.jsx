import { UPGRADES } from "../../data/upgrades";
import { CURRENCY_NAME } from "../../config/gameConfig";
import { getUpgradeCost } from "../../utils/gameEngine";
import "./UpgradeShop.css";

export default function UpgradeShop({ ownedLevels, storyPoints, onBuy }) {
  return (
    <section className="panel surface-card upgrade-shop" aria-label="Upgrades">
      <h2 className="panel-title">Upgrades</h2>
      <div className="upgrade-shop-grid">
        {UPGRADES.map((upgrade) => {
          const level = ownedLevels[upgrade.id] ?? 0;
          const maxed = level >= upgrade.maxLevel;
          const cost = getUpgradeCost(upgrade, level);
          const affordable = storyPoints >= cost;

          return (
            <div key={upgrade.id} className={`upgrade-card${maxed ? " is-maxed" : ""}`}>
              <div className="upgrade-card-header">
                <span className="upgrade-card-name">{upgrade.name}</span>
                <span className="upgrade-card-level">
                  Lv {level}/{upgrade.maxLevel}
                </span>
              </div>
              <p className="upgrade-card-description">{upgrade.description}</p>
              <button
                type="button"
                className="action-button upgrade-card-buy"
                disabled={maxed || !affordable}
                onClick={() => onBuy(upgrade.id)}
              >
                {maxed ? "Maxed" : `Buy — ${cost} ${CURRENCY_NAME}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
