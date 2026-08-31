'use client'

import { use, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import Image from 'next/image'
import {
  DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { RewardOverlay } from '@/components/ui/RewardOverlay'

type Item = { id: string; label: string; src: string }
type Sequence = { name: string; items: Item[]; correct: string[] }

const SEQUENCES: Sequence[] = [
  {
    name: 'Getting Dressed',
    items: [
      { id: 'shirt', label: 'Shirt', src: '/shirt.png' },
      { id: 'pants', label: 'Pants', src: '/pants.png' },
      { id: 'socks', label: 'Socks', src: '/socks.png' },
      { id: 'shoes', label: 'Shoes', src: '/shoes.png' },
    ],
    correct: ['shirt', 'pants', 'socks', 'shoes'],
  },
  {
    name: 'Brushing Teeth',
    items: [
      { id: 'toothpaste', label: 'Toothpaste', src: '/toothpaste.png' },
      { id: 'brush', label: 'Brush', src: '/brush.png' },
      { id: 'rinse', label: 'Rinse', src: '/rinse.png' },
      { id: 'spit', label: 'Spit', src: '/split.png' },
      { id: 'wash', label: 'Wash', src: '/wash.png' },
    ],
    correct: ['toothpaste', 'brush', 'rinse', 'spit', 'wash'],
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRound() {
  const seq = SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)]
  return { seq, items: shuffle(seq.items) }
}

function SortableCard({ item, index }: { item: Item; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={[
        'flex cursor-grab items-center gap-5 rounded-2xl border-4 bg-white px-6 py-4 shadow-sm transition-colors duration-150 active:cursor-grabbing',
        isDragging ? 'opacity-40 border-slate-300 scale-95' : 'border-slate-200',
      ].join(' ')}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-500">
        {index + 1}
      </span>
      <div className="relative h-24 w-24 shrink-0">
        <Image src={item.src} alt={item.label} fill className="object-contain pointer-events-none" />
      </div>
      <span className="text-2xl font-bold text-slate-900">{item.label}</span>
    </div>
  )
}

export default function PictureSequencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? 'patient'
  const exitPath =
    from === 'patient' || from === 'role'
      ? `/patients/${id}/patient-mode/games?from=${from}`
      : `/patients/${id}`

  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])
  const [round, setRound] = useState(() => pickRound())
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [rewardPhoto, setRewardPhoto] = useState<Photo | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setRound(prev => {
        const oldIndex = prev.items.findIndex(item => item.id === active.id)
        const newIndex = prev.items.findIndex(item => item.id === over.id)
        return { ...prev, items: arrayMove(prev.items, oldIndex, newIndex) }
      })
      setFeedback(null)
    }
  }

  const handleCheck = () => {
    const isCorrect = round.items.every((item, i) => item.id === round.seq.correct[i])
    if (isCorrect) {
      const valid = (photos ?? []).filter(p => p.blob)
      setRewardPhoto(valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null)
    }
    setFeedback(isCorrect ? 'correct' : 'incorrect')
  }

  const handleNext = () => {
    setRound(pickRound())
    setFeedback(null)
    setRewardPhoto(null)
  }

  if (feedback === 'correct') {
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
      <button onClick={() => router.push(exitPath)} aria-label="Back"
        className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400">←</button>

      <h1 className="mb-2 text-4xl font-bold text-slate-900">Picture Sequence</h1>
      <p className="mb-10 text-xl text-slate-500">{round.seq.name} — Drag to arrange in the correct order.</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={round.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex w-full max-w-sm flex-col gap-4 select-none">
            {round.items.map((item, i) => (
              <SortableCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {feedback === 'incorrect' && (
        <p className="mt-10 text-2xl font-semibold text-amber-600">Try Again</p>
      )}

      {(feedback === null || feedback === 'incorrect') && (
        <button onClick={handleCheck}
          className="mt-10 rounded-2xl bg-blue-600 px-14 py-5 text-3xl font-bold text-white shadow-md hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 active:scale-95 transition-transform">
          Check ✓
        </button>
      )}
    </div>
  )
}
