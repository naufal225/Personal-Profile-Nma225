import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetSkill, adminDeleteSkill } from '../../api/skills'
import { FormCard, FormSection } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailLoading, DetailNotFound } from '../../components/ui/Detail'
import IconDisplay from '../../components/ui/IconDisplay'

export default function SkillShow() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetSkill(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Gagal memuat skill'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!item) return <DetailNotFound message="Skill tidak ditemukan." backTo="/skills" />

  return (
    <DetailShell
      title={item.name}
      backTo="/skills"
      editTo={`/skills/${id}/edit`}
      deleteFn={() => adminDeleteSkill(id)}
      redirectTo="/skills"
      deleteTitle="Hapus skill?"
      deleteDescription={`"${item.name}" akan dihapus secara permanen.`}
      aside={
        <div className="card aside-card">
          <div className="aside-h">Icon</div>
          <div className="detail-icon"><IconDisplay icon={item.icon} alt={item.name} /></div>
        </div>
      }
    >
      <FormCard>
        <FormSection icon={Code2} title="Detail Skill" plain>
          <MetaRow k="Nama" v={item.name} />
          <MetaRow k="Kategori" v={item.category ? <span className="badge neutral">{item.category}</span> : '—'} />
          <MetaRow k="Urutan" v={item.order ?? 0} />
        </FormSection>
      </FormCard>
    </DetailShell>
  )
}
