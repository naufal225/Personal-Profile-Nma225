import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Wrench, Layers } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetService, adminUpdateService } from '../../api/services'
import { FormShell, FormCard, FormSection, Switch } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  icon: z.string().min(1, 'Icon/slug wajib diisi'),
  order: z.coerce.number().int().default(0),
})

const DEFAULT_TIER = { name: '', price: '', recommended: false, note: '', features: '' }

function tiersFromMetadata(metadata) {
  if (!metadata?.tiers?.length) return [{ ...DEFAULT_TIER }]
  return metadata.tiers.map((t) => ({
    name: t.name ?? '',
    price: t.price ?? '',
    recommended: t.recommended ?? false,
    note: t.note ?? '',
    features: Array.isArray(t.features) ? t.features.join('\n') : (t.features ?? ''),
  }))
}

export default function ServiceEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)
  const [tiers, setTiers] = useState([{ ...DEFAULT_TIER }])

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    adminGetService(id)
      .then((r) => {
        const d = r.data.data
        reset({ title: d.title ?? '', description: d.description ?? '', icon: d.icon ?? '', order: d.order ?? 0 })
        setTiers(tiersFromMetadata(d.metadata))
      })
      .catch(() => toast.error('Gagal memuat layanan'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const addTier = () => setTiers((p) => [...p, { ...DEFAULT_TIER }])
  const removeTier = (i) => setTiers((p) => p.filter((_, idx) => idx !== i))
  const updateTier = (i, field, value) => setTiers((p) => p.map((t, idx) => idx === i ? { ...t, [field]: value } : t))

  const onSubmit = async (data) => {
    try {
      const metadata = {
        tiers: tiers.filter((t) => t.name.trim()).map((t) => ({
          name: t.name.trim(),
          price: t.price.trim(),
          recommended: t.recommended,
          note: t.note.trim(),
          features: t.features.split('\n').map((f) => f.trim()).filter(Boolean),
        })),
      }
      await adminUpdateService(id, { ...data, metadata })
      toast.success('Layanan diperbarui')
      navigate(`/services/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 420 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Layanan"
      backTo={`/services/${id}`}
      cancelTo={`/services/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={Wrench} title="Detail Layanan">
          <FormField className="full" label="Judul (Label Kategori)" error={errors.title?.message} required>
            <input {...register('title')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Deskripsi" error={errors.description?.message} required>
            <textarea {...register('description')} rows={2} className="textarea" />
          </FormField>
          <FormField label="Icon / Slug" error={errors.icon?.message} required>
            <input {...register('icon')} className={inputCls} />
          </FormField>
          <FormField label="Urutan" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} />
          </FormField>
        </FormSection>

        <FormSection icon={Layers} title="Paket Harga" sub="Tiap paket tampil sebagai kartu harga di portfolio." plain>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addTier}><Plus size={14} /> Tambah Paket</button>
          </div>
          {tiers.map((tier, i) => (
            <div key={i} className="subcard">
              <div className="subcard-head">
                <span className="st">Paket {i + 1}</span>
                {tiers.length > 1 && (
                  <button type="button" className="icon-del" onClick={() => removeTier(i)} aria-label="Hapus paket"><Trash2 size={15} /></button>
                )}
              </div>
              <div className="fgrid">
                <FormField label="Nama">
                  <input value={tier.name} onChange={(e) => updateTier(i, 'name', e.target.value)} className={inputCls} placeholder="Basic" />
                </FormField>
                <FormField label="Harga">
                  <input value={tier.price} onChange={(e) => updateTier(i, 'price', e.target.value)} className={inputCls} placeholder="Rp3.000.000" />
                </FormField>
                <FormField className="full" label="Catatan">
                  <input value={tier.note} onChange={(e) => updateTier(i, 'note', e.target.value)} className={inputCls} />
                </FormField>
                <FormField className="full" label="Fitur" description="Satu fitur per baris.">
                  <textarea value={tier.features} onChange={(e) => updateTier(i, 'features', e.target.value)} rows={4} className="textarea" />
                </FormField>
              </div>
              <div className="check-row" style={{ marginTop: 12 }}>
                <Switch checked={tier.recommended} onChange={(v) => updateTier(i, 'recommended', v)} />
                <span>Tandai sebagai Rekomendasi</span>
              </div>
            </div>
          ))}
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
