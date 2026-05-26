import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetExperience, adminUpdateExperience } from '../../api/experiences'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import SkillsSelector from '../../components/ui/SkillsSelector'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization is required'),
  description: z.string().optional().default(''),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().default(''),
})

function toDateInput(value) {
  if (!value) return ''
  return value.slice(0, 10)
}

export default function ExperienceEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })
  const { field: skillsField } = useController({ name: 'skills', control, defaultValue: [] })

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
        })
      })
      .catch(() => toast.error('Failed to load experience'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        organization: data.organization,
        description: data.description || null,
        skills: data.skills,
        start_date: data.start_date,
        end_date: data.end_date || null,
      }
      await adminUpdateExperience(id, payload)
      toast.success('Experience updated')
      navigate(`/experiences/${id}`)
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
          <Link to={`/experiences/${id}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Edit Experience</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Title / Position" error={errors.title?.message} required>
            <input {...register('title')} className={errors.title ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="Organization" error={errors.organization?.message} required>
            <input {...register('organization')} className={errors.organization ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={4} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" error={errors.start_date?.message} required>
              <input {...register('start_date')} type="date" className={errors.start_date ? inputCls + ' border-destructive' : inputCls} />
            </FormField>
            <FormField label="End Date" error={errors.end_date?.message} description="Empty = Present.">
              <input {...register('end_date')} type="date" className={inputCls} />
            </FormField>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-1">Skills Used</p>
          {errors.skills && <p className="text-xs text-destructive mb-2">{errors.skills.message}</p>}
          <SkillsSelector value={skillsField.value} onChange={skillsField.onChange} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to={`/experiences/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
