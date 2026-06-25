import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetExperience, adminDeleteExperience } from '../../api/experiences'
import { FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailBlock, DetailLoading, DetailNotFound } from '../../components/ui/Detail'
import { formatDate } from '../../utils/formatDate'

export default function ExperienceShow() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetExperience(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Gagal memuat pengalaman'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!item) return <DetailNotFound message="Pengalaman tidak ditemukan." backTo="/experiences" />

  const skills = Array.isArray(item.skills) ? item.skills : []

  return (
    <DetailShell
      title={item.title}
      backTo="/experiences"
      editTo={`/experiences/${id}/edit`}
      deleteFn={() => adminDeleteExperience(id)}
      redirectTo="/experiences"
      deleteTitle="Hapus pengalaman?"
      deleteDescription={`"${item.title}" akan dihapus secara permanen.`}
      aside={
        item.icon ? (
          <AsideCard title="Icon">
            <div className="detail-icon"><img src={item.icon} alt={item.organization} /></div>
          </AsideCard>
        ) : null
      }
    >
      <FormCard>
        <FormSection icon={Briefcase} title="Detail Pengalaman" plain>
          <MetaRow k="Organisasi" v={item.organization} />
          <MetaRow k="Periode" v={`${formatDate(item.start_date)} — ${formatDate(item.end_date)}`} />
          {item.description && (
            <div style={{ marginTop: 16 }}><DetailBlock label="Deskripsi">{item.description}</DetailBlock></div>
          )}
          {skills.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <DetailBlock label="Skills">
                <div className="tags-view">{skills.map((t) => <span key={t} className="tag-mono">{t}</span>)}</div>
              </DetailBlock>
            </div>
          )}
        </FormSection>
      </FormCard>
    </DetailShell>
  )
}
