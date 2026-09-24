import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  clickable?: boolean
}

export function Card({ clickable, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${clickable ? 'cursor-pointer hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30 active:scale-[0.99] transition-all duration-150' : ''} ${className}`}
      {...props}
    />
  )
}
