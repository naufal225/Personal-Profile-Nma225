export default function FormField({ label, error, required, description, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

export const inputCls = [
  'w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm',
  'placeholder:text-muted-foreground',
  'focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring',
  'transition-colors disabled:opacity-60',
].join(' ')

export const inputErrCls = [
  'w-full px-3 py-2 rounded-lg border border-destructive bg-background text-foreground text-sm',
  'placeholder:text-muted-foreground',
  'focus:outline-none focus:border-destructive focus:ring-1 focus:ring-destructive',
  'transition-colors',
].join(' ')
