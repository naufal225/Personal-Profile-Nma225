import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Award, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetCertificate, adminDeleteCertificate } from '../../api/certificates'
import { FormCard, FormSection } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailBlock, DetailLoading, DetailNotFound } from '../../components/ui/Detail'

export default function CertificateShow() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetCertificate(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Gagal memuat sertifikat'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!item) return <DetailNotFound message="Sertifikat tidak ditemukan." backTo="/certificates" />

  return (
    <DetailShell
      title={item.title}
      backTo="/certificates"
      editTo={`/certificates/${id}/edit`}
      deleteFn={() => adminDeleteCertificate(id)}
      redirectTo="/certificates"
      deleteTitle="Hapus sertifikat?"
      deleteDescription={`"${item.title}" akan dihapus secara permanen.`}
    >
      <FormCard>
        <FormSection icon={Award} title="Detail Sertifikat" plain>
          <MetaRow k="Penerbit" v={item.issuer} />
          <MetaRow k="Tahun" v={<span className="tag-mono">{item.year}</span>} />
          <MetaRow k="Tipe" v={<span className={`badge ${item.type || 'neutral'}`}>{item.type}</span>} />
          {item.credential_url && (
            <div style={{ marginTop: 16 }}>
              <DetailBlock label="Kredensial">
                <a className="detail-link" href={item.credential_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Lihat kredensial</a>
              </DetailBlock>
            </div>
          )}
        </FormSection>
      </FormCard>
    </DetailShell>
  )
}
