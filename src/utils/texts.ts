const splitRoutePath = (routePath: string): string[] => {
  const routeParts = routePath.split('/').filter((part) => part !== '')

  const routeArray: string[] = []
  let currentRoute = ''

  for (const part of routeParts) {
    currentRoute += `/${part}`
    routeArray.push(currentRoute)
  }

  return routeArray
}
const getMonthName = (monthNumber: number) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]
  return months[monthNumber - 1] || ''
}
const getMonthNameShort = (monthNumber: number) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des'
  ]
  return months[monthNumber - 1] || ''
}
const getMonthNumber = (monthName: string) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]
  if (months.filter((month) => month.toLowerCase() === monthName.toLowerCase()).length > 0) {
    return months.indexOf(monthName) + 1
  } else {
    return 0
  }
}

const reformatDate = (inputDate: string, originalFormat: string, targetFormat: string): string => {
  // Parsing tanggal dari format asli
  const originalDate = parseDate(inputDate, originalFormat)

  // Format tanggal dalam format yang diinginkan
  const formattedDate = formatDateToString(originalDate, targetFormat)

  return formattedDate
}

const parseDate = (inputDate: string, format: string): Date => {
  // Pisahkan tanggal, bulan, dan tahun dari input berdasarkan format
  const parts = inputDate.split(/[^0-9]+/)
  const formatParts = format.split(/[^a-zA-Z]+/)

  // Buat objek tanggal baru dengan mengambil nilai dari format yang diberikan
  const dateValues: any = {}
  for (let i = 0; i < formatParts.length; i++) {
    if (formatParts[i]) {
      dateValues[formatParts[i]] = parseInt(parts[i], 10)
    }
  }

  // Format tanggal dalam format yang diinginkan
  return new Date(dateValues['yyyy'], dateValues['MM'] - 1, dateValues['dd'])
}

const formatDateToString = (date: Date, format: string): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()

  // Ganti placeholder dengan nilai tanggal, bulan, dan tahun
  return format.replace('yyyy', year).replace('MM', month).replace('dd', day)
}

const isNameValid = (name: string): boolean => {
  return /^[a-zA-Z\s]*$/.test(name)
}

const isUsernameValid = (username: string): boolean => {
  // Username hanya boleh berisi huruf dan angka dan tanda underscore (_) dan titik (.)
  return /^[a-zA-Z0-9_.]*$/.test(username)
}

const isEmailValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isWhatsAppValid = (whatsApp: string): boolean => {
  return /^[0-9]*$/.test(whatsApp)
}

const capitalize = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Intl.DateTimeFormat('id-ID', options).format(date).replace(',', ' |')
}

// Format tanggal ke "Bulan Tahun"
// dateString : YYYY-MM-dd
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const result = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date)

  return result
}

const formatViewDate = (dateString: string, format: string) => {
  const [year, month, day] = dateString.split('-')
  if (format === 'short') {
    return `${parseInt(day)} ${getMonthNameShort(parseInt(month))} ${year}`
  } else if (format === 'long') {
    return `${parseInt(day)} ${getMonthName(parseInt(month))} ${year}`
  }
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export {
  isValidUrl,
  reformatDate,
  splitRoutePath,
  getMonthName,
  getMonthNameShort,
  getMonthNumber,
  isNameValid,
  isUsernameValid,
  isEmailValid,
  isWhatsAppValid,
  capitalize,
  formatDateTime,
  formatDate,
  formatViewDate
}
