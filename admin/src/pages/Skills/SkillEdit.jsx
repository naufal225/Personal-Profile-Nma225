import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetSkill, adminUpdateSkillWithFile } from '../../api/skills'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import IconInput from '../../components/ui/IconInput'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
  icon: z.any().optional(),
})

function iconToValue(icon) {
  if (!icon) return null
  const trimmed = icon.trim()
  if (trimmed.startsWith('<svg')) return { mode: 'svg', svg: trimmed }
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return { mode: 'url', url: trimmed }
  return { mode: 'svg', svg: trimmed }
}

export default function SkillEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { icon: null },
  })
  const { field: iconField } = useController({ name: 'icon', control, defaultValue: null })

  useEffect(() => {
    adminGetSkill(id)
      .then((r) => {
        const d = r.data.data
        reset({
          name: d.name ?? '',
          category: d.category ?? '',
          order: d.order ?? 0,
          icon: iconToValue(d.icon),
        })
      })
      .catch(() => toast.error('Failed to load skill'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('name', data.name)
      if (data.category) fd.append('category', data.category)
      fd.append('order', data.order ?? 0)
      if (data.icon?.mode === 'file') fd.append('icon_file', data.icon.file)
      else if (data.icon?.mode === 'svg') fd.append('icon_svg', data.icon.svg)
      // mode 'url' = keep existing → send nothing, backend keeps current

      await adminUpdateSkillWithFile(id, fd)
      toast.success('Skill updated')
      navigate(`/skills/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={`/skills/${id}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Edit Skill</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Name" error={errors.name?.message} required>
            <input {...register('name')} className={errors.name ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="Category" error={errors.category?.message}>
            <input {...register('category')} className={inputCls} />
          </FormField>
          <FormField label="Display Order" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} style={{ width: '100px' }} />
          </FormField>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-3">Icon</p>
          {iconField.value?.mode === 'url' && (
            <div className="mb-3 p-3 rounded-lg border border-border bg-muted/30 flex items-center gap-3">
              <img src={iconField.value.url} alt="Current" className="h-10 w-10 object-contain" />
              <p className="text-xs text-muted-foreground">Current icon. Replace by uploading a new image or pasting SVG code below.</p>
            </div>
          )}
          <IconInput value={iconField.value} onChange={iconField.onChange} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to={`/skills/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
