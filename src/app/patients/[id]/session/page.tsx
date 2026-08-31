'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { createSession, addPhotoToSession, closeSession } from '@/lib/db/queries'
import { Button } from '@/components/ui/Button'
import { BlobImg } from '@/components/session/BlobImg'

const randPos = () => ({ x: 15 + Math.random() * 70, y: 20 + Math.random() * 60 })

const REQUIRED_TAPS = { severe: 1, moderate: 2, mild: 3 }

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'dot' | 'photo'>('dot')
  const [dotPos, setDotPos] = useState(randPos)
  const [taps, setTaps] = useState(0)
  const sessionCreated = useRef(false)

  const patient = useLiveQuery(() => db.patients.get(id), [id])
  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])
  const required = patient ? REQUIRED_TAPS[patient.dementiaLevel] : 1

  useEffect(() => {
    if (photos && photos.length > 0 && !sessionCreated.current) {
      sessionCreated.current = true
      createSession(id).then(setSessionId)
    }
  }, [photos, id])

  const handleDotTap = useCallback(async () => {
    const next = taps + 1
    if (next >= required) {
      if (sessionId && photos) await addPhotoToSession(sessionId, photos[index].id)
      setTaps(0)
      setPhase('photo')
    } else {
      setTaps(next)
      setDotPos(randPos())
    }
  }, [taps, required, sessionId, photos, index])

  const handleNext = useCallback(async () => {
    if (!photos) return
    const isLast = index >= photos.length - 1
    if (isLast) {
      if (sessionId) await closeSession(sessionId)
      const base = sessionId
        ? `/patients/${id}/session/summary?sessionId=${sessionId}`
        : `/patients/${id}`
      router.push(from === 'patient' || from === 'role' ? `${base}&from=${from}` : base)
    } else {
      setIndex(i => i + 1)
      setTaps(0)
      setDotPos(randPos())
      setPhase('dot')
    }
  }, [sessionId, photos, index, id, router, from])

  const handleExit = useCallback(async () => {
    if (sessionId) await closeSession(sessionId)
    const base = sessionId
      ? `/patients/${id}/session/summary?sessionId=${sessionId}`
      : `/patients/${id}`
    router.push(from === 'patient' ? `${base}&from=patient` : base)
  }, [sessionId, id, router, from])

  if (!photos) return null

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 p-8 pt-20 text-center">
        <span className="text-5xl">🖼️</span>
        <p className="text-lg font-medium text-slate-700">No photos uploaded yet.</p>
        <p className="text-slate-500">Add photos to this patient&apos;s profile before starting a session.</p>
        <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white select-none">

      <button
        onClick={handleExit}
        aria-label="Exit session"
        className="absolute right-5 top-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        ✕
      </button>

      {phase === 'dot' && (
        <button
          onClick={handleDotTap}
          aria-label="Tap the red dot"
          style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%`, transform: 'translate(-50%, -50%)' }}
          className="absolute z-30 h-28 w-28 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:bg-red-400 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
        />
      )}

      {phase === 'photo' && (
        <div className="flex h-full w-full items-center justify-center p-10">
          <BlobImg blob={photos[index].blob} filename={photos[index].filename} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
        </div>
      )}

      {phase === 'photo' && (
        <button
          onClick={handleNext}
          className="absolute bottom-8 right-8 z-50 flex h-16 items-center gap-3 rounded-full bg-white px-8 text-lg font-semibold text-slate-900 shadow-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {index >= photos.length - 1 ? 'Finish ✓' : 'Next →'}
        </button>
      )}

    </div>
  )
}
