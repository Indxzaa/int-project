import { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 active:bg-blue-800',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-400 active:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 active:bg-red-800',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400 active:bg-slate-200',
}

const sizes = {
  sm: 'px-4 py-2 text-base min-h-[44px]',
  md: 'px-5 py-3 text-base min-h-[48px]',
  lg: 'px-7 py-4 text-lg min-h-[56px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
