import "./PageHeader.css";

export default function PageHeader({ title, description, badge, actions }) {
  return (
    <header className="page-header">
      <div className="page-header-main">
        <div className="page-header-title-row">
          <h1>{title}</h1>
          {badge}
        </div>
        {description && <p className="page-header-description">{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}
