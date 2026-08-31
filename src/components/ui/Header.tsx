import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  onBack?: () => void
  onHome?: () => void
  actions?: ReactNode
}

export function Header({ title, onBack, onHome, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <h1 className="flex-1 text-xl font-semibold text-slate-900">{title}</h1>
        {(onHome || actions) && (
          <div className="flex items-center gap-2">
            {onHome && (
              <button
                onClick={onHome}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              >
                🏠 Home
              </button>
            )}
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
