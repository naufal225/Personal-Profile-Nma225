import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import { adminCreateContact } from '../../api/contacts'
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

export default function ContactCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'email', label: '', value: '', url: '', order: 0 },
  })

  const onSubmit = async (data) => {
    try {
      const res = await adminCreateContact({ ...data, url: data.url || null })
      toast.success('Kontak dibuat')
      navigate(`/contacts/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal membuat kontak')
    }
  }

  return (
    <FormShell
      title="Kontak Baru"
      subtitle="Tambahkan cara orang menghubungi Anda."
      backTo="/contacts"
      cancelTo="/contacts"
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Buat Kontak"
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
            <input {...register('order')} type="number" className={inputCls} placeholder="0" />
          </FormField>
          <FormField className="full" label="Label" error={errors.label?.message} required description="Nama ramah yang ditampilkan ke pengunjung.">
            <input {...register('label')} className={inputCls} placeholder="Email" />
          </FormField>
          <FormField className="full" label="Nilai" error={errors.value?.message} required description="Info kontak sebenarnya (email, username, dll).">
            <input {...register('value')} className={inputCls} placeholder="hello@example.com" />
          </FormField>
          <FormField className="full" label="URL" error={errors.url?.message} description="Tautan yang bisa diklik (mailto:, https:, tel:).">
            <input {...register('url')} type="url" className={inputCls} placeholder="mailto:hello@example.com" />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
