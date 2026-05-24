import { apiClient } from './client'

export const getServices = () => apiClient.get('/services')
export const adminGetServices = () => apiClient.get('/admin/services')
export const adminCreateService = (data) => apiClient.post('/admin/services', data)
export const adminUpdateService = (id, data) => apiClient.put(`/admin/services/${id}`, data)
export const adminDeleteService = (id) => apiClient.delete(`/admin/services/${id}`)
export const adminReorderServices = (items) => apiClient.post('/admin/services/reorder', { items })

export const adminGetService = (id) => apiClient.get(`/admin/services/${id}`)
