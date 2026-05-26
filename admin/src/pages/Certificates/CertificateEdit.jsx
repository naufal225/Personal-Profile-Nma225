import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { adminGetCertificate, adminUpdateCertificate } from '../../api/certificates'
import { Button } from '../../components/ui/Button'
import FormField, { inputCls } from '../../components/ui/FormField'
import { Skeleton } from '../../components/ui/Skeleton'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  year: z.coerce.number().int().min(1900).max(2100),
  type: z.enum(['training', 'achievement', 'competition']),
  credential_url: z.string().optional().default(''),
})

export default function CertificateEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    adminGetCertificate(id)
      .then((r) => {
        const d = r.data.data
        reset({
          title: d.title ?? '',
          issuer: d.issuer ?? '',
          year: d.year ?? new Date().getFullYear(),
          type: d.type ?? 'training',
          credential_url: d.credential_url ?? '',
        })
      })
      .catch(() => toast.error('Failed to load certificate'))
      .finally(() => setFetching(false))
  }, [id, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        issuer: data.issuer,
        year: Number(data.year),
        type: data.type,
        credential_url: data.credential_url || null,
      }
      await adminUpdateCertificate(id, payload)
      toast.success('Certificate updated')
      navigate(`/certificates/${id}`)
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
          <Link to={`/certificates/${id}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Edit Certificate</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <FormField label="Title" error={errors.title?.message} required>
            <input {...register('title')} className={errors.title ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <FormField label="Issuer" error={errors.issuer?.message} required>
            <input {...register('issuer')} className={errors.issuer ? inputCls + ' border-destructive' : inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Year" error={errors.year?.message} required>
              <input {...register('year')} type="number" min="1900" max="2100" className={errors.year ? inputCls + ' border-destructive' : inputCls} />
            </FormField>
            <FormField label="Type" error={errors.type?.message} required>
              <select {...register('type')} className={errors.type ? inputCls + ' border-destructive' : inputCls}>
                <option value="training">Training</option>
                <option value="achievement">Achievement</option>
                <option value="competition">Competition</option>
              </select>
            </FormField>
          </div>
          <FormField label="Credential URL" error={errors.credential_url?.message}>
            <input {...register('credential_url')} type="url" className={inputCls} />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="ghost">
            <Link to={`/certificates/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
