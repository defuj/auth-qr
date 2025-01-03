import { apiService } from '@/api'

const endpoint = {
  qr: '/auth/qr',
  jwt: '/auth/jwt'
}

export const requestQRData = async () => await apiService().get(endpoint.qr)
export const requestJWTData = async (data: any) => await apiService().post(endpoint.jwt, data)
