import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Folder, Github, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { adminGetProject, adminDeleteProject } from '../../api/projects'
import { FormCard, FormSection } from '../../components/ui/Form'
import { DetailShell, MetaRow, DetailBlock, DetailLoading, DetailNotFound } from '../../components/ui/Detail'

export default function ProjectShow() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetProject(id)
      .then((r) => setProject(r.data.data))
      .catch(() => toast.error('Gagal memuat proyek'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailLoading />
  if (!project) return <DetailNotFound message="Proyek tidak ditemukan." backTo="/projects" />

  const techStacks = Array.isArray(project.tech_stacks) ? project.tech_stacks : []

  return (
    <DetailShell
      title={project.title}
      backTo="/projects"
      editTo={`/projects/${id}/edit`}
      deleteFn={() => adminDeleteProject(id)}
      redirectTo="/projects"
      deleteTitle="Hapus proyek?"
      deleteDescription={`"${project.title}" akan dihapus secara permanen.`}
      aside={
        project.thumbnail_path ? (
          <div className="card aside-card">
            <div className="aside-h">Thumbnail</div>
            <div className="detail-thumb"><img src={project.thumbnail_path} alt={project.title} /></div>
          </div>
        ) : null
      }
    >
      <FormCard>
        <FormSection icon={Folder} title="Detail Proyek" plain>
          {project.description && <DetailBlock label="Deskripsi">{project.description}</DetailBlock>}
          {techStacks.length > 0 && (
            <DetailBlock label="Tech Stack">
              <div className="tags-view">{techStacks.map((t) => <span key={t} className="tag-mono">{t}</span>)}</div>
            </DetailBlock>
          )}
          {(project.github_url || project.demo_url) && (
            <DetailBlock label="Tautan">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {project.github_url && (
                  <a className="detail-link" href={project.github_url} target="_blank" rel="noopener noreferrer"><Github size={15} /> Source Code</a>
                )}
                {project.demo_url && (
                  <a className="detail-link" href={project.demo_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Live Demo</a>
                )}
              </div>
            </DetailBlock>
          )}
          <div style={{ marginTop: 18 }}>
            <MetaRow k="Urutan" v={project.order ?? 0} />
          </div>
        </FormSection>
      </FormCard>
    </DetailShell>
  )
}
