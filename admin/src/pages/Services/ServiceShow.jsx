import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Wrench, Layers, Check } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetService, adminDeleteService } from '../../api/services'
import { FormCard, FormSection } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailBlock, DetailLoading, DetailNotFound } from '../../components/ui/Detail'

export default function ServiceShow() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetService(id)
      .then((r) => setItem(r.data.data))
      .catch(() => toast.error('Gagal memuat layanan'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!item) return <DetailNotFound message="Layanan tidak ditemukan." backTo="/services" />

  const tiers = Array.isArray(item.metadata?.tiers) ? item.metadata.tiers : []

  return (
    <DetailShell
      title={item.title}
      backTo="/services"
      editTo={`/services/${id}/edit`}
      deleteFn={() => adminDeleteService(id)}
      redirectTo="/services"
      deleteTitle="Hapus layanan?"
      deleteDescription={`"${item.title}" akan dihapus secara permanen.`}
    >
      <FormCard>
        <FormSection icon={Wrench} title="Detail Layanan" plain>
          {item.description && <DetailBlock label="Deskripsi">{item.description}</DetailBlock>}
          <div style={{ marginTop: 18 }}>
            <MetaRow k="Icon / Slug" v={<span className="tag-mono">{item.icon || '—'}</span>} />
            <MetaRow k="Urutan" v={item.order ?? 0} />
          </div>
        </FormSection>

        {tiers.length > 0 && (
          <FormSection icon={Layers} title="Paket Harga" plain>
            {tiers.map((tier, i) => (
              <div key={i} className={`tier-view${tier.recommended ? ' rec' : ''}`}>
                <div className="tier-view-head">
                  <span className="tn">{tier.name}</span>
                  <span className="tp">{tier.price}</span>
                </div>
                {tier.recommended && <span className="badge featured">Rekomendasi</span>}
                {tier.note && <p className="tnote">{tier.note}</p>}
                {Array.isArray(tier.features) && tier.features.length > 0 && (
                  <ul className="tier-feats-view">
                    {tier.features.map((f, idx) => <li key={idx}><Check size={14} /> {f}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </FormSection>
        )}
      </FormCard>
    </DetailShell>
  )
}
