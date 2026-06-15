import { useState, useRef, useEffect } from 'react'
import { UploadCloud, Code2, X } from 'lucide-react'

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB

export default function IconInput({ value, onChange }) {
  const [tab, setTab] = useState(value?.mode === 'svg' ? 'svg' : 'file')
  const [svg, setSvg] = useState(value?.mode === 'svg' ? value.svg : '')
  const [drag, setDrag] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (value?.mode === 'svg' && value.svg !== svg) setSvg(value.svg)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const filePreview =
    value?.mode === 'file' && value.file ? URL.createObjectURL(value.file)
    : value?.mode === 'url' ? value.url
    : null

  const handleFile = (file) => {
    if (!file) return
    if (file.size > MAX_BYTES) { setErr(`Terlalu besar (maks 2 MB). File Anda: ${(file.size / 1048576).toFixed(1)} MB`); return }
    setErr('')
    onChange({ mode: 'file', file })
  }

  const clear = () => {
    onChange(null)
    setSvg('')
    setErr('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <div className="upload-tabs">
        <button type="button" className={tab === 'file' ? 'active' : ''} onClick={() => setTab('file')}><UploadCloud size={14} /> Gambar</button>
        <button type="button" className={tab === 'svg' ? 'active' : ''} onClick={() => setTab('svg')}><Code2 size={14} /> SVG</button>
      </div>

      {tab === 'file' ? (
        filePreview ? (
          <div className="upload-preview">
            <img src={filePreview} alt="Pratinjau" />
            <button type="button" className="upload-x" onClick={clear} aria-label="Hapus"><X size={15} /></button>
          </div>
        ) : (
          <div
            className={`upload${drag ? ' drag' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f && f.type.startsWith('image/')) handleFile(f) }}
          >
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
            <UploadCloud />
            <div className="u-t">Jatuhkan ikon atau klik untuk memilih</div>
            <div className="u-s">PNG, SVG, WebP — maks 2 MB</div>
            {err && <div className="u-s" style={{ color: 'var(--danger)' }}>{err}</div>}
          </div>
        )
      ) : (
        <div>
          <textarea
            className="textarea input-mono"
            rows={6}
            value={svg}
            onChange={(e) => { const v = e.target.value; setSvg(v); v.trim() ? onChange({ mode: 'svg', svg: v }) : onChange(null) }}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
          />
          {svg.trim().startsWith('<svg') && (
            <div className="upload-preview" style={{ marginTop: 10 }}>
              <div className="svgbox" dangerouslySetInnerHTML={{ __html: svg }} />
              <button type="button" className="upload-x" onClick={clear} aria-label="Hapus"><X size={15} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
