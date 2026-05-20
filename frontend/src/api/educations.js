import { apiClient } from './client'

export const getEducations = () => apiClient.get('/educations')
export const adminGetEducations = () => apiClient.get('/admin/educations')
export const adminCreateEducation = (data) => apiClient.post('/admin/educations', data)
export const adminUpdateEducation = (id, data) => apiClient.put(`/admin/educations/${id}`, data)
export const adminDeleteEducation = (id) => apiClient.delete(`/admin/educations/${id}`)
