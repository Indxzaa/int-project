'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { deletePatient } from '@/lib/db/queries'
import { Header } from '@/components/ui/Header'
import { Layout } from '@/components/ui/Layout'
import { SearchBar } from '@/components/ui/SearchBar'
import { Button } from '@/components/ui/Button'
import { PatientCard } from '@/components/patients/PatientCard'

export default function CaregiverPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const patients = useLiveQuery(() => db.patients.orderBy('createdAt').reverse().toArray(), [])

  const filtered = patients?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <>
      <Header
        title="Memory Care"
        onBack={() => router.push('/')}
        actions={<Button size="md" onClick={() => router.push('/patients/new')}>＋ New Patient</Button>}
      />
      <Layout className="flex flex-col gap-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search patients…" />
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
              {search ? 'No patients match your search.' : 'No patients yet. Add one to get started.'}
            </p>
          )}
        </div>
      </Layout>
    </>
  )
}
