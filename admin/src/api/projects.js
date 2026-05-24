import { apiClient } from './client'

export const getProjects = () => apiClient.get('/projects')
export const adminGetProjects = () => apiClient.get('/admin/projects')
export const adminCreateProject = (data) => apiClient.post('/admin/projects', data)
export const adminUpdateProject = (id, data) => apiClient.put(`/admin/projects/${id}`, data)
export const adminDeleteProject = (id) => apiClient.delete(`/admin/projects/${id}`)
export const adminReorderProjects = (items) => apiClient.post('/admin/projects/reorder', { items })

export const adminGetProject = (id) => apiClient.get(`/admin/projects/${id}`)

export const adminCreateProjectWithFile = (formData) =>
  apiClient.post('/admin/projects', formData)

export const adminUpdateProjectWithFile = (id, formData) => {
  formData.append('_method', 'PUT')
  return apiClient.post(`/admin/projects/${id}`, formData)
}
