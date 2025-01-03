import { apiService } from '@/api'

const endpoint = {
  qr: '/auth/qr',
  jwt: '/auth/jwt',
  auth: '/auth/verify'
}

export const requestQRData = async () => await apiService().get(endpoint.qr)
export const requestJWTData = async (data: any) => await apiService().post(endpoint.jwt, data)
export const requestAuthData = async (data: any) => await apiService().post(endpoint.auth, data)
