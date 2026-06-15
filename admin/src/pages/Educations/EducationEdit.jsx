import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import { adminGetEducation, adminUpdateEducation } from '../../api/educations'
import { FormShell, FormCard, FormSection } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'

const schema = z.object({
  institution: z.string().min(1, 'Institusi wajib diisi'),
  major: z.string().optional().default(''),
  description: z.string().optional().default(''),
  start_year: z.coerce.number().int().min(1900).max(2100),
  end_year: z.union([z.coerce.number().int().min(1900).max(2100), z.literal('').transform(() => null)]).optional().nullable(),
})

export default function EducationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    adminGetEducation(id)
      .then((r) => {
        const d = r.data.data
        reset({
          institution: d.institution ?? '',
          major: d.major ?? '',
          description: d.description ?? '',
          start_year: d.start_year ?? '',
          end_year: d.end_year ?? '',
        })
      })
      .catch(() => toast.error('Gagal memuat pendidikan'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      await adminUpdateEducation(id, {
        institution: data.institution,
        major: data.major || null,
        description: data.description || null,
        start_year: Number(data.start_year),
        end_year: data.end_year ? Number(data.end_year) : null,
      })
      toast.success('Pendidikan diperbarui')
      navigate(`/educations/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 320 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Pendidikan"
      backTo={`/educations/${id}`}
      cancelTo={`/educations/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={GraduationCap} title="Detail Pendidikan">
          <FormField className="full" label="Institusi" error={errors.institution?.message} required>
            <input {...register('institution')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Jurusan / Bidang" error={errors.major?.message}>
            <input {...register('major')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Deskripsi" error={errors.description?.message}>
            <textarea {...register('description')} rows={3} className="textarea" />
          </FormField>
          <FormField label="Tahun Mulai" error={errors.start_year?.message} required>
            <input {...register('start_year')} type="number" min="1900" max="2100" className={inputCls} />
          </FormField>
          <FormField label="Tahun Selesai" error={errors.end_year?.message} description="Kosong = sekarang.">
            <input {...register('end_year')} type="number" min="1900" max="2100" className={inputCls} />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
