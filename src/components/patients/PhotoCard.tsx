interface PhotoCardProps {
  src: string
  filename: string
  onDelete?: () => void
}

export function PhotoCard({ src, filename, onDelete }: PhotoCardProps) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
      {src
        ? /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} alt={filename} className="h-full w-full object-cover" />
        : <div className="h-full w-full bg-slate-200" aria-hidden />
      }
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label={`Delete ${filename}`}
        >
          🗑
        </button>
      )}
    </div>
  )
}
