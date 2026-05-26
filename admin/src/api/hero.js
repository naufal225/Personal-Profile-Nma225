import { apiClient } from './client'

export const getHero = () => apiClient.get('/hero')
export const adminGetHero = () => apiClient.get('/admin/hero')
export const adminUpdateHero = (data) => apiClient.put('/admin/hero', data)


export const adminUpdateHeroWithFile = (formData) => {
  formData.append('_method', 'PUT')
  return apiClient.post('/admin/hero', formData)
}
