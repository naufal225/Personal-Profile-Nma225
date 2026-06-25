import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import { adminGetEducation, adminUpdateEducationWithFile } from '../../api/educations'
import { FormShell, FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'

const schema = z.object({
  institution: z.string().min(1, 'Institusi wajib diisi'),
  major: z.string().optional().default(''),
  description: z.string().optional().default(''),
  start_year: z.coerce.number().int().min(1900).max(2100),
  end_year: z.union([z.coerce.number().int().min(1900).max(2100), z.literal('').transform(() => null)]).optional().nullable(),
  icon: z.any().optional(),
})

export default function EducationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { icon: null },
  })
  const { field: iconField } = useController({ name: 'icon', control, defaultValue: null })

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
          icon: d.icon ? { mode: 'url', url: d.icon } : null,
        })
      })
      .catch(() => toast.error('Gagal memuat pendidikan'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('institution', data.institution)
      fd.append('major', data.major || '')
      fd.append('description', data.description || '')
      fd.append('start_year', data.start_year)
      fd.append('end_year', data.end_year || '')
      if (data.icon?.mode === 'file') fd.append('icon_file', data.icon.file)
      else if (data.icon?.mode === 'url') fd.append('icon_url', data.icon.url)

      await adminUpdateEducationWithFile(id, fd)
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
      aside={
        <AsideCard title="Icon (opsional)">
          <ImageUpload value={iconField.value} onChange={iconField.onChange} />
          <p className="hint" style={{ marginTop: 10 }}>Logo institusi. Kosongkan untuk memakai icon bawaan.</p>
        </AsideCard>
      }
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
