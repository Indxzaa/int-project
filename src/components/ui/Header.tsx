import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  onBack?: () => void
  onHome?: () => void
  actions?: ReactNode
}

export function Header({ title, onBack, onHome, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-3 sm:px-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <h1 className="flex-1 truncate text-lg font-semibold text-slate-900">{title}</h1>
        {(onHome || actions) && (
          <div className="flex items-center gap-1.5 shrink-0">
            {onHome && (
              <button
                onClick={onHome}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                🏠 <span className="hidden sm:inline">Home</span>
              </button>
            )}
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
