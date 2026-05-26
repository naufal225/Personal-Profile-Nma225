import axios from 'axios'

const API_ROOT_URL = import.meta.env.VITE_API_ROOT_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

let csrfReady = false
export async function ensureCsrfCookie() {
  if (csrfReady) return
  await axios.get(`${API_ROOT_URL}/sanctum/csrf-cookie`, { withCredentials: true })
  csrfReady = true
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login'
    }
    if (error.response?.status === 419) {
      csrfReady = false
    }
    return Promise.reject(error)
  }
)
