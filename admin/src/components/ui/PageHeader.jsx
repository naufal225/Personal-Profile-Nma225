export default function PageHeader({ title, description, action }) {
  return (
    <div className="page-head">
      <div style={{ minWidth: 0 }}>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-sub">{description}</p>}
      </div>
      {action && <div className="page-actions">{action}</div>}
    </div>
  )
}
