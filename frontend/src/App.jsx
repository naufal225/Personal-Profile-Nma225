import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import useThemeStore from './store/themeStore'

import HomePage from './pages/public/HomePage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import HeroAdminPage from './pages/admin/HeroAdminPage'
import SkillsAdminPage from './pages/admin/SkillsAdminPage'
import ProjectsAdminPage from './pages/admin/ProjectsAdminPage'
import ExperiencesAdminPage from './pages/admin/ExperiencesAdminPage'
import EducationsAdminPage from './pages/admin/EducationsAdminPage'
import CertificatesAdminPage from './pages/admin/CertificatesAdminPage'
import ServicesAdminPage from './pages/admin/ServicesAdminPage'
import ContactsAdminPage from './pages/admin/ContactsAdminPage'

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  useEffect(() => {
    const apply = (theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    apply(useThemeStore.getState().theme)
    return useThemeStore.subscribe((state) => apply(state.theme))
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/hero" element={<ProtectedRoute><HeroAdminPage /></ProtectedRoute>} />
        <Route path="/admin/skills" element={<ProtectedRoute><SkillsAdminPage /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><ProjectsAdminPage /></ProtectedRoute>} />
        <Route path="/admin/experiences" element={<ProtectedRoute><ExperiencesAdminPage /></ProtectedRoute>} />
        <Route path="/admin/educations" element={<ProtectedRoute><EducationsAdminPage /></ProtectedRoute>} />
        <Route path="/admin/certificates" element={<ProtectedRoute><CertificatesAdminPage /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><ServicesAdminPage /></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute><ContactsAdminPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
