import Dexie, { type EntityTable } from 'dexie'
import { Patient, Photo, Session } from '@/lib/types'

const db = new Dexie('MemoryCareDB') as Dexie & {
  patients: EntityTable<Patient, 'id'>
  photos: EntityTable<Photo, 'id'>
  sessions: EntityTable<Session, 'id'>
}

db.version(1).stores({
  patients: 'id, createdAt',
  photos: 'id, patientId',
  sessions: 'id, patientId',
})

db.version(2).stores({
  patients: 'id, createdAt, chartNo',
  photos: 'id, patientId',
  sessions: 'id, patientId',
}).upgrade(async tx => {
  let counter = 1
  await tx.table('patients').toCollection().modify((p: any) => {
    if (!p.chartNo) p.chartNo = counter++
  })
})

db.version(3).stores({
  patients: 'id, createdAt, chartNo, name',
  photos: 'id, patientId',
  sessions: 'id, patientId',
})

export default db
