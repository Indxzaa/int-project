export type DementiaLevel = 'mild' | 'moderate' | 'severe'

export interface Patient {
  id: string
  chartNo: number
  name: string
  dementiaLevel: DementiaLevel
  age: number
  gender: string
  phone: string
  countryOfBirth: string
  address: string
  birthday?: string
  height?: number
  weight?: number
  medicalConditions?: string
  profilePhoto?: Blob
  profileFilename?: string
  createdAt: string
}

export interface Photo {
  id: string
  patientId: string
  filename: string
  blob: Blob
}

export interface Session {
  id: string
  patientId: string
  photosViewed: string[]
  startedAt: string
  endedAt?: string
}
