import { apiClient } from './client'

export const getExperiences = () => apiClient.get('/experiences')
export const adminGetExperiences = () => apiClient.get('/admin/experiences')
export const adminCreateExperience = (data) => apiClient.post('/admin/experiences', data)
export const adminUpdateExperience = (id, data) => apiClient.put(`/admin/experiences/${id}`, data)
export const adminDeleteExperience = (id) => apiClient.delete(`/admin/experiences/${id}`)

export const adminGetExperience = (id) => apiClient.get(`/admin/experiences/${id}`)
