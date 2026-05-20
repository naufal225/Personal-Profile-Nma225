import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } from '../../api/projects'
import Button from '../../components/ui/Button'

const empty = { title: '', description: '', tech_stacks: '', github_url: '', demo_url: '', thumbnail_path: '', order: 0 }

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetProjects().then((r) => setProjects(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const toPayload = (f) => ({
    ...f,
    tech_stacks: typeof f.tech_stacks === 'string' ? f.tech_stacks.split(',').map((s) => s.trim()).filter(Boolean) : f.tech_stacks,
    github_url: f.github_url || null,
    demo_url: f.demo_url || null,
    thumbnail_path: f.thumbnail_path || null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateProject(editing, toPayload(form)) } else { await adminCreateProject(toPayload(form)) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({ title: p.title, description: p.description, tech_stacks: Array.isArray(p.tech_stacks) ? p.tech_stacks.join(', ') : '', github_url: p.github_url ?? '', demo_url: p.demo_url ?? '', thumbnail_path: p.thumbnail_path ?? '', order: p.order })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await adminDeleteProject(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Projects</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input placeholder="Title" className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Description" rows={3} className={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input placeholder="Tech stacks (comma-separated)" className={inp} value={form.tech_stacks} onChange={(e) => setForm({ ...form, tech_stacks: e.target.value })} />
          <input placeholder="Thumbnail Image URL (optional)" className={inp} value={form.thumbnail_path} onChange={(e) => setForm({ ...form, thumbnail_path: e.target.value })} />
          <input placeholder="GitHub URL (optional)" className={inp} value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
          <input placeholder="Demo URL (optional)" className={inp} value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} />
          <input placeholder="Order" type="number" className={inp} value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
            {editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm(empty) }}>Cancel</Button>}
          </div>
        </form>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-start justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{p.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{Array.isArray(p.tech_stacks) ? p.tech_stacks.join(', ') : ''}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(p)} className="text-blue-400 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500'
