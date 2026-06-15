import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import { adminGetContact, adminUpdateContact } from '../../api/contacts'
import { FormShell, FormCard, FormSection } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  type: z.string().min(1, 'Tipe wajib diisi'),
  label: z.string().min(1, 'Label wajib diisi'),
  value: z.string().min(1, 'Nilai wajib diisi'),
  url: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
})

const TYPES = ['email', 'phone', 'github', 'linkedin', 'twitter', 'instagram', 'whatsapp', 'website', 'other']

export default function ContactEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    adminGetContact(id)
      .then((r) => {
        const d = r.data.data
        reset({
          type: d.type ?? 'email',
          label: d.label ?? '',
          value: d.value ?? '',
          url: d.url ?? '',
          order: d.order ?? 0,
        })
      })
      .catch(() => toast.error('Gagal memuat kontak'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      await adminUpdateContact(id, { ...data, url: data.url || null })
      toast.success('Kontak diperbarui')
      navigate(`/contacts/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 320 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Kontak"
      backTo={`/contacts/${id}`}
      cancelTo={`/contacts/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={Mail} title="Detail Kontak">
          <FormField label="Tipe" error={errors.type?.message} required>
            <select {...register('type')} className="select">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Urutan" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} />
          </FormField>
          <FormField className="full" label="Label" error={errors.label?.message} required>
            <input {...register('label')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Nilai" error={errors.value?.message} required>
            <input {...register('value')} className={inputCls} />
          </FormField>
          <FormField className="full" label="URL" error={errors.url?.message}>
            <input {...register('url')} type="url" className={inputCls} />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
