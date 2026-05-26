import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin, logout as apiLogout, me as apiMe } from '../api/auth'
import { saveToken, removeToken } from '../api/client'
import useAuthStore from '../store/authStore'

export function useAuth() {
  const { user, status, setUser, setStatus, reset } = useAuthStore()
  const navigate = useNavigate()

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    saveToken(res.data.data.token)
    setUser(res.data.data.user)
    navigate('/dashboard')
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (_) {
      // proceed even if request fails
    }
    removeToken()
    reset()
    navigate('/login')
  }

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || status === 'idle',
    login,
    logout,
  }
}

export function useBootstrapAuth() {
  const { status, setUser, setStatus } = useAuthStore()

  useEffect(() => {
    if (status !== 'idle') return
    setStatus('loading')
    apiMe()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
  }, [status, setUser, setStatus])
}
