'use client'

import { use, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import Image from 'next/image'
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay,
  PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
} from '@dnd-kit/core'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import { RewardOverlay } from '@/components/ui/RewardOverlay'
import type { TranslationKey } from '@/lib/i18n/translations'

const FRUITS = [
  { id: 'strawberry', src: '/strawberry.png', alt: 'Strawberry', labelKey: 'strawberry' as TranslationKey },
  { id: 'banana',     src: '/banana.png',     alt: 'Banana',     labelKey: 'banana' as TranslationKey },
  { id: 'orange',     src: '/orange.png',     alt: 'Orange',     labelKey: 'orange' as TranslationKey },
] as const

type FruitId = typeof FRUITS[number]['id']
type FruitCounts = Record<FruitId, number>

const randomRequired = (): number => Math.floor(Math.random() * 3) + 1

const buildQuantities = (): FruitCounts => ({
  strawberry: randomRequired(),
  banana: randomRequired(),
  orange: randomRequired(),
})

const ZERO_COUNTS: FruitCounts = { strawberry: 0, banana: 0, orange: 0 }

function DraggableFruit({
  id, src, alt, remaining, completed, label,
}: {
  id: string; src: string; alt: string; remaining: number; completed: boolean; label: string
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: completed,
  })
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={setNodeRef}
        {...(completed ? {} : listeners)}
        {...attributes}
        className={`transition-opacity ${
          completed
            ? 'cursor-default opacity-40'
            : isDragging
              ? 'cursor-grab opacity-30'
              : 'cursor-grab opacity-100'
        }`}
        style={{ touchAction: completed ? 'auto' : 'none', userSelect: 'none' }}
      >
        <div className="relative">
          <Image src={src} alt={alt} width={120} height={120} className="object-contain pointer-events-none" />
          {completed && (
            <span className="absolute inset-0 flex items-center justify-center text-5xl text-green-600">✓</span>
          )}
        </div>
      </div>
      <span
        className={`text-2xl font-bold ${
          completed ? 'text-slate-400' : 'text-slate-800'
        }`}
      >
        {label} ×{remaining}
      </span>
    </div>
  )
}

function DroppableBasket({ isOver, counts }: { isOver: boolean; counts: FruitCounts }) {
  const { setNodeRef } = useDroppable({ id: 'basket' })
  const collected = FRUITS.flatMap(fruit =>
    Array.from({ length: counts[fruit.id] }, (_, i) => (
      <Image
        key={`${fruit.id}-${i}`}
        src={fruit.src}
        alt={fruit.alt}
        width={56}
        height={56}
        className="object-contain drop-shadow"
      />
    ))
  )
  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-3xl p-4 transition-colors ${isOver ? 'bg-green-100 ring-4 ring-green-400' : ''}`}
    >
      <Image src="/basket.png" alt="Basket" width={260} height={260} className="object-contain pointer-events-none" />
      {collected.length > 0 && (
        <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-3">
          {collected}
        </div>
      )}
    </div>
  )
}

export default function ShoppingBasketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? 'patient'
  const exitPath =
    from === 'patient' || from === 'role'
      ? `/patients/${id}/patient-mode/games?from=${from}`
      : `/patients/${id}`

  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const [activeId, setActiveId]     = useState<string | null>(null)
  const [isOver, setIsOver]         = useState(false)
  const [required, setRequired]     = useState<FruitCounts>(buildQuantities)
  const [collected, setCollected]   = useState<FruitCounts>(ZERO_COUNTS)
  const [phase, setPhase]           = useState<'game' | 'reward'>('game')
  const [rewardPhoto, setRewardPhoto] = useState<Photo | null>(null)

  const activeFruit = FRUITS.find(f => f.id === activeId)
  const allDone = FRUITS.every(f => collected[f.id] >= required[f.id])

  useEffect(() => {
    if (!allDone) return
    const valid = (photos ?? []).filter(p => p.blob)
    setRewardPhoto(valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null)
    setPhase('reward')
  }, [allDone]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string)
  const handleDragOver  = ({ over }: DragOverEvent)      => setIsOver(over?.id === 'basket')

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setIsOver(false)
    if (over?.id !== 'basket') return
    const fruitId = active.id as FruitId
    const remaining = required[fruitId] - collected[fruitId]
    if (remaining <= 0) return
    setCollected(prev => ({ ...prev, [fruitId]: prev[fruitId] + 1 }))
  }

  const handleNext = () => {
    setRequired(buildQuantities())
    setCollected(ZERO_COUNTS)
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
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="relative flex min-h-screen flex-col items-center bg-white">
        <button
          onClick={() => router.push(exitPath)}
          aria-label={t('exit')}
          className="absolute left-4 top-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-700 hover:bg-slate-200 active:scale-95 transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
        >
          ←
        </button>

        <h1 className="mt-10 text-4xl font-bold text-slate-900">{t('shopping_basket')}</h1>
        <p className="mt-2 text-xl text-slate-500">{t('basket_instruction')}</p>

        <div className="flex flex-1 items-center justify-center gap-10">
          {FRUITS.map(fruit => {
            const remaining = required[fruit.id] - collected[fruit.id]
            return (
              <DraggableFruit
                key={fruit.id}
                id={fruit.id}
                src={fruit.src}
                alt={fruit.alt}
                label={t(fruit.labelKey)}
                remaining={remaining}
                completed={remaining <= 0}
              />
            )
          })}
        </div>

        <div className="mb-10">
          <DroppableBasket isOver={isOver} counts={collected} />
        </div>
      </div>

      <DragOverlay>
        {activeFruit && (
          <Image src={activeFruit.src} alt={activeFruit.alt} width={120} height={120} className="object-contain drop-shadow-xl" />
        )}
      </DragOverlay>
    </DndContext>
  )
}
