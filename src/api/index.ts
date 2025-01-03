import { readData } from '@/utils/storage'
import axios from 'axios'

export const apiService = (contentType = 'application/json') => {
  const token = readData('token') || ''
  const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': contentType,
      Accept: '*/*'
    },
    withCredentials: false,
    timeout: import.meta.env.DEV ? 5000 : 15000
  })
  request.interceptors.request.use((config) => {
    config.headers.set('User-Agent', false)
    config.headers.set('Authorization', `Bearer ${token}`)

    return config
  })
  return request
}
