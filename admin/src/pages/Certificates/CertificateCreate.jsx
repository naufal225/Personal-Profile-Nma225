import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Award } from 'lucide-react'
import { adminCreateCertificate } from '../../api/certificates'
import { FormShell, FormCard, FormSection } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  issuer: z.string().min(1, 'Penerbit wajib diisi'),
  year: z.coerce.number().int().min(1900).max(2100),
  type: z.enum(['training', 'achievement', 'competition']),
  credential_url: z.string().optional().default(''),
})

export default function CertificateCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', issuer: '', year: new Date().getFullYear(), type: 'training', credential_url: '' },
  })

  const onSubmit = async (data) => {
    try {
      const res = await adminCreateCertificate({
        title: data.title,
        issuer: data.issuer,
        year: Number(data.year),
        type: data.type,
        credential_url: data.credential_url || null,
      })
      toast.success('Sertifikat dibuat')
      navigate(`/certificates/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal membuat sertifikat')
    }
  }

  return (
    <FormShell
      title="Sertifikat Baru"
      subtitle="Catat kompetisi, pelatihan, atau prestasi."
      backTo="/certificates"
      cancelTo="/certificates"
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Buat Sertifikat"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={Award} title="Detail Sertifikat">
          <FormField className="full" label="Judul" error={errors.title?.message} required>
            <input {...register('title')} className={inputCls} placeholder="AWS Certified Solutions Architect" />
          </FormField>
          <FormField className="full" label="Penerbit" error={errors.issuer?.message} required>
            <input {...register('issuer')} className={inputCls} placeholder="Amazon Web Services" />
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
          <FormField className="full" label="URL Kredensial" error={errors.credential_url?.message} description="Tautan publik untuk verifikasi.">
            <input {...register('credential_url')} type="url" className={inputCls} placeholder="https://..." />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
