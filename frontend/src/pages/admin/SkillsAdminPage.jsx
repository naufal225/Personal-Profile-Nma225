import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill } from '../../api/skills'
import Button from '../../components/ui/Button'

const empty = { name: '', icon: '', category: '', order: 0 }

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetSkills().then((r) => setSkills(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateSkill(editing, form) } else { await adminCreateSkill(form) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (s) => { setEditing(s.id); setForm({ name: s.name, icon: s.icon, category: s.category ?? '', order: s.order }) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    await adminDeleteSkill(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Skills</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-8">
          <input placeholder="Name" className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Icon" className={inp} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
          <input placeholder="Category" className={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Order" type="number" className={inp} value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
          <div className="col-span-2 flex gap-2">
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
            {editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm(empty) }}>Cancel</Button>}
          </div>
        </form>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <table className="w-full text-sm text-gray-300">
            <thead><tr className="text-left text-gray-500 border-b border-gray-800">{['Name','Icon','Category','Order',''].map((h) => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-gray-900">
                  <td className="py-2 pr-4">{s.name}</td>
                  <td className="py-2 pr-4">{s.icon}</td>
                  <td className="py-2 pr-4">{s.category}</td>
                  <td className="py-2 pr-4">{s.order}</td>
                  <td className="py-2 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="text-blue-400 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500'
