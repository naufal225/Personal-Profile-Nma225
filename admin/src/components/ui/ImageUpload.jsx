import { useState, useRef } from 'react'
import { UploadCloud, Link2, X } from 'lucide-react'

const MAX_BYTES = 4 * 1024 * 1024 // 4 MB

export default function ImageUpload({ value, onChange }) {
  const initialTab = value?.mode === 'url' || typeof value === 'string' ? 'url' : 'file'
  const [tab, setTab] = useState(initialTab)
  const [urlInput, setUrlInput] = useState(value?.mode === 'url' ? value.url : (typeof value === 'string' ? value : ''))
  const [drag, setDrag] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef(null)

  const preview =
    value?.mode === 'file' && value.file ? URL.createObjectURL(value.file)
    : value?.mode === 'url' ? value.url
    : (typeof value === 'string' ? value : null)

  const handleFile = (file) => {
    if (!file) return
    if (file.size > MAX_BYTES) { setErr(`Terlalu besar (maks 4 MB). File Anda: ${(file.size / 1048576).toFixed(1)} MB`); return }
    setErr('')
    onChange({ mode: 'file', file })
  }

  const clear = () => {
    onChange(null)
    setUrlInput('')
    setErr('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <div className="upload-tabs">
        <button type="button" className={tab === 'file' ? 'active' : ''} onClick={() => setTab('file')}><UploadCloud size={14} /> Upload</button>
        <button type="button" className={tab === 'url' ? 'active' : ''} onClick={() => setTab('url')}><Link2 size={14} /> URL</button>
      </div>

      {tab === 'file' ? (
        preview ? (
          <div className="upload-preview">
            <img src={preview} alt="Pratinjau" onError={(e) => { e.currentTarget.style.display = 'none' }} />
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
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/jpg" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
            <UploadCloud />
            <div className="u-t">Jatuhkan gambar atau klik untuk memilih</div>
            <div className="u-s">JPG, PNG, WebP — maks 4 MB</div>
            {err && <div className="u-s" style={{ color: 'var(--danger)' }}>{err}</div>}
          </div>
        )
      ) : (
        <div>
          <input
            className="input"
            type="url"
            placeholder="https://contoh.com/gambar.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onBlur={() => (urlInput ? onChange({ mode: 'url', url: urlInput }) : onChange(null))}
          />
          {preview && (
            <div className="upload-preview" style={{ marginTop: 10 }}>
              <img src={preview} alt="Pratinjau" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <button type="button" className="upload-x" onClick={clear} aria-label="Hapus"><X size={15} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
