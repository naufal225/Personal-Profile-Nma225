import { apiClient, ensureCsrfCookie } from './client'

export const login = async (data) => {
  await ensureCsrfCookie()
  return apiClient.post('/auth/login', data)
}

export const logout = () => apiClient.post('/auth/logout')

export const me = () => apiClient.get('/auth/me')
