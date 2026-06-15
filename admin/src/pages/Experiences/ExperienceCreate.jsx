import { useNavigate } from 'react-router-dom'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Briefcase, Tags } from 'lucide-react'
import { adminCreateExperience } from '../../api/experiences'
import { FormShell, FormCard, FormSection } from '../../components/ui/Form'
import FormField, { inputCls } from '../../components/ui/FormField'
import SkillsSelector from '../../components/ui/SkillsSelector'

const schema = z.object({
  title: z.string().min(1, 'Posisi wajib diisi'),
  organization: z.string().min(1, 'Organisasi wajib diisi'),
  description: z.string().optional().default(''),
  skills: z.array(z.string()).min(1, 'Minimal satu skill'),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().optional().default(''),
})

export default function ExperienceCreate() {
  const navigate = useNavigate()
  const { register, handleSubmit, control, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', organization: '', description: '', skills: [], start_date: '', end_date: '' },
  })
  const { field: skillsField } = useController({ name: 'skills', control })

  const onSubmit = async (data) => {
    try {
      const res = await adminCreateExperience({
        title: data.title,
        organization: data.organization,
        description: data.description || null,
        skills: data.skills,
        start_date: data.start_date,
        end_date: data.end_date || null,
      })
      toast.success('Pengalaman dibuat')
      navigate(`/experiences/${res.data.data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal membuat pengalaman')
    }
  }

  return (
    <FormShell
      title="Pengalaman Baru"
      subtitle="Tambahkan riwayat pekerjaan atau posisi."
      backTo="/experiences"
      cancelTo="/experiences"
      onSubmit={handleSubmit(onSubmit)}
      submitting={isSubmitting}
      submitLabel="Buat Pengalaman"
      dirty={isDirty}
    >
      <FormCard>
        <FormSection icon={Briefcase} title="Detail Pengalaman">
          <FormField className="full" label="Posisi / Jabatan" error={errors.title?.message} required>
            <input {...register('title')} className={inputCls} placeholder="Programmer" />
          </FormField>
          <FormField className="full" label="Organisasi" error={errors.organization?.message} required>
            <input {...register('organization')} className={inputCls} placeholder="PT Yaztech Engineering Solusindo" />
          </FormField>
          <FormField className="full" label="Deskripsi" error={errors.description?.message} description="Tugas, pencapaian, dampak.">
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
