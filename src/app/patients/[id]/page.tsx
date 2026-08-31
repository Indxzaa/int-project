'use client'

import { use, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { addPhoto, deletePhotos, setProfilePhoto, removeProfilePhoto } from '@/lib/db/queries'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BlobImg } from '@/components/session/BlobImg'
import { PhotoThumb } from '@/components/patients/PhotoThumb'

const levelStyles = {
  mild: 'bg-green-50 text-green-700 border-green-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  severe: 'bg-red-50 text-red-700 border-red-200',
}

export default function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const patient = useLiveQuery(() => db.patients.get(id), [id])
  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])

  if (!patient) return null

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await setProfilePhoto(id, file)
    e.target.value = ''
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) await addPhoto(id, file)
    e.target.value = ''
  }

  const toggleSelect = (photoId: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(photoId) ? next.delete(photoId) : next.add(photoId)
      return next
    })

  const handleDeleteSelected = async () => {
    await deletePhotos(Array.from(selected))
    setSelected(new Set())
    setDeleteMode(false)
  }

  return (
    <>
      <Header
        title={patient.name}
        onBack={() => router.push('/caregiver')}
        onHome={() => router.push('/caregiver')}
        actions={
          <div className="flex items-center gap-2">
            <Button size="md" variant="secondary" onClick={() => router.push(`/patients/${id}/history`)}>
              📊 History
            </Button>
            <Button size="md" onClick={() => router.push(`/patients/${id}/patient-mode`)}>
              ▶ Start Patient Mode
            </Button>
          </div>
        }
      />
      <Layout className="flex flex-col gap-8 pb-12">

        {/* Patient Info */}
        <Card className="p-6 flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-3xl font-bold text-slate-900">{patient.name}</h2>
            <span className={`rounded-full border px-3 py-1 text-sm font-semibold capitalize ${levelStyles[patient.dementiaLevel]}`}>
              {patient.dementiaLevel} dementia
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            <div><p className="text-slate-500">Chart No.</p><p className="font-semibold text-slate-900">#{String(patient.chartNo).padStart(4, '0')}</p></div>
            <div><p className="text-slate-500">Age</p><p className="font-semibold text-slate-900">{patient.age} yrs</p></div>
            <div><p className="text-slate-500">Gender</p><p className="font-semibold text-slate-900 capitalize">{patient.gender}</p></div>
            <div><p className="text-slate-500">Phone</p><p className="font-semibold text-slate-900">{patient.phone}</p></div>
            <div><p className="text-slate-500">Country of Birth</p><p className="font-semibold text-slate-900">{patient.countryOfBirth}</p></div>
            <div className="col-span-2"><p className="text-slate-500">Address</p><p className="font-semibold text-slate-900">{patient.address}</p></div>
            {patient.birthday && <div><p className="text-slate-500">Date of Birth</p><p className="font-semibold text-slate-900">{patient.birthday}</p></div>}
            {patient.height && <div><p className="text-slate-500">Height</p><p className="font-semibold text-slate-900">{patient.height} cm</p></div>}
            {patient.weight && <div><p className="text-slate-500">Weight</p><p className="font-semibold text-slate-900">{patient.weight} kg</p></div>}
          </div>

          {patient.medicalConditions && (
            <div className="border-t border-slate-100 pt-4 text-sm">
              <p className="text-slate-500">Medical Conditions</p>
              <p className="font-semibold text-slate-900 mt-0.5">{patient.medicalConditions}</p>
            </div>
          )}
        </Card>

        {/* Profile Picture */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">Profile Picture</h2>
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-4xl text-slate-400">
              {patient.profilePhoto && patient.profileFilename
                ? <BlobImg blob={patient.profilePhoto} filename={patient.profileFilename} className="h-full w-full object-cover" />
                : '👤'
              }
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => profileInputRef.current?.click()}>
                {patient.profilePhoto ? '🔄 Change Photo' : '📷 Upload Photo'}
              </Button>
              {patient.profilePhoto && (
                <Button size="sm" variant="danger" onClick={() => removeProfilePhoto(id)}>Remove</Button>
              )}
            </div>
          </div>
          <input ref={profileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleProfileUpload} />
        </section>

        {/* Game Photos */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Game Photos</h2>
            <div className="flex gap-2">
              {!deleteMode ? (
                <>
                  <Button size="sm" onClick={() => fileInputRef.current?.click()}>📷 Upload</Button>
                  {photos && photos.length > 0 && (
                    <Button size="sm" variant="secondary" onClick={() => setDeleteMode(true)}>🗑 Delete</Button>
                  )}
                </>
              ) : (
                <>
                  <Button size="sm" variant="danger" disabled={selected.size === 0} onClick={handleDeleteSelected}>
                    🗑 Delete {selected.size > 0 ? `(${selected.size})` : ''}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { setDeleteMode(false); setSelected(new Set()) }}>Cancel</Button>
                </>
              )}
            </div>
          </div>

          {deleteMode && <p className="text-sm text-slate-500">Tap photos to select for deletion.</p>}

          {photos && photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map(photo => (
                <PhotoThumb
                  key={photo.id}
                  photo={photo}
                  selected={selected.has(photo.id)}
                  onToggle={deleteMode ? () => toggleSelect(photo.id) : () => {}}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No photos yet. Upload photos to use in games.</p>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleUpload} />
        </section>

      </Layout>
    </>
  )
}
