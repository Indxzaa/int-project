import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  clickable?: boolean
}

export function Card({ clickable, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-md border border-slate-200 bg-white shadow-sm ${clickable ? 'cursor-pointer hover:border-slate-300 hover:shadow transition-shadow' : ''} ${className}`}
      {...props}
    />
  )
}
