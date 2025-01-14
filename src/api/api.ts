import { apiService } from '@/api'

const endpoint = {
  login: '/login',
  register: '/register',
  generateQR: '/generate-qr',
  scanQr: '/scan-qr',
  getQrSession: '/get-qr-session'
}

export const requestLoginData = async (data: any) => await apiService().post(endpoint.login, data)
export const requestRegisterData = async (data: any) =>
  await apiService().post(endpoint.register, data)
export const requestQRData = async () => await apiService().get(endpoint.generateQR)
export const requestByQr = async (data: any) => await apiService().post(endpoint.scanQr, data)
export const requestQrSession = async (data: any) =>
  await apiService().post(endpoint.getQrSession, data)
