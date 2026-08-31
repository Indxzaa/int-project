'use client'

import { use, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay,
  PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
} from '@dnd-kit/core'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { RewardOverlay } from '@/components/ui/RewardOverlay'

const FRUITS = [
  { id: 'strawberry', src: '/strawberry.png', alt: 'Strawberry' },
  { id: 'banana',     src: '/banana.png',     alt: 'Banana' },
  { id: 'orange',     src: '/orange.png',     alt: 'Orange' },
]

function DraggableFruit({ id, src, alt }: { id: string; src: string; alt: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none select-none cursor-grab active:cursor-grabbing transition-opacity ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <Image src={src} alt={alt} width={120} height={120} className="object-contain pointer-events-none" />
    </div>
  )
}

function DroppableBasket({ isOver, dropped }: { isOver: boolean; dropped: string[] }) {
  const { setNodeRef } = useDroppable({ id: 'basket' })
  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-3xl p-4 transition-colors ${isOver ? 'bg-green-100 ring-4 ring-green-400' : ''}`}
    >
      <Image src="/basket.png" alt="Basket" width={260} height={260} className="object-contain pointer-events-none" />
      {dropped.length > 0 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
          {dropped.map(fruitId => {
            const fruit = FRUITS.find(f => f.id === fruitId)!
            return (
              <Image key={fruitId} src={fruit.src} alt={fruit.alt} width={56} height={56} className="object-contain drop-shadow" />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ShoppingBasketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? 'patient'
  const exitPath =
    from === 'patient' || from === 'role'
      ? `/patients/${id}/patient-mode/games?from=${from}`
      : `/patients/${id}`

  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const [activeId, setActiveId]       = useState<string | null>(null)
  const [isOver, setIsOver]           = useState(false)
  const [dropped, setDropped]         = useState<string[]>([])
  const [phase, setPhase]             = useState<'game' | 'reward'>('game')
  const [rewardPhoto, setRewardPhoto] = useState<Photo | null>(null)

  const activeFruit = FRUITS.find(f => f.id === activeId)
  const remaining   = FRUITS.filter(f => !dropped.includes(f.id))

  useEffect(() => {
    if (dropped.length !== FRUITS.length) return
    const valid = (photos ?? []).filter(p => p.blob)
    setRewardPhoto(valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null)
    setPhase('reward')
  }, [dropped.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string)
  const handleDragOver  = ({ over }: DragOverEvent)    => setIsOver(over?.id === 'basket')

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setIsOver(false)
    if (over?.id === 'basket' && !dropped.includes(active.id as string)) {
      setDropped(prev => [...prev, active.id as string])
    }
  }

  const handleNext = () => {
    setDropped([])
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
          aria-label="Back"
          className="absolute left-6 top-6 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400"
        >
          ←
        </button>

        <h1 className="mt-10 text-4xl font-bold text-slate-900">Shopping Basket</h1>
        <p className="mt-2 text-xl text-slate-500">Put all fruits into the basket.</p>

        <div className="flex flex-1 items-center justify-center gap-10">
          {remaining.map(fruit => (
            <DraggableFruit key={fruit.id} id={fruit.id} src={fruit.src} alt={fruit.alt} />
          ))}
        </div>

        <div className="mb-10">
          <DroppableBasket isOver={isOver} dropped={dropped} />
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
