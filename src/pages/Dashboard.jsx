import PageHeader from "../components/common/PageHeader";
import ModeCard from "../components/common/ModeCard";
import Icon from "../components/common/Icon";
import { MODES } from "../data/modes";
import { APP_TAGLINE, FEATURE_FLAGS } from "../config/appConfig";
import "./Dashboard.css";

const FLOW_STEPS = ["More Context", "More Noise", "Less Signal", "Lower Simulated Accuracy"];
const VISIBLE_MODES = MODES.filter((mode) => mode.path !== "/dementia-code" || FEATURE_FLAGS.enableDementiaCode);

export default function Dashboard() {
  return (
    <div className="dashboard">
      <PageHeader title="Overview" description={APP_TAGLINE} />

      <section className="dashboard-flow surface-card" aria-label="Core concept">
        <div className="dashboard-flow-steps">
          {FLOW_STEPS.map((step, index) => (
            <div className="dashboard-flow-step" key={step}>
              <span className="dashboard-flow-step-label">{step}</span>
              {index < FLOW_STEPS.length - 1 && (
                <Icon name="chevronRight" size={18} className="dashboard-flow-arrow" />
              )}
            </div>
          ))}
        </div>
        <p className="dashboard-flow-note">
          As context grows, this lab models noise crowding out signal — this is an educational
          simulation of the idea, not a benchmark of how any specific real AI model behaves.
        </p>
      </section>

      <div className="dashboard-modes">
        {VISIBLE_MODES.map((mode) => (
          <ModeCard key={mode.path} mode={mode} />
        ))}
      </div>
    </div>
  );
}
