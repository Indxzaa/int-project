'use client'

import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'

export default function RoleSelectPage() {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-slate-900">{t('app_title')}</h1>
        <p className="mt-2 text-xl text-slate-500">{t('select_role')}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-5">
        <button
          onClick={() => router.push('/caregiver')}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-10 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 "
        >
          <span className="text-6xl">👨‍⚕️</span>
          <span className="text-2xl font-bold text-slate-900">{t('role_caregiver')}</span>
        </button>
        <button
          onClick={() => router.push('/patient')}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-10 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 "
        >
          <span className="text-6xl">👤</span>
          <span className="text-2xl font-bold text-slate-900">{t('role_patient')}</span>
        </button>
        <button
          onClick={() => router.push('/settings?from=role')}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-5 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 "
        >
          <span className="text-2xl">⚙</span>
          <span className="text-xl font-semibold text-slate-700">{t('settings')}</span>
        </button>
      </div>
    </div>
  )
}
