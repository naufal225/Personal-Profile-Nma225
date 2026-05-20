import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'

const sections = [
  { label: 'Hero', path: '/admin/hero' },
  { label: 'Skills', path: '/admin/skills' },
  { label: 'Projects', path: '/admin/projects' },
  { label: 'Experiences', path: '/admin/experiences' },
  { label: 'Educations', path: '/admin/educations' },
  { label: 'Certificates', path: '/admin/certificates' },
  { label: 'Services', path: '/admin/services' },
  { label: 'Contacts', path: '/admin/contacts' },
]

export default function DashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio Admin</h1>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sections.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="flex items-center justify-center py-6 bg-white dark:bg-gray-900 border border-slate-200 dark:border-blue-900/40 rounded-xl text-slate-800 dark:text-white text-sm font-medium hover:bg-slate-100 dark:hover:bg-gray-800 hover:border-violet-300 dark:hover:border-blue-900/40 transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
