import { EncryptStorage } from 'encrypt-storage'
const encryptStorage = new EncryptStorage('qwertyuiopasdfghjklzxcvbnm-1234567890')

const writeData = (key: string, data: any) => encryptStorage.setItem(key, data)
const writeDataJson = (key: string, data: any) => encryptStorage.setItem(key, JSON.stringify(data))
const removeData = (key: string) => encryptStorage.removeItem(key)
const readData = (key: string) => {
  try {
    return encryptStorage.getItem(key)
  } catch (error) {
    return null
  }
}
const readDataJson = (key: string) => {
  try {
    return encryptStorage.getItem(key)
  } catch (error) {
    return null
  }
}

export { removeData, writeData, writeDataJson, readData, readDataJson }
