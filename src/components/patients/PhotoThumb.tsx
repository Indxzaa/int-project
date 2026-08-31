'use client'

import { useState, useEffect } from 'react'
import { Photo } from '@/lib/types'

export function PhotoThumb({
  photo,
  selected,
  onToggle,
}: {
  photo: Photo
  selected: boolean
  onToggle: () => void
}) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(photo.blob)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [photo.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={photo.filename}
      className={`relative aspect-square overflow-hidden rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        selected ? 'border-blue-500' : 'border-slate-200'
      }`}
    >
      {src && <img src={src} alt={photo.filename} className="h-full w-full object-cover" />}
      {selected && (
        <div className="absolute inset-0 bg-blue-500/25 flex items-start justify-end p-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
        </div>
      )}
    </button>
  )
}
