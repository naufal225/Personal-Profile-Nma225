import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { adminGetSkills } from '../../api/skills'

export default function SkillsSelector({ value = [], onChange }) {
  const [all, setAll] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    adminGetSkills().then((r) => setAll(r.data.data ?? [])).catch(() => {})
  }, [])

  const selected = new Set(value)
  const toggle = (name) =>
    selected.has(name) ? onChange(value.filter((s) => s !== name)) : onChange([...value, name])

  const addCustom = () => {
    const t = input.trim()
    if (!t || selected.has(t)) { setInput(''); return }
    onChange([...value, t])
    setInput('')
  }

  const grouped = all.reduce((acc, s) => {
    const cat = s.category || 'Lainnya'
    ;(acc[cat] ||= []).push(s)
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="tag-input">
        {value.length === 0 && <span className="tag-empty">Belum ada skill dipilih.</span>}
        {value.map((name) => (
          <span key={name} className="tag-pill">
            {name}
            <button type="button" onClick={() => toggle(name)} aria-label={`Hapus ${name}`}><X size={12} /></button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          placeholder="Ketik skill lalu Enter…"
        />
      </div>

      {Object.keys(grouped).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="form-section-sub" style={{ margin: 0 }}>Pilih dari skill yang sudah ada:</span>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {items.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip-pick${selected.has(s.name) ? ' sel' : ''}`}
                  onClick={() => toggle(s.name)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
