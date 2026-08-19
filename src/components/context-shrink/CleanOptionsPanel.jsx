import { CLEAN_OPTION_DEFINITIONS } from "../../config/contextShrinkConfig";
import "./CleanOptionsPanel.css";

export default function CleanOptionsPanel({ options, onToggle }) {
  return (
    <section className="clean-options surface-card" aria-label="Code stripper options">
      <h2 className="panel-title">Code Stripper Options</h2>
      <div className="clean-options-list">
        {CLEAN_OPTION_DEFINITIONS.map((option) => (
          <label key={option.id} className="clean-option">
            <input type="checkbox" checked={options[option.id]} onChange={() => onToggle(option.id)} />
            <span className="clean-option-text">
              <span className="clean-option-label">{option.label}</span>
              <span className="clean-option-description">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
