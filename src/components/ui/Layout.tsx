import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <main className={`mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 ${className}`}>
      {children}
    </main>
  )
}
