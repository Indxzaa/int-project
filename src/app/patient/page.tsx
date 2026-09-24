'use client'

import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { useI18n } from '@/lib/i18n'

export default function PatientSelectPage() {
  const router = useRouter()
  const { t } = useI18n()
  const patients = useLiveQuery(() => db.patients.orderBy('name').toArray(), [])

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pt-16 pb-12">
      <button
        onClick={() => router.push('/')}
        aria-label={t('back')}
        className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-600 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
      >
        ←
      </button>
      <button
        onClick={() => router.push('/settings?from=patient')}
        aria-label={t('settings')}
        className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-600 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
      >
        ⚙
      </button>
      <h1 className="mb-3 text-4xl font-bold text-slate-900">{t('your_patients')}</h1>
      <p className="mb-12 text-xl text-slate-500">{t('select_patient_continue')}</p>

      <div className="flex w-full max-w-md flex-col gap-4">
        {patients?.map(patient => (
          <button
            key={patient.id}
            onClick={() => router.push(`/patients/${patient.id}/patient-mode?from=role`)}
            className="flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 py-7 text-3xl font-bold text-slate-900 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 "
          >
            {patient.name}
          </button>
        ))}
        {patients !== undefined && patients.length === 0 && (
          <p className="py-10 text-center text-xl text-slate-400">{t('no_patients_registered')}</p>
        )}

        <button
          onClick={() => router.push('/patient/new')}
          className="mt-4 flex items-center justify-center rounded-2xl border-2 border-blue-500 bg-blue-50 px-8 py-6 text-2xl font-semibold text-blue-700 shadow-sm hover:bg-blue-100 hover:shadow-md active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 "
        >
          {t('create_patient_account')}
        </button>
      </div>
    </div>
  )
}
