import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Award } from 'lucide-react'
import { adminGetCertificate, adminUpdateCertificate } from '../../api/certificates'
import { FormShell, FormCard, FormSection } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  issuer: z.string().min(1, 'Penerbit wajib diisi'),
  year: z.coerce.number().int().min(1900).max(2100),
  type: z.enum(['training', 'achievement', 'competition']),
  credential_url: z.string().optional().default(''),
})

export default function CertificateEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    adminGetCertificate(id)
      .then((r) => {
        const d = r.data.data
        reset({
          title: d.title ?? '',
          issuer: d.issuer ?? '',
          year: d.year ?? new Date().getFullYear(),
          type: d.type ?? 'training',
          credential_url: d.credential_url ?? '',
        })
      })
      .catch(() => toast.error('Gagal memuat sertifikat'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      await adminUpdateCertificate(id, {
        title: data.title,
        issuer: data.issuer,
        year: Number(data.year),
        type: data.type,
        credential_url: data.credential_url || null,
      })
      toast.success('Sertifikat diperbarui')
      navigate(`/certificates/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 320 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Sertifikat"
      backTo={`/certificates/${id}`}
      cancelTo={`/certificates/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={Award} title="Detail Sertifikat">
          <FormField className="full" label="Judul" error={errors.title?.message} required>
            <input {...register('title')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Penerbit" error={errors.issuer?.message} required>
            <input {...register('issuer')} className={inputCls} />
          </FormField>
          <FormField label="Tahun" error={errors.year?.message} required>
            <input {...register('year')} type="number" min="1900" max="2100" className={inputCls} />
          </FormField>
          <FormField label="Tipe" error={errors.type?.message} required>
            <select {...register('type')} className="select">
              <option value="training">Pelatihan</option>
              <option value="achievement">Prestasi</option>
              <option value="competition">Kompetisi</option>
            </select>
          </FormField>
          <FormField className="full" label="URL Kredensial" error={errors.credential_url?.message}>
            <input {...register('credential_url')} type="url" className={inputCls} />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
