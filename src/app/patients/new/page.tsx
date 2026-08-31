'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPatient } from '@/lib/db/queries'
import { DementiaLevel } from '@/lib/types'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const fieldClass = 'rounded-md border border-slate-300 px-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
const labelClass = 'text-sm font-medium text-slate-700'

export default function NewPatientPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', dementiaLevel: '', age: '', gender: '', phone: '', countryOfBirth: '', address: '',
    birthday: '', height: '', weight: '', medicalConditions: '',
  })

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.dementiaLevel || !form.age || !form.gender || !form.phone.trim() || !form.countryOfBirth || !form.address.trim()) return
    setSaving(true)
    const id = await createPatient({
      name: form.name.trim(),
      dementiaLevel: form.dementiaLevel as DementiaLevel,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      countryOfBirth: form.countryOfBirth,
      address: form.address.trim(),
      birthday: form.birthday || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      medicalConditions: form.medicalConditions || undefined,
    })
    router.push(`/patients/${id}`)
  }

  return (
    <>
      <Header title="New Patient" onBack={() => router.push('/caregiver')} onHome={() => router.push('/caregiver')} />
      <Layout>
        <form className="flex max-w-2xl flex-col gap-6" onSubmit={handleSubmit}>

          <Input id="name" label="Patient Name *" value={form.name} onChange={set('name')} placeholder="Full name" required />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dementiaLevel" className={labelClass}>Dementia Level *</label>
            <select id="dementiaLevel" value={form.dementiaLevel} onChange={set('dementiaLevel')} className={`h-11 ${fieldClass}`} required>
              <option value="">Select level…</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="age" label="Age *" type="number" min={0} max={130} value={form.age} onChange={set('age')} placeholder="e.g. 72" required />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className={labelClass}>Gender *</label>
              <select id="gender" value={form.gender} onChange={set('gender')} className={`h-11 ${fieldClass}`} required>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <Input id="phone" label="Phone Number *" type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. +1 555 000 0000" required />

          <Input id="countryOfBirth" label="Country of Birth *" value={form.countryOfBirth} onChange={set('countryOfBirth')} placeholder="e.g. United States" required />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className={labelClass}>Address *</label>
            <textarea id="address" rows={3} value={form.address} onChange={set('address')} placeholder="Full residential address…" className={`resize-none py-2.5 ${fieldClass}`} required />
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
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? 'Saving…' : 'Save Patient'}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.push('/caregiver')}>Cancel</Button>
          </div>

        </form>
      </Layout>
    </>
  )
}
