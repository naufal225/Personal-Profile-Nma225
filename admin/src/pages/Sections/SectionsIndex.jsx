import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { adminGetSections, adminUpdateSection } from '../../api/sections'
import PageHeader from '../../components/ui/PageHeader'
import { Switch } from '../../components/ui/Form'

export default function SectionsIndex() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetSections()
      .then((r) => setSections(r.data.data ?? []))
      .catch(() => toast.error('Gagal memuat sections'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (section, value) => {
    // optimistic
    setSections((list) => list.map((s) => (s.id === section.id ? { ...s, is_active: value } : s)))
    try {
      await adminUpdateSection(section.id, { is_active: value })
      toast.success(`Section "${section.label}" ${value ? 'ditampilkan' : 'disembunyikan'}`)
    } catch {
      // revert
      setSections((list) => list.map((s) => (s.id === section.id ? { ...s, is_active: !value } : s)))
      toast.error('Gagal memperbarui section')
    }
  }

  return (
    <>
      <PageHeader
        title="Sections"
        description="Aktif/nonaktifkan section di halaman publik. Section yang dinonaktifkan tidak akan tampil (termasuk link navigasinya)."
      />

      {loading ? (
        <div className="card" style={{ height: 320 }}><div className="skeleton" style={{ height: '100%' }} /></div>
      ) : (
        <div className="card card-pad" style={{ maxWidth: 640 }}>
          {sections.map((s) => (
            <div className="toggle-row" key={s.id}>
              <div>
                <div className="tt">{s.label}</div>
                <div className="ts" style={{ fontFamily: 'var(--font-mono)' }}>/{s.key}</div>
              </div>
              <Switch checked={s.is_active} onChange={(v) => toggle(s, v)} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
