'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { BlobImg } from '@/components/session/BlobImg'
import { RewardOverlay } from '@/components/ui/RewardOverlay'

type Card = { uniqueId: string; photo: Photo; pairId: string }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(photos: Photo[]): Card[] {
  const picked = shuffle([...photos]).slice(0, 2)
  return shuffle([
    { uniqueId: picked[0].id + '-a', photo: picked[0], pairId: picked[0].id },
    { uniqueId: picked[0].id + '-b', photo: picked[0], pairId: picked[0].id },
    { uniqueId: picked[1].id + '-a', photo: picked[1], pairId: picked[1].id },
    { uniqueId: picked[1].id + '-b', photo: picked[1], pairId: picked[1].id },
  ])
}

export default function MatchingPicturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? 'patient'
  const exitPath =
    from === 'patient' || from === 'role'
      ? `/patients/${id}/patient-mode/games?from=${from}`
      : `/patients/${id}`

  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])

  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [locked, setLocked] = useState(false)
  const [phase, setPhase] = useState<'game' | 'reward'>('game')
  const [rewardPhoto, setRewardPhoto] = useState<Photo | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allMatched = cards.length > 0 && matched.size === cards.length / 2

  useEffect(() => {
    if (!photos || photos.length < 2) return
    setCards(buildDeck(photos))
  }, [photos])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  useEffect(() => {
    if (!allMatched) return
    const valid = (photos ?? []).filter(p => p.blob)
    setRewardPhoto(valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null)
    setPhase('reward')
  }, [allMatched]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardTap = (card: Card) => {
    if (locked) return
    if (matched.has(card.pairId)) return
    if (flipped.includes(card.uniqueId)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, card.uniqueId]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const first = cards.find(c => c.uniqueId === newFlipped[0])
      const second = cards.find(c => c.uniqueId === newFlipped[1])
      if (first?.pairId === second?.pairId) {
        setMatched(prev => new Set([...prev, first!.pairId]))
        setFlipped([])
      } else {
        setLocked(true)
        timerRef.current = setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 1000)
      }
    }
  }

  const handleNext = () => {
    if (!photos || photos.length < 2) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setCards(buildDeck(photos))
    setFlipped([])
    setMatched(new Set())
    setLocked(false)
    setRewardPhoto(null)
    setPhase('game')
  }

  if (phase === 'reward') {
    return (
      <RewardOverlay
        photo={rewardPhoto?.blob}
        filename={rewardPhoto?.filename}
        onNext={handleNext}
        onExit={() => router.push(exitPath)}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 pb-16 pt-10">
      <button
        onClick={() => router.push(exitPath)}
        aria-label="Back"
        className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
      >
        ←
      </button>

      <h1 className="mb-10 text-4xl font-bold text-slate-900">Matching Picture</h1>

      {photos !== undefined && photos.length < 2 && (
        <p className="text-xl text-slate-500">Please upload at least 2 photos to play.</p>
      )}

      {cards.length > 0 && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {cards.map(card => {
            const isMatched = matched.has(card.pairId)
            const isFlipped = flipped.includes(card.uniqueId)
            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardTap(card)}
                disabled={isMatched}
                className={`aspect-square overflow-hidden rounded-2xl shadow-md transition-colors ${
                  isMatched ? 'border-4 border-green-400 bg-white'
                  : isFlipped ? 'border-4 border-slate-200 bg-white'
                  : 'bg-slate-700'
                }`}
              >
                {(isMatched || isFlipped) && (
                  <BlobImg blob={card.photo.blob} filename={card.photo.filename} className="h-full w-full object-cover" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
