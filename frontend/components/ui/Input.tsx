'use client'

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-hilunia-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full bg-hilunia-surface border text-white placeholder-hilunia-text-dim rounded-2xl transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-hilunia-violet/50 focus:border-hilunia-violet',
              'h-12 px-4',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-12',
              error
                ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                : 'border-hilunia-border hover:border-hilunia-violet/40',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-hilunia-text-muted hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-hilunia-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-hilunia-text-dim">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, maxLength, showCount, value, ...props }, ref) => {
    const currentLength = String(value ?? '').length

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/80">{label}</label>
        )}
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full bg-hilunia-surface border text-white placeholder-hilunia-text-dim rounded-2xl p-4 resize-none transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-hilunia-violet/50 focus:border-hilunia-violet',
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-hilunia-border hover:border-hilunia-violet/40',
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && <p className="text-xs text-red-400">⚠ {error}</p>}
          {hint && !error && <p className="text-xs text-hilunia-text-dim">{hint}</p>}
          {showCount && maxLength && (
            <p className={cn('text-xs ml-auto', currentLength >= maxLength ? 'text-red-400' : 'text-hilunia-text-dim')}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
