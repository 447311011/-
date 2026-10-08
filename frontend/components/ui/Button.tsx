'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 select-none'

    const variants = {
      primary: 'bg-gradient-hilunia text-white shadow-hilunia hover:shadow-hilunia-lg hover:scale-[1.02]',
      secondary: 'bg-hilunia-surface text-white border border-hilunia-border hover:bg-hilunia-surface-2 hover:border-hilunia-violet/40',
      ghost: 'text-hilunia-text-muted hover:bg-hilunia-surface hover:text-white',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
      outline: 'border border-hilunia-violet text-hilunia-violet hover:bg-hilunia-violet hover:text-white',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-xl',
      md: 'h-11 px-5 text-sm rounded-2xl',
      lg: 'h-13 px-7 text-base rounded-2xl',
      icon: 'h-10 w-10 rounded-2xl',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
