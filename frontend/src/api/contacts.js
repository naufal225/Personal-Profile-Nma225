import { apiClient } from './client'

export const getContacts = () => apiClient.get('/contacts')
export const adminGetContacts = () => apiClient.get('/admin/contacts')
export const adminCreateContact = (data) => apiClient.post('/admin/contacts', data)
export const adminUpdateContact = (id, data) => apiClient.put(`/admin/contacts/${id}`, data)
export const adminDeleteContact = (id) => apiClient.delete(`/admin/contacts/${id}`)
