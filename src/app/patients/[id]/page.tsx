'use client'

import { use, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { useI18n } from '@/lib/i18n'
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
  const { t } = useI18n()
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
            <Button size="sm" variant="secondary" onClick={() => router.push(`/patients/${id}/history`)}>
              {t('history')}
            </Button>
            <Button size="sm" onClick={() => router.push(`/patients/${id}/patient-mode`)}>
              {t('start_patient_mode')}
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
              {t(patient.dementiaLevel)} {t('dementia')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            <div><p className="text-slate-500">{t('chart_no')}</p><p className="font-semibold text-slate-900">#{String(patient.chartNo).padStart(4, '0')}</p></div>
            <div><p className="text-slate-500">{t('age')}</p><p className="font-semibold text-slate-900">{patient.age} {t('yrs')}</p></div>
            <div><p className="text-slate-500">{t('gender')}</p><p className="font-semibold text-slate-900 capitalize">{t(patient.gender as 'male' | 'female' | 'other')}</p></div>
            <div><p className="text-slate-500">{t('phone')}</p><p className="font-semibold text-slate-900">{patient.phone}</p></div>
            <div><p className="text-slate-500">{t('country_of_birth')}</p><p className="font-semibold text-slate-900">{patient.countryOfBirth}</p></div>
            <div className="col-span-2"><p className="text-slate-500">{t('address')}</p><p className="font-semibold text-slate-900">{patient.address}</p></div>
            {patient.birthday && <div><p className="text-slate-500">{t('date_of_birth')}</p><p className="font-semibold text-slate-900">{patient.birthday}</p></div>}
            {patient.height && <div><p className="text-slate-500">{t('height')}</p><p className="font-semibold text-slate-900">{patient.height} cm</p></div>}
            {patient.weight && <div><p className="text-slate-500">{t('weight')}</p><p className="font-semibold text-slate-900">{patient.weight} kg</p></div>}
          </div>

          {patient.medicalConditions && (
            <div className="border-t border-slate-100 pt-4 text-sm">
              <p className="text-slate-500">{t('medical_conditions')}</p>
              <p className="font-semibold text-slate-900 mt-0.5">{patient.medicalConditions}</p>
            </div>
          )}
        </Card>

        {/* Profile Picture */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">{t('profile_picture')}</h2>
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-4xl text-slate-400">
              {patient.profilePhoto && patient.profileFilename
                ? <BlobImg blob={patient.profilePhoto} filename={patient.profileFilename} className="h-full w-full object-cover" />
                : '👤'
              }
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => profileInputRef.current?.click()}>
                {patient.profilePhoto ? t('change_photo') : t('upload_photo')}
              </Button>
              {patient.profilePhoto && (
                <Button size="sm" variant="danger" onClick={() => removeProfilePhoto(id)}>{t('remove')}</Button>
              )}
            </div>
          </div>
          <input ref={profileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleProfileUpload} />
        </section>

        {/* Game Photos */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{t('game_photos')}</h2>
            <div className="flex gap-2">
              {!deleteMode ? (
                <>
                  <Button size="sm" onClick={() => fileInputRef.current?.click()}>{t('upload')}</Button>
                  {photos && photos.length > 0 && (
                    <Button size="sm" variant="secondary" onClick={() => setDeleteMode(true)}>{t('delete')}</Button>
                  )}
                </>
              ) : (
                <>
                  <Button size="sm" variant="danger" disabled={selected.size === 0} onClick={handleDeleteSelected}>
                    {t('delete')} {selected.size > 0 ? `(${selected.size})` : ''}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { setDeleteMode(false); setSelected(new Set()) }}>{t('cancel')}</Button>
                </>
              )}
            </div>
          </div>

          {deleteMode && <p className="text-sm text-slate-500">{t('tap_to_select_delete')}</p>}

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
            <p className="py-8 text-center text-sm text-slate-400">{t('no_photos_upload')}</p>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleUpload} />
        </section>

      </Layout>
    </>
  )
}
