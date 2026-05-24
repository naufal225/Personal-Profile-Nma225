import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetProject, adminUpdateProjectWithFile } from '../../api/projects'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import SkillsSelector from '../../components/ui/SkillsSelector'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
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

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
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
      .catch(() => toast.error('Failed to load project'))
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
      toast.success('Project updated')
      navigate(`/projects/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={`/projects/${id}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Title" error={errors.title?.message} required>
            <input {...register('title')} className={errors.title ? inputCls + ' border-destructive' : inputCls} />
          </FormField>

          <FormField label="Description" error={errors.description?.message} required>
            <textarea {...register('description')} rows={4} className={errors.description ? inputCls + ' border-destructive' : inputCls} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="GitHub URL">
              <input {...register('github_url')} className={inputCls} type="url" />
            </FormField>
            <FormField label="Demo URL">
              <input {...register('demo_url')} className={inputCls} type="url" />
            </FormField>
          </div>

          <FormField label="Display Order">
            <input {...register('order')} type="number" className={inputCls} style={{ width: '100px' }} />
          </FormField>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-3">Tech Stacks</p>
          <SkillsSelector
            value={techStacksField.value}
            onChange={techStacksField.onChange}
            error={errors.tech_stacks?.message}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-3">Thumbnail Image</p>
          <ImageUpload value={thumbnailField.value} onChange={thumbnailField.onChange} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to={`/projects/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
