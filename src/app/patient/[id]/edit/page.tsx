'use client'

import { use, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { updatePatient, addPhoto, deletePhotos } from '@/lib/db/queries'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BlobImg } from '@/components/session/BlobImg'

const fieldClass = 'rounded-md border border-slate-300 px-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
const labelClass = 'text-sm font-medium text-slate-700'

export default function PatientEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const patient = useLiveQuery(() => db.patients.get(id), [id])
  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null)
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', countryOfBirth: '', address: '',
    birthday: '', height: '', weight: '', medicalConditions: '',
  })

  useEffect(() => {
    if (patient && !initialized) {
      setForm({
        name: patient.name,
        phone: patient.phone === 'Not provided' ? '' : (patient.phone ?? ''),
        countryOfBirth: patient.countryOfBirth === 'Not provided' ? '' : (patient.countryOfBirth ?? ''),
        address: patient.address === 'Not provided' ? '' : (patient.address ?? ''),
        birthday: patient.birthday ?? '',
        height: patient.height?.toString() ?? '',
        weight: patient.weight?.toString() ?? '',
        medicalConditions: patient.medicalConditions ?? '',
      })
      setInitialized(true)
    }
  }, [patient, initialized])

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPhotoFile(file)
      setNewPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await updatePatient(id, {
      name: form.name.trim(),
      phone: form.phone.trim() || 'Not provided',
      countryOfBirth: form.countryOfBirth || 'Not provided',
      address: form.address.trim() || 'Not provided',
      birthday: form.birthday || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      medicalConditions: form.medicalConditions || undefined,
    })
    if (newPhotoFile) {
      const existing = photos?.map(p => p.id) ?? []
      if (existing.length > 0) await deletePhotos(existing)
      await addPhoto(id, newPhotoFile)
    }
    router.push(`/patients/${id}/patient-mode?from=role`)
  }

  const existingPhoto = photos?.find(p => p.blob) ?? null

  if (!patient || !initialized) return null

  return (
    <>
      <Header title="Edit Profile" onBack={() => router.push(`/patients/${id}/patient-mode?from=role`)} />
      <Layout>
        <form className="flex max-w-2xl flex-col gap-6" onSubmit={handleSubmit}>

          <Input id="name" label="Full Name *" value={form.name} onChange={set('name')} placeholder="Your full name" required />

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Patient Photo</label>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
            {newPhotoPreview ? (
              <div className="flex items-center gap-4">
                <img src={newPhotoPreview} alt="New photo preview" className="h-24 w-24 rounded-md object-cover border-2 border-slate-200" />
                <Button type="button" variant="secondary" size="sm" onClick={() => photoInputRef.current?.click()}>Change</Button>
              </div>
            ) : existingPhoto ? (
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-md border-2 border-slate-200">
                  <BlobImg blob={existingPhoto.blob} filename={existingPhoto.filename} className="h-full w-full object-cover" />
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => photoInputRef.current?.click()}>Change Photo</Button>
              </div>
            ) : (
              <Button type="button" variant="secondary" onClick={() => photoInputRef.current?.click()}>📷 Upload Photo</Button>
            )}
          </div>

          <Input id="phone" label="Phone Number" type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. +1 555 000 0000" />
          <Input id="countryOfBirth" label="Country of Birth" value={form.countryOfBirth} onChange={set('countryOfBirth')} placeholder="e.g. United States" />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className={labelClass}>Address</label>
            <textarea id="address" rows={3} value={form.address} onChange={set('address')} placeholder="Full residential address…" className={`resize-none py-2.5 ${fieldClass}`} />
          </div>

          <Input id="birthday" label="Date of Birth" type="date" value={form.birthday} onChange={set('birthday')} />

          <div className="grid grid-cols-2 gap-4">
            <Input id="height" label="Height (cm)" type="number" min={0} value={form.height} onChange={set('height')} placeholder="e.g. 165" />
            <Input id="weight" label="Weight (kg)" type="number" min={0} value={form.weight} onChange={set('weight')} placeholder="e.g. 70" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="medicalConditions" className={labelClass}>Medical Conditions</label>
            <textarea id="medicalConditions" rows={4} value={form.medicalConditions} onChange={set('medicalConditions')} placeholder="List any relevant medical conditions…" className={`resize-none py-2.5 ${fieldClass}`} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="lg" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.push(`/patients/${id}/patient-mode?from=role`)}>Cancel</Button>
          </div>

        </form>
      </Layout>
    </>
  )
}
