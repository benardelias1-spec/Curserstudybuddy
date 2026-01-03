import * as React from 'react'
import { cn } from '../../lib/utils'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'h-9 px-3' : 'h-10 px-4',
        variant === 'primary' &&
          'bg-slate-900 text-white shadow-sm hover:bg-slate-800',
        variant === 'secondary' &&
          'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50',
        variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-slate-100',
        className,
      )}
      {...props}
    />
  )
}

