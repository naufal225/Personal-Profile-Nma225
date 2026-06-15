export default function FormField({ label, error, required, description, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label>
          {label}
          {required && <span className="req"> *</span>}
        </label>
      )}
      {children}
      {description && !error && <p className="hint">{description}</p>}
      {error && <p className="hint" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
}

// Design-system input classes (see admin index.css)
export const inputCls = 'input'
export const inputErrCls = 'input input-err'
