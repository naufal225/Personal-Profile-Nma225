import { apiClient } from './client'

export const getSkills = () => apiClient.get('/skills')
export const adminGetSkills = () => apiClient.get('/admin/skills')
export const adminCreateSkill = (data) => apiClient.post('/admin/skills', data)
export const adminUpdateSkill = (id, data) => apiClient.put(`/admin/skills/${id}`, data)
export const adminDeleteSkill = (id) => apiClient.delete(`/admin/skills/${id}`)
export const adminReorderSkills = (items) => apiClient.post('/admin/skills/reorder', { items })

export const adminGetSkill = (id) => apiClient.get(`/admin/skills/${id}`)

export const adminCreateSkillWithFile = (formData) =>
  apiClient.post('/admin/skills', formData)

export const adminUpdateSkillWithFile = (id, formData) => {
  formData.append('_method', 'PUT')
  return apiClient.post(`/admin/skills/${id}`, formData)
}
