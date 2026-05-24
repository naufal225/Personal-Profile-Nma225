import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetEducation, adminUpdateEducation } from '../../api/educations'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  major: z.string().optional().default(''),
  description: z.string().optional().default(''),
  start_year: z.coerce.number().int().min(1900).max(2100),
  end_year: z.union([z.coerce.number().int().min(1900).max(2100), z.literal('').transform(() => null)]).optional().nullable(),
})

export default function EducationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
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
      .catch(() => toast.error('Failed to load education'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        institution: data.institution,
        major: data.major || null,
        description: data.description || null,
        start_year: Number(data.start_year),
        end_year: data.end_year ? Number(data.end_year) : null,
      }
      await adminUpdateEducation(id, payload)
      toast.success('Education updated')
      navigate(`/educations/${id}`)
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
          <Link to={`/educations/${id}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Edit Education</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Institution" error={errors.institution?.message} required>
            <input {...register('institution')} className={errors.institution ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="Major / Field of Study" error={errors.major?.message}>
            <input {...register('major')} className={inputCls} />
          </FormField>
          <FormField label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={3} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Year" error={errors.start_year?.message} required>
              <input {...register('start_year')} type="number" min="1900" max="2100" className={errors.start_year ? inputCls + ' border-destructive' : inputCls} />
            </FormField>
            <FormField label="End Year" error={errors.end_year?.message} description="Empty = Present.">
              <input {...register('end_year')} type="number" min="1900" max="2100" className={inputCls} />
            </FormField>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to={`/educations/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
