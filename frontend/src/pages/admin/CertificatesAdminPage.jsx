import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetCertificates, adminCreateCertificate, adminUpdateCertificate, adminDeleteCertificate } from '../../api/certificates'
import Button from '../../components/ui/Button'

const empty = { title: '', issuer: '', year: '', type: 'training', credential_url: '' }

export default function CertificatesAdminPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetCertificates().then((r) => setItems(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const toPayload = (f) => ({ ...f, year: +f.year, credential_url: f.credential_url || null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await adminUpdateCertificate(editing, toPayload(form)) } else { await adminCreateCertificate(toPayload(form)) }
    setForm(empty); setEditing(null); load()
  }

  const handleEdit = (x) => {
    setEditing(x.id)
    setForm({ title: x.title, issuer: x.issuer, year: String(x.year), type: x.type, credential_url: x.credential_url ?? '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return
    await adminDeleteCertificate(id); load()
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-sm text-blue-400 hover:underline">← Dashboard</Link>
          <h1 className="text-xl font-bold text-white">Certificates</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input placeholder="Title" className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Issuer" className={inp} value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Year" type="number" className={inp} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
            <select className={inp} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="training">Training</option>
              <option value="achievement">Achievement</option>
              <option value="competition">Competition</option>
            </select>
          </div>
          <input placeholder="Credential URL (optional)" className={inp} value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
            {editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm(empty) }}>Cancel</Button>}
          </div>
        </form>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="space-y-3">
            {items.map((x) => (
              <div key={x.id} className="flex items-start justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{x.title}</p>
                  <p className="text-gray-500 text-xs">{x.issuer} · {x.year} · {x.type}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(x)} className="text-blue-400 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(x.id)} className="text-red-400 text-sm hover:underline">Delete</button>
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
