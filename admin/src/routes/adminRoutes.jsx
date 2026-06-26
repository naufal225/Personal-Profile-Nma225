import {
  LayoutDashboard,
  LayoutTemplate,
  Sparkles,
  Code2,
  Folder,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Mail,
} from 'lucide-react'

export const adminRoutes = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: null },
  { path: '/sections', label: 'Sections', icon: LayoutTemplate, group: null },

  { path: '/hero', label: 'Hero', icon: Sparkles, group: 'Content' },
  { path: '/skills', label: 'Skills', icon: Code2, group: 'Content' },
  { path: '/projects', label: 'Projects', icon: Folder, group: 'Content' },
  { path: '/services', label: 'Services', icon: Wrench, group: 'Content' },
  { path: '/certificates', label: 'Certificates', icon: Award, group: 'Content' },

  { path: '/experiences', label: 'Experiences', icon: Briefcase, group: 'Journey' },
  { path: '/educations', label: 'Educations', icon: GraduationCap, group: 'Journey' },

  { path: '/contacts', label: 'Contacts', icon: Mail, group: 'Communication' },
]

export const adminGroups = ['Content', 'Journey', 'Communication']

export function getRouteByPath(pathname) {
  return adminRoutes.find((r) => r.path === pathname || pathname.startsWith(r.path + '/'))
}
