import { useTheme, THEME_OPTIONS } from "../../hooks/useTheme";
import Icon from "../common/Icon";
import "./ThemeToggle.css";

const OPTION_META = {
  dark: { icon: "moon", label: "Dark theme" },
  light: { icon: "sun", label: "Light theme" },
  system: { icon: "monitor", label: "Match system theme" },
};

export default function ThemeToggle() {
  const { preference, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {THEME_OPTIONS.map((option) => {
        const meta = OPTION_META[option];
        const active = preference === option;
        return (
          <button
            key={option}
            type="button"
            className={`theme-toggle-option${active ? " is-active" : ""}`}
            aria-pressed={active}
            title={meta.label}
            onClick={() => setTheme(option)}
          >
            <Icon name={meta.icon} size={15} />
            <span className="visually-hidden">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
