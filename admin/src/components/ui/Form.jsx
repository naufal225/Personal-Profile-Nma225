import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function FormShell({
  title,
  subtitle,
  backTo,
  onSubmit,
  submitting = false,
  submitLabel = 'Simpan',
  cancelTo,
  dirty = false,
  aside,
  children,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="page-head">
        <div style={{ minWidth: 0 }}>
          {backTo && (
            <Link to={backTo} className="form-back"><ArrowLeft size={15} /> Kembali</Link>
          )}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-sub">{subtitle}</p>}
        </div>
      </div>

      <div className={`form-layout${aside ? '' : ' no-aside'}`}>
        <div style={{ minWidth: 0 }}>{children}</div>
        {aside && <div>{aside}</div>}
      </div>

      <div className="form-foot">
        <div className="left">
          {dirty ? (<><span className="unsaved-dot" /> Perubahan belum disimpan</>) : 'Siap disimpan'}
        </div>
        <div className="right">
          {cancelTo && <Link to={cancelTo} className="btn btn-ghost">Batal</Link>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Menyimpan…' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}

export function FormCard({ children }) {
  return <div className="card form-card">{children}</div>
}

export function FormSection({ icon: Icon, title, sub, plain = false, children }) {
  return (
    <div className="form-section">
      {title && (
        <div className="form-section-title">{Icon && <Icon size={16} />}{title}</div>
      )}
      {sub ? <p className="form-section-sub">{sub}</p> : title ? <div style={{ height: 16 }} /> : null}
      {plain ? children : <div className="fgrid">{children}</div>}
    </div>
  )
}

export function AsideCard({ title, children }) {
  return (
    <div className="card aside-card">
      {title && <div className="aside-h">{title}</div>}
      {children}
    </div>
  )
}

export function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span className="knob" />
    </label>
  )
}
