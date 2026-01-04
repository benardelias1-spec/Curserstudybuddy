import * as React from 'react'
import { cn } from '../../lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-10 w-full rounded-xl bg-white px-3 text-sm text-slate-900 ring-1 ring-slate-200',
          'placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

