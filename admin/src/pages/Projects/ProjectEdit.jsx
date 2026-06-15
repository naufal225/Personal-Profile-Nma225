import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Folder, Tags } from 'lucide-react'
import { adminGetProject, adminUpdateProjectWithFile } from '../../api/projects'
import { FormShell, FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import SkillsSelector from '../../components/ui/SkillsSelector'

const schema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  tech_stacks: z.array(z.string()).default([]),
  github_url: z.string().optional().default(''),
  demo_url: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
  thumbnail: z.any().optional(),
})

export default function ProjectEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
  })
  const { field: thumbnailField } = useController({ name: 'thumbnail', control, defaultValue: null })
  const { field: techStacksField } = useController({ name: 'tech_stacks', control, defaultValue: [] })

  useEffect(() => {
    adminGetProject(id)
      .then((r) => {
        const p = r.data.data
        reset({
          title: p.title ?? '',
          description: p.description ?? '',
          tech_stacks: Array.isArray(p.tech_stacks) ? p.tech_stacks : [],
          github_url: p.github_url ?? '',
          demo_url: p.demo_url ?? '',
          order: p.order ?? 0,
          thumbnail: p.thumbnail_path ? { mode: 'url', url: p.thumbnail_path } : null,
        })
      })
      .catch(() => toast.error('Gagal memuat proyek'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('title', data.title)
      fd.append('description', data.description)
      data.tech_stacks.forEach((t) => fd.append('tech_stacks[]', t))
      if (data.github_url) fd.append('github_url', data.github_url)
      if (data.demo_url) fd.append('demo_url', data.demo_url)
      fd.append('order', data.order ?? 0)
      if (data.thumbnail?.mode === 'file') fd.append('thumbnail_file', data.thumbnail.file)
      else if (data.thumbnail?.mode === 'url') fd.append('thumbnail_url', data.thumbnail.url)

      await adminUpdateProjectWithFile(id, fd)
      toast.success('Proyek diperbarui')
      navigate(`/projects/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 360 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Proyek"
      backTo={`/projects/${id}`}
      cancelTo={`/projects/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
      aside={
        <AsideCard title="Thumbnail">
          <ImageUpload value={thumbnailField.value} onChange={thumbnailField.onChange} />
        </AsideCard>
      }
    >
      <FormCard>
        <FormSection icon={Folder} title="Detail Proyek">
          <FormField className="full" label="Judul" error={errors.title?.message} required>
            <input {...register('title')} className={inputCls} />
          </FormField>
          <FormField className="full" label="Deskripsi" error={errors.description?.message} required>
            <textarea {...register('description')} rows={4} className="textarea" />
          </FormField>
          <FormField label="GitHub URL" error={errors.github_url?.message}>
            <input {...register('github_url')} className={inputCls} type="url" />
          </FormField>
          <FormField label="Demo URL" error={errors.demo_url?.message}>
            <input {...register('demo_url')} className={inputCls} type="url" />
          </FormField>
          <FormField label="Urutan" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} />
          </FormField>
        </FormSection>

        <FormSection icon={Tags} title="Tech Stack" sub="Teknologi yang digunakan pada proyek ini." plain>
          <SkillsSelector value={techStacksField.value} onChange={techStacksField.onChange} />
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
