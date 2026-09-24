'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { useI18n } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n/translations'

const AVAILABLE_GAMES: { icon: string; titleKey: TranslationKey; route: string }[] = [
  { icon: '🔴', titleKey: 'red_dot_memory',   route: '/session' },
  { icon: '🔌', titleKey: 'connect_wires',    route: '/wires' },
  { icon: '🖼️', titleKey: 'picture_sequence', route: '/picture-sequence' },
  { icon: '🧩', titleKey: 'matching_picture', route: '/matching-picture' },
  { icon: '🛒', titleKey: 'shopping_basket',  route: '/shopping-basket' },
]

export default function PatientGamesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useI18n()
  const from = searchParams.get('from') ?? 'patient'

  const patient = useLiveQuery(() => db.patients.get(id), [id])

  if (!patient) return null

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-5 pb-12 pt-14">
      <button
        onClick={() => router.push(`/patients/${id}/patient-mode?from=${from}`)}
        aria-label={t('back_to_profile')}
        className="absolute left-4 top-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-700 hover:bg-slate-200 active:scale-95 transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
      >
        ←
      </button>

      <h1 className="mb-8 mt-2 text-center text-4xl font-bold text-slate-900 leading-tight">
        {patient.name}
      </h1>

      <div className="flex w-full max-w-md flex-col gap-4">
        {AVAILABLE_GAMES.map(game => (
          <button
            key={game.route}
            onClick={() => router.push(`/patients/${id}${game.route}?from=${from}`)}
            className="flex items-center gap-5 rounded-2xl border-2 border-slate-200 bg-white px-6 py-6 text-left shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 active:scale-[0.98] transition-all duration-150"
          >
            <span className="shrink-0 text-5xl">{game.icon}</span>
            <span className="text-2xl font-bold text-slate-900">{t(game.titleKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
