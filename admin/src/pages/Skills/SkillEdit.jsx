import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Code2 } from 'lucide-react'
import { adminGetSkill, adminUpdateSkillWithFile } from '../../api/skills'
import { FormShell, FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import IconInput from '../../components/ui/IconInput'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
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

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { icon: null },
  })
  const { field: iconField } = useController({ name: 'icon', control, defaultValue: null })

  useEffect(() => {
    adminGetSkill(id)
      .then((r) => {
        const d = r.data.data
        reset({ name: d.name ?? '', category: d.category ?? '', order: d.order ?? 0, icon: iconToValue(d.icon) })
      })
      .catch(() => toast.error('Gagal memuat skill'))
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

      await adminUpdateSkillWithFile(id, fd)
      toast.success('Skill diperbarui')
      navigate(`/skills/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal memperbarui')
    }
  }

  if (fetching) {
    return <div className="card" style={{ height: 320 }}><div className="skeleton" style={{ height: '100%' }} /></div>
  }

  return (
    <FormShell
      title="Edit Skill"
      backTo={`/skills/${id}`}
      cancelTo={`/skills/${id}`}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Simpan Perubahan"
      dirty={isDirty}
      aside={
        <AsideCard title="Icon">
          {iconField.value?.mode === 'url' && (
            <div className="upload-preview" style={{ marginBottom: 12 }}>
              <img src={iconField.value.url} alt="Icon saat ini" style={{ maxHeight: 80 }} />
            </div>
          )}
          <IconInput value={iconField.value} onChange={iconField.onChange} />
        </AsideCard>
      }
    >
      <FormCard>
        <FormSection icon={Code2} title="Detail Skill">
          <FormField className="full" label="Nama" error={errors.name?.message} required>
            <input {...register('name')} className={inputCls} />
          </FormField>
          <FormField label="Kategori" error={errors.category?.message}>
            <input {...register('category')} className={inputCls} />
          </FormField>
          <FormField label="Urutan" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
