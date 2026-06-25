import { apiClient } from './client'

export const getEducations = () => apiClient.get('/educations')
export const adminGetEducations = () => apiClient.get('/admin/educations')
export const adminCreateEducation = (data) => apiClient.post('/admin/educations', data)
export const adminUpdateEducation = (id, data) => apiClient.put(`/admin/educations/${id}`, data)
export const adminDeleteEducation = (id) => apiClient.delete(`/admin/educations/${id}`)

export const adminGetEducation = (id) => apiClient.get(`/admin/educations/${id}`)

export const adminCreateEducationWithFile = (formData) =>
  apiClient.post('/admin/educations', formData)

export const adminUpdateEducationWithFile = (id, formData) => {
  formData.append('_method', 'PUT')
  return apiClient.post(`/admin/educations/${id}`, formData)
}
