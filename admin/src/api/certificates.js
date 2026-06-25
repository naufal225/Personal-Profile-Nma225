import { apiClient } from './client'

export const getCertificates = () => apiClient.get('/certificates')
export const adminGetCertificates = () => apiClient.get('/admin/certificates')
export const adminCreateCertificate = (data) => apiClient.post('/admin/certificates', data)
export const adminUpdateCertificate = (id, data) => apiClient.put(`/admin/certificates/${id}`, data)
export const adminDeleteCertificate = (id) => apiClient.delete(`/admin/certificates/${id}`)

export const adminGetCertificate = (id) => apiClient.get(`/admin/certificates/${id}`)
export const adminReorderCertificates = (items) => apiClient.post('/admin/certificates/reorder', { items })

export const adminCreateCertificateWithFile = (formData) =>
  apiClient.post('/admin/certificates', formData)

export const adminUpdateCertificateWithFile = (id, formData) => {
  formData.append('_method', 'PUT')
  return apiClient.post(`/admin/certificates/${id}`, formData)
}
