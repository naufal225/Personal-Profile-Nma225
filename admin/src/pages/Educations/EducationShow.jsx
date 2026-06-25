import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetEducation, adminDeleteEducation } from '../../api/educations'
import { FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailBlock, DetailLoading, DetailNotFound } from '../../components/ui/Detail'
import { formatYear } from '../../utils/formatDate'

export default function EducationShow() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetEducation(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Gagal memuat pendidikan'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!item) return <DetailNotFound message="Pendidikan tidak ditemukan." backTo="/educations" />

  return (
    <DetailShell
      title={item.institution}
      backTo="/educations"
      editTo={`/educations/${id}/edit`}
      deleteFn={() => adminDeleteEducation(id)}
      redirectTo="/educations"
      deleteTitle="Hapus pendidikan?"
      deleteDescription={`"${item.institution}" akan dihapus secara permanen.`}
      aside={
        item.icon ? (
          <AsideCard title="Icon">
            <div className="detail-icon"><img src={item.icon} alt={item.institution} /></div>
          </AsideCard>
        ) : null
      }
    >
      <FormCard>
        <FormSection icon={GraduationCap} title="Detail Pendidikan" plain>
          {item.major && <MetaRow k="Jurusan" v={item.major} />}
          <MetaRow k="Periode" v={`${formatYear(item.start_year)} — ${formatYear(item.end_year)}`} />
          {item.description && (
            <div style={{ marginTop: 16 }}><DetailBlock label="Deskripsi">{item.description}</DetailBlock></div>
          )}
        </FormSection>
      </FormCard>
    </DetailShell>
  )
}
