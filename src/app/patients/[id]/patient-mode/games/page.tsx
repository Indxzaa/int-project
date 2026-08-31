'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'

const AVAILABLE_GAMES = [
  { icon: '🔴', title: 'Red Dot Memory', route: '/session' },
  { icon: '🔌', title: 'Connect the Wires', route: '/wires' },
  { icon: '🖼️', title: 'Picture Sequence', route: '/picture-sequence' },
  { icon: '🧩', title: 'Matching Picture', route: '/matching-picture' },
  { icon: '🛒', title: 'Shopping Basket', route: '/shopping-basket' },
]

export default function PatientGamesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? 'patient'

  const patient = useLiveQuery(() => db.patients.get(id), [id])

  if (!patient) return null

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white px-6 pb-12 pt-10">

      {/* Back to profile — top left */}
      <button
        onClick={() => router.push(`/patients/${id}/patient-mode?from=${from}`)}
        aria-label="Back to profile"
        className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
      >
        ←
      </button>

      {/* Patient name */}
      <h1 className="mb-10 text-center text-5xl font-bold text-slate-900 leading-tight">
        {patient.name}
      </h1>

      {/* Game cards */}
      <div className="flex w-full max-w-lg flex-col gap-5">
        {AVAILABLE_GAMES.map(game => (
          <button
            key={game.route}
            onClick={() => router.push(`/patients/${id}${game.route}?from=${from}`)}
            className="flex items-center gap-6 rounded-2xl border-2 border-slate-200 bg-white px-8 py-7 text-left shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 active:scale-[0.98] transition-colors"
          >
            <span className="shrink-0 text-6xl">{game.icon}</span>
            <span className="text-3xl font-bold text-slate-900">{game.title}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
