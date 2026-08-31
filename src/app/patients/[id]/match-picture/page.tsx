'use client'

import { use, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { BlobImg } from '@/components/session/BlobImg'

const CONFIG = {
  severe:   { choices: 2, viewTime: null as null },
  moderate: { choices: 3, viewTime: 8000 },
  mild:     { choices: 4, viewTime: 5000 },
}
const DEFAULT_CONFIG = { choices: 4, viewTime: 5000 }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildChoices(target: Photo, allPhotos: Photo[], numChoices: number): Photo[] {
  const others = shuffle(allPhotos.filter(p => p.id !== target.id))
  return shuffle([target, ...others.slice(0, numChoices - 1)])
}

export default function MatchPicturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? 'patient'
  const exitPath =
    from === 'patient' || from === 'role'
      ? `/patients/${id}/patient-mode/games?from=${from}`
      : `/patients/${id}`

  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])
  const patient = useLiveQuery(() => db.patients.get(id), [id])

  const [target, setTarget] = useState<Photo | null>(null)
  const [phase, setPhase] = useState<'viewing' | 'answering'>('viewing')
  const [choices, setChoices] = useState<Photo[]>([])
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const config = patient ? (CONFIG[patient.dementiaLevel] ?? DEFAULT_CONFIG) : null

  const showAnswers = (tgt: Photo, allPhotos: Photo[]) => {
    const numChoices = Math.min(config?.choices ?? 2, allPhotos.length)
    setChoices(buildChoices(tgt, allPhotos, numChoices))
    setPhase('answering')
  }

  useEffect(() => {
    if (photos && photos.length > 0 && !target) {
      setTarget(photos[Math.floor(Math.random() * photos.length)])
    }
  }, [photos, target])

  useEffect(() => {
    if (!target || !config || config.viewTime === null) return
    const snapshot = { target, photos: photos ?? [] }
    const timer = setTimeout(() => showAnswers(snapshot.target, snapshot.photos), config.viewTime)
    return () => clearTimeout(timer)
  }, [target?.id, config?.viewTime]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = () => {
    if (!target || !photos) return
    showAnswers(target, photos)
  }

  const handleChoiceSelect = (photo: Photo) => {
    setResult(photo.id === target?.id ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    if (!photos || photos.length === 0) return
    const candidates = photos.length > 1 ? photos.filter(p => p.id !== target?.id) : photos
    setTarget(candidates[Math.floor(Math.random() * candidates.length)])
    setPhase('viewing')
    setChoices([])
    setResult(null)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pb-16 pt-10">
      <button onClick={() => router.push(exitPath)} aria-label="Back"
        className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400">
        ←
      </button>

      <h1 className="mb-10 text-4xl font-bold text-slate-900">Match the Right Picture</h1>

      {photos === undefined && <p className="text-xl text-slate-400">Loading…</p>}

      {photos !== undefined && photos.length === 0 && (
        <p className="text-xl text-slate-500">Please upload family photos first.</p>
      )}

      {target && phase === 'viewing' && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-2xl font-semibold text-slate-600">Remember this photo.</p>
          <div className="h-64 w-64 overflow-hidden rounded-2xl border-4 border-slate-200 shadow-lg">
            <BlobImg blob={target.blob} filename={target.filename} className="h-full w-full object-cover" />
          </div>
          {config?.viewTime === null && (
            <button onClick={handleContinue}
              className="mt-4 rounded-2xl bg-blue-600 px-12 py-5 text-2xl font-bold text-white shadow-md hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 active:scale-95 transition-transform">
              Continue →
            </button>
          )}
        </div>
      )}

      {phase === 'answering' && choices.length > 0 && result === 'correct' && target && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl text-green-600">✓</div>
          <p className="text-3xl font-bold text-green-600">Great Job!</p>
          <div className="h-56 w-56 overflow-hidden rounded-2xl border-4 border-green-300 shadow-lg">
            <BlobImg blob={target.blob} filename={target.filename} className="h-full w-full object-cover" />
          </div>
          <button onClick={handleNext}
            className="rounded-2xl bg-green-600 px-12 py-5 text-2xl font-bold text-white shadow-md hover:bg-green-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 active:scale-95 transition-transform">
            Next →
          </button>
        </div>
      )}

      {phase === 'answering' && choices.length > 0 && result !== 'correct' && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          {result === 'wrong' && (
            <p className="text-xl font-semibold text-amber-500">Try Again</p>
          )}
          <p className="text-2xl font-semibold text-slate-600">Which photo was it?</p>
          <div className="grid w-full grid-cols-2 gap-4">
            {choices.map(photo => (
              <button key={photo.id} onClick={() => handleChoiceSelect(photo)}
                className="aspect-square overflow-hidden rounded-2xl border-4 border-slate-200 bg-white shadow-sm hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 active:scale-95 transition-all">
                <BlobImg blob={photo.blob} filename={photo.filename} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
