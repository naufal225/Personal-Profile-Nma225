import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Mail, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetContact, adminDeleteContact } from '../../api/contacts'
import { FormCard, FormSection } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailBlock, DetailLoading, DetailNotFound } from '../../components/ui/Detail'

export default function ContactShow() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetContact(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Gagal memuat kontak'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!item) return <DetailNotFound message="Kontak tidak ditemukan." backTo="/contacts" />

  return (
    <DetailShell
      title={item.label}
      backTo="/contacts"
      editTo={`/contacts/${id}/edit`}
      deleteFn={() => adminDeleteContact(id)}
      redirectTo="/contacts"
      deleteTitle="Hapus kontak?"
      deleteDescription={`"${item.label}" akan dihapus secara permanen.`}
    >
      <FormCard>
        <FormSection icon={Mail} title="Detail Kontak" plain>
          <MetaRow k="Tipe" v={<span className="badge neutral">{item.type}</span>} />
          <MetaRow k="Label" v={item.label} />
          <MetaRow k="Urutan" v={item.order ?? 0} />
          <div style={{ marginTop: 16 }}>
            <DetailBlock label="Nilai"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, wordBreak: 'break-all' }}>{item.value}</span></DetailBlock>
          </div>
          {item.url && (
            <div style={{ marginTop: 16 }}>
              <DetailBlock label="Tautan">
                <a className="detail-link" href={item.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Buka tautan</a>
              </DetailBlock>
            </div>
          )}
        </FormSection>
      </FormCard>
    </DetailShell>
  )
}
