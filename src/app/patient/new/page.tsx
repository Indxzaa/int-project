'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { useI18n } from '@/lib/i18n'
import { createPatient, addPhoto } from '@/lib/db/queries'
import { DementiaLevel } from '@/lib/types'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const fieldClass = 'rounded-xl border border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
const labelClass = 'text-base font-medium text-slate-700'

export default function PatientNewPage() {
  const router = useRouter()
  const { t } = useI18n()
  const patientCount = useLiveQuery(() => db.patients.count(), [])
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', dementiaLevel: '', age: '', gender: '', phone: '', countryOfBirth: '', address: '',
    birthday: '', height: '', weight: '', medicalConditions: '',
  })

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.dementiaLevel || !form.age || !form.gender) return
    setSaving(true)
    const id = await createPatient({
      name: form.name.trim(),
      dementiaLevel: form.dementiaLevel as DementiaLevel,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim() || t('not_provided'),
      countryOfBirth: form.countryOfBirth || t('not_provided'),
      address: form.address.trim() || t('not_provided'),
      birthday: form.birthday || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      medicalConditions: form.medicalConditions || undefined,
    })
    if (photoFile) {
      await addPhoto(id, photoFile)
    }
    router.push('/patient')
  }

  return (
    <>
      <Header title={t('create_patient_account_title')} onBack={() => router.push('/patient')} />
      <Layout>
        {patientCount !== undefined && patientCount >= 3 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <span className="text-6xl">🚫</span>
            <p className="text-2xl font-semibold text-slate-800">{t('account_limit_reached')}</p>
            <p className="max-w-sm text-lg text-slate-500">
              {t('max_3_patients')}
            </p>
            <Button variant="secondary" size="lg" onClick={() => router.push('/patient')}>
              {t('go_back')}
            </Button>
          </div>
        ) : (
        <form className="flex max-w-2xl flex-col gap-6" onSubmit={handleSubmit}>

          <Input id="name" label={`${t('full_name')} *`} value={form.name} onChange={set('name')} placeholder={t('placeholder_name')} required />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dementiaLevel" className={labelClass}>{t('dementia_level')} *</label>
            <select id="dementiaLevel" value={form.dementiaLevel} onChange={set('dementiaLevel')} className={`h-12 ${fieldClass}`} required>
              <option value="">{t('select_level')}</option>
              <option value="mild">{t('mild')}</option>
              <option value="moderate">{t('moderate')}</option>
              <option value="severe">{t('severe')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="age" label={`${t('age')} *`} type="number" min={0} max={130} value={form.age} onChange={set('age')} placeholder="e.g. 72" required />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className={labelClass}>{t('gender')} *</label>
              <select id="gender" value={form.gender} onChange={set('gender')} className={`h-12 ${fieldClass}`} required>
                <option value="">{t('select_gender')}</option>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t('patient_photo_optional')}</label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
            {photoPreview ? (
              <div className="flex items-center gap-4">
                <img src={photoPreview} alt={t('new_photo_preview')} className="h-24 w-24 rounded-md object-cover border-2 border-slate-200" />
                <Button type="button" variant="secondary" size="sm" onClick={() => photoInputRef.current?.click()}>
                  {t('change')}
                </Button>
              </div>
            ) : (
              <Button type="button" variant="secondary" onClick={() => photoInputRef.current?.click()}>
                {t('upload_photo')}
              </Button>
            )}
          </div>

          <Input id="phone" label={t('phone_number')} type="tel" value={form.phone} onChange={set('phone')} placeholder={t('placeholder_phone')} />
          <Input id="countryOfBirth" label={t('country_of_birth')} value={form.countryOfBirth} onChange={set('countryOfBirth')} placeholder={t('placeholder_country')} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className={labelClass}>{t('address_label')}</label>
            <textarea id="address" rows={3} value={form.address} onChange={set('address')} placeholder={t('placeholder_address')} className={`resize-none py-2.5 ${fieldClass}`} />
          </div>

          <Input id="birthday" label={t('date_of_birth')} type="date" value={form.birthday} onChange={set('birthday')} />

          <div className="grid grid-cols-2 gap-4">
            <Input id="height" label={t('height_cm')} type="number" min={0} value={form.height} onChange={set('height')} placeholder={t('placeholder_height')} />
            <Input id="weight" label={t('weight_kg')} type="number" min={0} value={form.weight} onChange={set('weight')} placeholder={t('placeholder_weight')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="medicalConditions" className={labelClass}>{t('medical_conditions')}</label>
            <textarea id="medicalConditions" rows={4} value={form.medicalConditions} onChange={set('medicalConditions')} placeholder={t('placeholder_medical')} className={`resize-none py-2.5 ${fieldClass}`} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? t('uploading') : t('create_account')}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.push('/patient')}>{t('cancel')}</Button>
          </div>

        </form>
        )}
      </Layout>
    </>
  )
}
