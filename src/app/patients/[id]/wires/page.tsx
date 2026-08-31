'use client'

import { use, useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { Photo } from '@/lib/types'
import { BlobImg } from '@/components/session/BlobImg'

const COLORS = [
  { name: 'Red',    hex: '#EF4444' },
  { name: 'Blue',   hex: '#3B82F6' },
  { name: 'Green',  hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
]

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

const shuffledDifferent = <T,>(orig: T[]): T[] => {
  let r = shuffle(orig)
  while (r.every((v, i) => v === orig[i])) r = shuffle(orig)
  return r
}

const buildRound = () => shuffledDifferent(COLORS)

const ENDPOINT_R = 28
const HIT_R = 50
const LEFT_X_RATIO = 0.15
const RIGHT_X_RATIO = 0.85

type DragState = { leftIdx: number } | null

export default function WiresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const exitPath = from === 'patient' || from === 'role'
    ? `/patients/${id}/patient-mode/games`
    : `/patients/${id}`
  const svgRef = useRef<SVGSVGElement>(null)

  const photos = useLiveQuery(() => db.photos.where('patientId').equals(id).toArray(), [id])

  const [svgSize, setSvgSize] = useState({ w: 600, h: 700 })
  const [rightOrder, setRightOrder] = useState(() => buildRound())
  const [connections, setConnections] = useState<Map<number, number>>(new Map())
  const [drag, setDrag] = useState<DragState>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [phase, setPhase] = useState<'puzzle' | 'reward'>('puzzle')
  const [rewardPhoto, setRewardPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    const measure = () => {
      if (svgRef.current) {
        const r = svgRef.current.getBoundingClientRect()
        setSvgSize({ w: r.width, h: r.height })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const LEFT_X = svgSize.w * LEFT_X_RATIO
  const RIGHT_X = svgSize.w * RIGHT_X_RATIO
  const spacing = svgSize.h / (COLORS.length + 1)
  const leftYs = COLORS.map((_, i) => (i + 1) * spacing)
  const rightYs = rightOrder.map((_, i) => (i + 1) * spacing)

  const toSvg = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const rect = svgRef.current.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bezier = (x1: number, y1: number, x2: number, y2: number) => {
    const cx = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`
  }

  const startDrag = useCallback((e: React.PointerEvent, leftIdx: number) => {
    if (connections.has(leftIdx) || phase !== 'puzzle') return
    e.currentTarget.releasePointerCapture(e.pointerId)
    svgRef.current?.setPointerCapture(e.pointerId)
    const pos = toSvg(e.clientX, e.clientY)
    setDrag({ leftIdx })
    setDragPos(pos)
  }, [connections, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return
    setDragPos(toSvg(e.clientX, e.clientY))
  }, [drag]) // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return
    const pos = toSvg(e.clientX, e.clientY)
    const takenRight = new Set(connections.values())

    const hitIdx = rightYs.findIndex((ry, ri) => {
      if (takenRight.has(ri)) return false
      const dx = pos.x - RIGHT_X
      const dy = pos.y - ry
      return Math.sqrt(dx * dx + dy * dy) <= HIT_R
    })

    if (hitIdx !== -1 && COLORS[drag.leftIdx].hex === rightOrder[hitIdx].hex) {
      const next = new Map(connections)
      next.set(drag.leftIdx, hitIdx)
      setConnections(next)
      if (next.size === COLORS.length) {
        const valid = photos?.filter(p => p.blob) ?? []
        const pick = valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null
        setRewardPhoto(pick)
        setPhase('reward')
      }
    }

    setDrag(null)
  }, [drag, connections, rightYs, RIGHT_X, rightOrder, photos]) // eslint-disable-line react-hooks/exhaustive-deps

  const nextRound = useCallback(() => {
    setRightOrder(buildRound())
    setConnections(new Map())
    setDrag(null)
    setRewardPhoto(null)
    setPhase('puzzle')
  }, [])

  // ── Reward screen ──
  if (phase === 'reward') {
    return (
      <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white">
        <button
          onClick={() => router.push(exitPath)}
          aria-label="Exit game"
          className="absolute right-5 top-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-700 hover:bg-slate-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          ✕
        </button>

        {rewardPhoto ? (
          <BlobImg
            blob={rewardPhoto.blob}
            filename={rewardPhoto.filename}
            className="max-h-[75vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <p className="text-2xl font-bold text-slate-700">Well done!</p>
        )}

        <button
          onClick={nextRound}
          className="absolute bottom-8 right-8 flex h-16 items-center gap-3 rounded-full bg-white px-8 text-xl font-semibold text-slate-900 shadow-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Next →
        </button>
      </div>
    )
  }

  // ── Puzzle screen ──
  return (
    <div
      className="relative h-screen w-screen overflow-hidden select-none bg-gray-200"
    >
      <button
        onClick={() => router.push(exitPath)}
        aria-label="Exit game"
        className="absolute right-5 top-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-2xl text-slate-700 hover:bg-white shadow-md backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        ✕
      </button>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="absolute inset-0 touch-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Locked connections */}
        {Array.from(connections.entries()).map(([li, ri]) => (
          <path
            key={`conn-${li}`}
            d={bezier(LEFT_X, leftYs[li], RIGHT_X, rightYs[ri])}
            stroke={COLORS[li].hex}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {/* Live drag line */}
        {drag !== null && (
          <path
            d={bezier(LEFT_X, leftYs[drag.leftIdx], dragPos.x, dragPos.y)}
            stroke={COLORS[drag.leftIdx].hex}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray="18 9"
            fill="none"
            opacity={0.8}
          />
        )}

        {/* Right endpoints */}
        {rightOrder.map((color, ri) => {
          const taken = Array.from(connections.values()).includes(ri)
          return (
            <circle
              key={`r-${ri}`}
              cx={RIGHT_X} cy={rightYs[ri]} r={ENDPOINT_R}
              fill={color.hex}
              stroke={taken ? '#1e293b' : '#fff'}
              strokeWidth={5}
              opacity={taken ? 0.55 : 1}
            />
          )
        })}

        {/* Left endpoints */}
        {COLORS.map((color, li) => {
          const connected = connections.has(li)
          return (
            <circle
              key={`l-${li}`}
              cx={LEFT_X} cy={leftYs[li]} r={ENDPOINT_R}
              fill={color.hex}
              stroke={connected ? '#1e293b' : '#fff'}
              strokeWidth={5}
              opacity={connected ? 0.55 : 1}
              style={{ cursor: connected ? 'default' : 'grab', touchAction: 'none' }}
              onPointerDown={e => startDrag(e, li)}
              aria-label={`${color.name} wire`}
              role="button"
            />
          )
        })}
      </svg>
    </div>
  )
}
