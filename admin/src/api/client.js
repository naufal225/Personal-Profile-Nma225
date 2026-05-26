import axios from 'axios'

const TOKEN_KEY = 'portfolio_admin_token'

export const getToken    = ()      => localStorage.getItem(TOKEN_KEY)
export const saveToken   = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = ()      => localStorage.removeItem(TOKEN_KEY)

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
