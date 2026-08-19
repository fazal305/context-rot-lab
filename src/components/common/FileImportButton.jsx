import { useId, useRef } from "react";
import { readTextFile } from "../../utils/fileUtils";
import Icon from "./Icon";

// Hidden native file input triggered by a styled button — keeps the
// picker's OS-level accessibility while matching the app's button styling.
export default function FileImportButton({ onImport, accept = ".js,.jsx,.ts,.tsx,.txt,.md" }) {
  const inputId = useId();
  const inputRef = useRef(null);

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await readTextFile(file);
      onImport(text);
    } catch {
      // Reading failed (unsupported file, permission issue) — leave the
      // editor content untouched rather than clobbering it with an error.
    }
  };

  return (
    <>
      <label className="visually-hidden" htmlFor={inputId}>
        Import a text file
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="visually-hidden"
        onChange={handleChange}
      />
      <button type="button" className="action-button" onClick={() => inputRef.current?.click()}>
        <Icon name="download" size={14} style={{ transform: "rotate(180deg)" }} />
        Import file
      </button>
    </>
  );
}
