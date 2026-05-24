import { useEffect, useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetHero, adminUpdateHeroWithFile } from '../../api/hero'
import { Button } from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import FormField, { inputCls } from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  subheadline: z.string().min(1, 'Subheadline is required'),
  available_for_work: z.boolean().default(true),
  resume_url: z.string().optional().default(''),
  photo: z.any().optional(),
})

export default function HeroEditPage() {
  const [fetching, setFetching] = useState(true)

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: '', subheadline: '', available_for_work: true, resume_url: '', photo: null,
    },
  })
  const { field: photoField } = useController({ name: 'photo', control, defaultValue: null })

  useEffect(() => {
    adminGetHero()
      .then((r) => {
        const d = r.data.data
        if (d) {
          reset({
            headline: d.headline ?? '',
            subheadline: d.subheadline ?? '',
            available_for_work: d.available_for_work ?? true,
            resume_url: d.resume_url ?? '',
            photo: d.photo_path ? { mode: 'url', url: d.photo_path } : null,
          })
        }
      })
      .catch(() => toast.error('Failed to load hero content'))
      .finally(() => setFetching(false))
  }, [reset])

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('_method', 'PUT')
      fd.append('headline', data.headline)
      fd.append('subheadline', data.subheadline)
      fd.append('available_for_work', data.available_for_work ? '1' : '0')
      if (data.resume_url) fd.append('resume_url', data.resume_url)
      if (data.photo?.mode === 'file') fd.append('photo_file', data.photo.file)
      else if (data.photo?.mode === 'url') fd.append('photo_url', data.photo.url)

      await adminUpdateHeroWithFile(fd)
      toast.success('Hero content updated')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save')
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="w-40 h-8" />
        <Skeleton className="w-64 h-4" />
        <Skeleton className="w-full h-72 rounded-xl" />
        <Skeleton className="w-full h-48 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Hero Content"
        description="The first thing visitors see on your portfolio."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="p-6 space-y-5 border rounded-xl border-border bg-card">
          <FormField label="Headline" error={errors.headline?.message} required>
            <input
              {...register('headline')}
              className={errors.headline ? inputCls + ' border-destructive' : inputCls}
              placeholder="Crafting digital experiences..."
            />
          </FormField>

          <FormField label="Subheadline" error={errors.subheadline?.message} required description="The descriptive line below your name.">
            <textarea
              {...register('subheadline')}
              rows={3}
              className={errors.subheadline ? inputCls + ' border-destructive' : inputCls}
              placeholder="Fullstack developer specializing in..."
            />
          </FormField>

          <FormField label="Resume URL" error={errors.resume_url?.message} description="Public link to your CV/resume.">
            <input
              {...register('resume_url')}
              type="url"
              className={inputCls}
              placeholder="https://drive.google.com/..."
            />
          </FormField>

          <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('available_for_work')}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span>Available for work</span>
          </label>
        </div>

        <div className="p-6 border rounded-xl border-border bg-card">
          <p className="mb-3 text-sm font-medium text-foreground">Profile Photo</p>
          <ImageUpload value={photoField.value} onChange={photoField.onChange} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
