import { Link } from "react-router-dom";
import Icon from "./Icon";
import StatusIndicator from "./StatusIndicator";
import "./ModeCard.css";

export default function ModeCard({ mode }) {
  return (
    <Link to={mode.path} className={`mode-card mode-card-${mode.tone}`}>
      <div className="mode-card-header">
        <span className="mode-card-icon">
          <Icon name={mode.icon} size={20} />
        </span>
        <StatusIndicator label={mode.tagline} tone={mode.tone} />
      </div>
      <h2 className="mode-card-title">{mode.title}</h2>
      <p className="mode-card-description">{mode.description}</p>
      <span className="mode-card-cta">
        Open
        <Icon name="chevronRight" size={16} />
      </span>
    </Link>
  );
}
