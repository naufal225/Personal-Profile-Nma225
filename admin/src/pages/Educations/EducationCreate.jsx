import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import { adminCreateEducation } from '../../api/educations'
import { FormShell, FormCard, FormSection } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  institution: z.string().min(1, 'Institusi wajib diisi'),
  major: z.string().optional().default(''),
  description: z.string().optional().default(''),
  start_year: z.coerce.number().int().min(1900, 'Tahun tidak valid').max(2100, 'Tahun tidak valid'),
  end_year: z.union([z.coerce.number().int().min(1900).max(2100), z.literal('').transform(() => null)]).optional().nullable(),
})

export default function EducationCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { institution: '', major: '', description: '', start_year: '', end_year: '' },
  })

  const onSubmit = async (data) => {
    try {
      const res = await adminCreateEducation({
        institution: data.institution,
        major: data.major || null,
        description: data.description || null,
        start_year: Number(data.start_year),
        end_year: data.end_year ? Number(data.end_year) : null,
      })
      toast.success('Pendidikan dibuat')
      navigate(`/educations/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal membuat pendidikan')
    }
  }

  return (
    <FormShell
      title="Pendidikan Baru"
      subtitle="Tambahkan riwayat sekolah atau gelar."
      backTo="/educations"
      cancelTo="/educations"
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Buat Pendidikan"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={GraduationCap} title="Detail Pendidikan">
          <FormField className="full" label="Institusi" error={errors.institution?.message} required>
            <input {...register('institution')} className={inputCls} placeholder="Politeknik Negeri Jakarta" />
          </FormField>
          <FormField className="full" label="Jurusan / Bidang" error={errors.major?.message}>
            <input {...register('major')} className={inputCls} placeholder="Teknik Informatika" />
          </FormField>
          <FormField className="full" label="Deskripsi" error={errors.description?.message} description="Pencapaian, IPK, kegiatan…">
            <textarea {...register('description')} rows={3} className="textarea" />
          </FormField>
          <FormField label="Tahun Mulai" error={errors.start_year?.message} required>
            <input {...register('start_year')} type="number" min="1900" max="2100" className={inputCls} placeholder="2020" />
          </FormField>
          <FormField label="Tahun Selesai" error={errors.end_year?.message} description="Kosong = sekarang.">
            <input {...register('end_year')} type="number" min="1900" max="2100" className={inputCls} placeholder="2024" />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
