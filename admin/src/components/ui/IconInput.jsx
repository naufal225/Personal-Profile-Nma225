import { useState, useRef, useEffect } from 'react'
import { Upload, Code2, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB

export default function IconInput({ value, onChange }) {
  const initialTab = value?.mode === 'svg' ? 'svg' : 'file'
  const [tab, setTab] = useState(initialTab)
  const [svgInput, setSvgInput] = useState(value?.mode === 'svg' ? value.svg : '')
  const [dragOver, setDragOver] = useState(false)
  const [sizeError, setSizeError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (value?.mode === 'svg' && value.svg !== svgInput) setSvgInput(value.svg)
  }, [value])

  const filePreview =
    value?.mode === 'file' && value.file ? URL.createObjectURL(value.file) :
    value?.mode === 'url' ? value.url : null

  const handleFile = (file) => {
    if (!file) return
    if (file.size > MAX_BYTES) {
      setSizeError(`File too large (max 2 MB). Your file: ${(file.size / 1024 / 1024).toFixed(1)} MB`)
      return
    }
    setSizeError('')
    onChange({ mode: 'file', file })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  const handleSvgChange = (e) => {
    const v = e.target.value
    setSvgInput(v)
    if (v.trim()) onChange({ mode: 'svg', svg: v })
    else onChange(null)
  }

  const handleClear = () => {
    onChange(null)
    setSvgInput('')
    setSizeError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const TabBtn = ({ id, icon: Icon, label }) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
        tab === id
          ? 'bg-background shadow-sm text-foreground border border-border'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  )

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <TabBtn id="file" icon={Upload} label="Upload Image" />
        <TabBtn id="svg" icon={Code2} label="SVG Code" />
      </div>

      {tab === 'file' && (
        <div
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer',
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
          )}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {filePreview ? (
            <>
              <img src={filePreview} alt="Preview" className="max-h-32 max-w-full rounded-lg object-contain" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear() }}
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop icon image or click to browse</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, SVG, WebP, JPG — max 2 MB</p>
              </div>
            </>
          )}
          {sizeError && <p className="text-xs text-destructive">{sizeError}</p>}
        </div>
      )}

      {tab === 'svg' && (
        <div className="space-y-2">
          <textarea
            value={svgInput}
            onChange={handleSvgChange}
            rows={6}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
          />
          {svgInput.trim().startsWith('<svg') && (
            <div className="relative rounded-xl border border-border p-4 bg-muted/30 flex items-center justify-center">
              <div
                className="h-16 w-16 text-foreground [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svgInput }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
