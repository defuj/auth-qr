interface AuthInterface {
  user: {
    id: number
    name: string
    picture: string
    username: string
    role: string
  }
  office: {
    id: number
    code: string
    name: string
    contact: string
    address: string
    coordinate: {
      latitude: number
      longitude: number
    }
  }
}

interface PresenceInterface {
  distance: {
    km: string
    m: string
  }
  location: {
    latitude: number
    longitude: number
  }
  store: {
    code: string
    id: string
    location: {
      address: string
      latitude: number
      longitude: number
    }
    name: string
  }
  time: number
}
interface ShiftInterface {
  sign_in: PresenceInterface | null | undefined
  sign_out: PresenceInterface | null | undefined
}

export type { AuthInterface, PresenceInterface, ShiftInterface }
