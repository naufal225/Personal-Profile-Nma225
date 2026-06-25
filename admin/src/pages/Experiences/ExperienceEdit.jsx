import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Briefcase, Tags } from 'lucide-react'
import { adminGetExperience, adminUpdateExperienceWithFile } from '../../api/experiences'
import { FormShell, FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import SkillsSelector from '../../components/ui/SkillsSelector'
import ImageUpload from '../../components/ui/ImageUpload'

const schema = z.object({
  title: z.string().min(1, 'Posisi wajib diisi'),
  organization: z.string().min(1, 'Organisasi wajib diisi'),
  description: z.string().optional().default(''),
  skills: z.array(z.string()).min(1, 'Minimal satu skill'),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().optional().default(''),
  icon: z.any().optional(),
})

function toDateInput(value) {
  if (!value) return ''
  return value.slice(0, 10)
}

export default function ExperienceEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { icon: null },
  })
  const { field: skillsField } = useController({ name: 'skills', control, defaultValue: [] })
  const { field: iconField } = useController({ name: 'icon', control, defaultValue: null })

  useEffect(() => {
    adminGetExperience(id)
      .then((r) => {
        const d = r.data.data
        reset({
          title: d.title ?? '',
          organization: d.organization ?? '',
          description: d.description ?? '',
          skills: Array.isArray(d.skills) ? d.skills : [],
          start_date: toDateInput(d.start_date),
          end_date: toDateInput(d.end_date),
          icon: d.icon ? { mode: 'url', url: d.icon } : null,
        })
      })
      .catch(() => toast.error('Gagal memuat pengalaman'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('title', data.title)
      fd.append('organization', data.organization)
      fd.append('description', data.description || '')
      data.skills.forEach((s) => fd.append('skills[]', s))
      fd.append('start_date', data.start_date)
      fd.append('end_date', data.end_date || '')
      if (data.icon?.mode === 'file') fd.append('icon_file', data.icon.file)
      else if (data.icon?.mode === 'url') fd.append('icon_url', data.icon.url)

      await adminUpdateExperienceWithFile(id, fd)
      toast.success('Pengalaman diperbarui')
      navigate(`/experiences/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 360 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Pengalaman"
      backTo={`/experiences/${id}`}
      cancelTo={`/experiences/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
      aside={
        <AsideCard title="Icon (opsional)">
          <ImageUpload value={iconField.value} onChange={iconField.onChange} />
          <p className="hint" style={{ marginTop: 10 }}>Logo perusahaan / instansi. Kosongkan untuk memakai icon bawaan.</p>
        </AsideCard>
      }
    >
      <FormCard>
        <FormSection icon={Briefcase} title="Detail Pengalaman">
          <FormField className="full" label="Posisi / Jabatan" error={errors.title?.message} required>
            <input {...register('title')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Organisasi" error={errors.organization?.message} required>
            <input {...register('organization')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Deskripsi" error={errors.description?.message}>
            <textarea {...register('description')} rows={4} className="textarea" />
          </FormField>
          <FormField label="Tanggal Mulai" error={errors.start_date?.message} required>
            <input {...register('start_date')} type="date" className={inputCls} />
          </FormField>
          <FormField label="Tanggal Selesai" error={errors.end_date?.message} description="Kosong = sekarang.">
            <input {...register('end_date')} type="date" className={inputCls} />
          </FormField>
        </FormSection>

        <FormSection icon={Tags} title="Skill yang Digunakan" plain>
          {errors.skills && <p className="hint" style={{ color: 'var(--danger)', marginBottom: 10 }}>{errors.skills.message}</p>}
          <SkillsSelector value={skillsField.value} onChange={skillsField.onChange} />
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
