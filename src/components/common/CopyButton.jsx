import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "../../utils/fileUtils";
import Icon from "./Icon";

export default function CopyButton({ getText, label = "Copy", copiedLabel = "Copied" }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleClick = async () => {
    const ok = await copyToClipboard(getText());
    if (!ok) return;
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" className="action-button" onClick={handleClick}>
      <Icon name={copied ? "check" : "copy"} size={14} />
      {copied ? copiedLabel : label}
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
