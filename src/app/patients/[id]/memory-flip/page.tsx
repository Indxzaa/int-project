'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { BlobImg } from '@/components/session/BlobImg'

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

export default function MemoryFlipPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [lastViewedUniqueId, setLastViewedUniqueId] = useState<string | null>(null)
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allMatched = cards.length > 0 && matchedPairIds.size === cards.length / 2

  useEffect(() => {
    if (!photos || photos.length < 2) return
    setCards(buildDeck(photos))
  }, [photos])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleCardTap = (card: Card) => {
    if (flippedId !== null) return
    if (matchedPairIds.has(card.pairId)) return
    if (card.uniqueId === lastViewedUniqueId) return

    setFlippedId(card.uniqueId)
    timerRef.current = setTimeout(() => {
      if (lastViewedUniqueId !== null) {
        const lastCard = cards.find(c => c.uniqueId === lastViewedUniqueId)
        if (lastCard?.pairId === card.pairId) {
          setMatchedPairIds(prev => new Set([...prev, card.pairId]))
        }
        setLastViewedUniqueId(null)
      } else {
        setLastViewedUniqueId(card.uniqueId)
      }
      setFlippedId(null)
    }, 5000)
  }

  const handleNext = () => {
    if (!photos || photos.length < 2) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setCards(buildDeck(photos))
    setFlippedId(null)
    setLastViewedUniqueId(null)
    setMatchedPairIds(new Set())
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

      <h1 className="mb-10 text-4xl font-bold text-slate-900">Memory Flip Match</h1>

      {photos !== undefined && photos.length < 2 && (
        <p className="text-xl text-slate-500">Please upload at least 2 photos to play.</p>
      )}

      {allMatched && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl text-green-600">✓</div>
          <p className="text-3xl font-bold text-green-600">Great Job!</p>
          <button
            onClick={handleNext}
            className="rounded-2xl bg-green-600 px-12 py-5 text-2xl font-bold text-white shadow-md hover:bg-green-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 active:scale-95 transition-transform"
          >
            Next →
          </button>
        </div>
      )}

      {cards.length > 0 && !allMatched && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {cards.map(card => {
            const isMatched = matchedPairIds.has(card.pairId)
            const isFlipped = flippedId === card.uniqueId
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
