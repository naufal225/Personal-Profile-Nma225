import { apiClient } from './client'

export const adminGetSections = () => apiClient.get('/admin/sections')
export const adminUpdateSection = (id, data) => apiClient.put(`/admin/sections/${id}`, data)
