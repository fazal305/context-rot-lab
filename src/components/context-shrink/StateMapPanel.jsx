import CopyButton from "../common/CopyButton";
import "./StateMapPanel.css";

function StateMapSection({ title, items, renderItem }) {
  return (
    <div className="state-map-section">
      <h3>{title}</h3>
      {items.length ? (
        <ul>
          {items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key -- extracted items have no stable id
            <li key={index}>{renderItem(item)}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-token">None detected</p>
      )}
    </div>
  );
}

export default function StateMapPanel({ stateMap, summary }) {
  return (
    <section className="panel surface-card state-map" aria-label="State map">
      <div className="panel-header">
        <h2 className="panel-title">State Map — {stateMap.componentName}</h2>
        <CopyButton getText={() => summary} label="Copy AI Context Summary" copiedLabel="Copied" />
      </div>

      <div className="state-map-grid">
        <StateMapSection title="Props" items={stateMap.props} renderItem={(prop) => prop} />
        <StateMapSection
          title="State"
          items={stateMap.state}
          renderItem={(item) => `${item.name}: ${item.type}`}
        />
        <StateMapSection title="Custom Hooks" items={stateMap.customHooks} renderItem={(hook) => hook} />
        <StateMapSection
          title="Effects"
          items={stateMap.effects}
          renderItem={(effect) => `${effect.hook} — deps: ${effect.deps ?? "(not detected)"}`}
        />
      </div>
    </section>
  );
}
