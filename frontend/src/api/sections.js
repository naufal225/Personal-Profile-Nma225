import { apiClient } from './client'

// Returns only the active sections (ordered).
export const getSections = () => apiClient.get('/sections')
