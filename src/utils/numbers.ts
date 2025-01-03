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

const formatNumber = (number: any): string => {
  if (number == null || number === '' || isNaN(number)) {
    return '0'
  } else {
    const value = parseFloat(number.toString())
    return new Intl.NumberFormat('in-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value)
  }
}

const formatCurrency = (number: any): string => {
  if (number == null || number === '' || isNaN(number)) {
    return '0'
  } else {
    const value = parseFloat(number.toString())
    return new Intl.NumberFormat('in-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value)
  }
}

const formatPercentage = (number: string | number): string => {
  if (number == null || number === '') {
    return '0%'
  } else {
    const value = parseFloat(number.toString())
    const result = new Intl.NumberFormat('in-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value)
    return `${result}%`
  }
}

const isNumber = (value: any): boolean => {
  return !isNaN(value)
}

const countDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const countDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  return countDistance(lat1, lon1, lat2, lon2)
}

export { splitRoutePath, formatNumber, formatCurrency, formatPercentage, isNumber, countDistance }
