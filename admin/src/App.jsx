import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'
import { useBootstrapAuth } from './hooks/useAuth'
import { TooltipProvider } from './components/ui/Tooltip'
import { Toaster } from 'sonner'

import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

import ProjectsIndex from './pages/Projects/ProjectsIndex'
import ProjectCreate from './pages/Projects/ProjectCreate'
import ProjectShow from './pages/Projects/ProjectShow'
import ProjectEdit from './pages/Projects/ProjectEdit'
import HeroEditPage from './pages/Hero/HeroEditPage'

import SkillsIndex from './pages/Skills/SkillsIndex'
import SkillCreate from './pages/Skills/SkillCreate'
import SkillShow from './pages/Skills/SkillShow'
import SkillEdit from './pages/Skills/SkillEdit'

import ServicesIndex from './pages/Services/ServicesIndex'
import ServiceCreate from './pages/Services/ServiceCreate'
import ServiceShow from './pages/Services/ServiceShow'
import ServiceEdit from './pages/Services/ServiceEdit'

import ContactsIndex from './pages/Contacts/ContactsIndex'
import ContactCreate from './pages/Contacts/ContactCreate'
import ContactShow from './pages/Contacts/ContactShow'
import ContactEdit from './pages/Contacts/ContactEdit'

import ExperiencesIndex from './pages/Experiences/ExperiencesIndex'
import ExperienceCreate from './pages/Experiences/ExperienceCreate'
import ExperienceShow from './pages/Experiences/ExperienceShow'
import ExperienceEdit from './pages/Experiences/ExperienceEdit'

import EducationsIndex from './pages/Educations/EducationsIndex'
import EducationCreate from './pages/Educations/EducationCreate'
import EducationShow from './pages/Educations/EducationShow'
import EducationEdit from './pages/Educations/EducationEdit'

import CertificatesIndex from './pages/Certificates/CertificatesIndex'
import CertificateCreate from './pages/Certificates/CertificateCreate'
import CertificateShow from './pages/Certificates/CertificateShow'
import CertificateEdit from './pages/Certificates/CertificateEdit'

function P(Element) {
  return (
    <ProtectedRoute>
      <AdminLayout>{Element}</AdminLayout>
    </ProtectedRoute>
  )
}

function ProtectedRoute({ children }) {
  const status = useAuthStore((s) => s.status)
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }
  if (status !== 'authenticated') return <Navigate to="/login" replace />
  return children
}

export default function App() {
  useBootstrapAuth()

  useEffect(() => {
    const apply = (theme) => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }
    apply(useThemeStore.getState().theme)
    return useThemeStore.subscribe((state) => apply(state.theme))
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={P(<DashboardPage />)} />

        <Route path="/hero" element={P(<HeroEditPage />)} />

        <Route path="/projects" element={P(<ProjectsIndex />)} />
        <Route path="/projects/create" element={P(<ProjectCreate />)} />
        <Route path="/projects/:id" element={P(<ProjectShow />)} />
        <Route path="/projects/:id/edit" element={P(<ProjectEdit />)} />

        <Route path="/skills" element={P(<SkillsIndex />)} />
        <Route path="/skills/create" element={P(<SkillCreate />)} />
        <Route path="/skills/:id" element={P(<SkillShow />)} />
        <Route path="/skills/:id/edit" element={P(<SkillEdit />)} />

        <Route path="/services" element={P(<ServicesIndex />)} />
        <Route path="/services/create" element={P(<ServiceCreate />)} />
        <Route path="/services/:id" element={P(<ServiceShow />)} />
        <Route path="/services/:id/edit" element={P(<ServiceEdit />)} />

        <Route path="/contacts" element={P(<ContactsIndex />)} />
        <Route path="/contacts/create" element={P(<ContactCreate />)} />
        <Route path="/contacts/:id" element={P(<ContactShow />)} />
        <Route path="/contacts/:id/edit" element={P(<ContactEdit />)} />

        <Route path="/experiences" element={P(<ExperiencesIndex />)} />
        <Route path="/experiences/create" element={P(<ExperienceCreate />)} />
        <Route path="/experiences/:id" element={P(<ExperienceShow />)} />
        <Route path="/experiences/:id/edit" element={P(<ExperienceEdit />)} />

        <Route path="/educations" element={P(<EducationsIndex />)} />
        <Route path="/educations/create" element={P(<EducationCreate />)} />
        <Route path="/educations/:id" element={P(<EducationShow />)} />
        <Route path="/educations/:id/edit" element={P(<EducationEdit />)} />

        <Route path="/certificates" element={P(<CertificatesIndex />)} />
        <Route path="/certificates/create" element={P(<CertificateCreate />)} />
        <Route path="/certificates/:id" element={P(<CertificateShow />)} />
        <Route path="/certificates/:id/edit" element={P(<CertificateEdit />)} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </TooltipProvider>
  )
}
