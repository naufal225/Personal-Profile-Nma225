import { useNavigate } from 'react-router-dom'
import { login as apiLogin, logout as apiLogout } from '../api/auth'
import useAuthStore from '../store/authStore'

export function useAuth() {
  const { token, setToken, clearToken } = useAuthStore()
  const navigate = useNavigate()

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    const { token: newToken } = res.data.data
    setToken(newToken)
    navigate('/admin/dashboard')
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (_) {
      // proceed even if request fails
    }
    clearToken()
    navigate('/admin/login')
  }

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  }
}
