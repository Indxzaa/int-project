import db from './index'
import { Patient, Photo, Session, DementiaLevel } from '@/lib/types'

const id = () => crypto.randomUUID()

// Patients
export const getPatient = (patientId: string) => db.patients.get(patientId)
export const createPatient = async (data: Omit<Patient, 'id' | 'createdAt' | 'chartNo'>) => {
  const last = await db.patients.orderBy('chartNo').last()
  const chartNo = (last?.chartNo ?? 0) + 1
  return db.patients.add({ ...data, id: id(), chartNo, createdAt: new Date().toISOString() })
}
export const updatePatient = (
  patientId: string,
  data: Partial<Pick<Patient, 'name' | 'phone' | 'countryOfBirth' | 'address' | 'birthday' | 'height' | 'weight' | 'medicalConditions'>>
) => db.patients.update(patientId, data)

export const deletePatient = async (patientId: string) => {
  await db.photos.where('patientId').equals(patientId).delete()
  await db.sessions.where('patientId').equals(patientId).delete()
  await db.patients.delete(patientId)
}

// Profile photo
export const setProfilePhoto = (patientId: string, file: File) =>
  db.patients.update(patientId, { profilePhoto: file, profileFilename: file.name })

export const removeProfilePhoto = (patientId: string) =>
  db.patients.update(patientId, { profilePhoto: undefined, profileFilename: undefined })

// Game photos
export const addPhoto = async (patientId: string, file: File): Promise<Photo> => {
  const photo: Photo = { id: id(), patientId, filename: file.name, blob: file }
  await db.photos.add(photo)
  return photo
}
export const deletePhoto = (photoId: string) => db.photos.delete(photoId)
export const deletePhotos = (photoIds: string[]) => db.photos.bulkDelete(photoIds)

// Sessions
export const createSession = async (patientId: string): Promise<string> => {
  const sessionId = id()
  await db.sessions.add({ id: sessionId, patientId, photosViewed: [], startedAt: new Date().toISOString() })
  return sessionId
}
export const addPhotoToSession = (sessionId: string, photoId: string) =>
  db.sessions.where('id').equals(sessionId).modify(s => { s.photosViewed = [...s.photosViewed, photoId] })
export const closeSession = (sessionId: string) =>
  db.sessions.update(sessionId, { endedAt: new Date().toISOString() })
export const getSession = (sessionId: string) => db.sessions.get(sessionId)
