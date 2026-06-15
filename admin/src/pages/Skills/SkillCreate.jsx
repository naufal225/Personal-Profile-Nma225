import { useNavigate } from 'react-router-dom'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Code2 } from 'lucide-react'
import { adminCreateSkillWithFile } from '../../api/skills'
import { FormShell, FormCard, FormSection, AsideCard } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import IconInput from '../../components/ui/IconInput'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  category: z.string().optional().default(''),
  order: z.coerce.number().int().default(0),
  icon: z.any().refine((v) => v && (v.mode === 'file' || (v.mode === 'svg' && v.svg?.trim())), {
    message: 'Icon wajib diisi (unggah gambar atau tempel kode SVG)',
  }),
})

export default function SkillCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, control, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', category: '', order: 0, icon: null },
  })
  const { field: iconField } = useController({ name: 'icon', control })

  const onSubmit = async (data) => {
    try {
      const fd = new FormData()
      fd.append('name', data.name)
      if (data.category) fd.append('category', data.category)
      fd.append('order', data.order ?? 0)
      if (data.icon?.mode === 'file') fd.append('icon_file', data.icon.file)
      else if (data.icon?.mode === 'svg') fd.append('icon_svg', data.icon.svg)

      const res = await adminCreateSkillWithFile(fd)
      toast.success('Skill dibuat')
      navigate(`/skills/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal membuat skill')
    }
  }

  return (
    <FormShell
      title="Skill Baru"
      subtitle="Tambahkan teknologi atau tool ke portfolio Anda."
      backTo="/skills"
      cancelTo="/skills"
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Buat Skill"
      dirty={isDirty}
      aside={
        <AsideCard title="Icon">
          <IconInput value={iconField.value} onChange={iconField.onChange} />
          {errors.icon && <p className="hint" style={{ color: 'var(--danger)', marginTop: 10 }}>{errors.icon.message}</p>}
        </AsideCard>
      }
    >
      <FormCard>
        <FormSection icon={Code2} title="Detail Skill">
          <FormField className="full" label="Nama" error={errors.name?.message} required>
            <input {...register('name')} className={inputCls} placeholder="React" />
          </FormField>
          <FormField label="Kategori" error={errors.category?.message} description="Pengelompokan opsional (mis. Frontend).">
            <input {...register('category')} className={inputCls} placeholder="Frontend" />
          </FormField>
          <FormField label="Urutan" error={errors.order?.message}>
            <input {...register('order')} type="number" className={inputCls} placeholder="0" />
          </FormField>
        </FormSection>
      </FormCard>
    </FormShell>
  )
}
