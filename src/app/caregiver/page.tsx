'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { useI18n } from '@/lib/i18n'
import { deletePatient } from '@/lib/db/queries'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { SearchBar } from '@/components/ui/SearchBar'
import { Button } from '@/components/ui/Button'
import { PatientCard } from '@/components/patients/PatientCard'

export default function CaregiverPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const patients = useLiveQuery(() => db.patients.orderBy('createdAt').reverse().toArray(), [])

  const filtered = patients?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <>
      <Header
        title={t('app_title')}
        onBack={() => router.push('/')}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => router.push('/settings?from=caregiver')} aria-label={t('settings')}>⚙ <span className="hidden sm:inline">{t('settings')}</span></Button>
            <Button size="sm" onClick={() => router.push('/patients/new')}>{t('new_patient')}</Button>
          </div>
        }
      />
      <Layout className="flex flex-col gap-6">
        <SearchBar value={search} onChange={setSearch} placeholder={t('search_patients')} />
        <div className="flex flex-col gap-3">
          {filtered.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => router.push(`/patients/${patient.id}`)}
              onDelete={() => deletePatient(patient.id)}
            />
          ))}
          {patients !== undefined && filtered.length === 0 && (
            <p className="py-16 text-center text-slate-400">
              {search ? t('no_patients_match') : t('no_patients')}
            </p>
          )}
        </div>
      </Layout>
    </>
  )
}
