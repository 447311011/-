import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'violet' | 'rose' | 'coral' | 'green' | 'gold' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-hilunia-surface text-hilunia-text-muted border border-hilunia-border',
    violet: 'bg-hilunia-violet/20 text-hilunia-violet-light',
    rose: 'bg-hilunia-rose/20 text-hilunia-rose-light',
    coral: 'bg-hilunia-coral/20 text-hilunia-coral',
    green: 'bg-emerald-500/20 text-emerald-400',
    gold: 'bg-yellow-500/20 text-yellow-400',
    outline: 'border border-hilunia-violet text-hilunia-violet',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] rounded-full',
    md: 'px-3 py-1 text-xs rounded-full',
  }

  return (
    <span className={cn('inline-flex items-center font-medium gap-1', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

// Badge "En ligne"
export function OnlineBadge({ isOnline }: { isOnline: boolean }) {
  if (!isOnline) return null
  return (
    <Badge variant="green" size="sm">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      En ligne
    </Badge>
  )
}

// Badge "Vérifié"
export function VerifiedBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <Badge variant="violet" size={size}>
      ✓ Vérifié
    </Badge>
  )
}

// Badge VIP
export function VipBadge({ level }: { level: string }) {
  if (level === 'NONE') return null
  const icons: Record<string, string> = {
    BRONZE: '🥉', SILVER: '🥈', GOLD: '🥇', DIAMOND: '💎', LEGEND: '👑',
  }
  return (
    <Badge variant="gold" size="sm">
      {icons[level] ?? '⭐'} {level}
    </Badge>
  )
}

// Compteur de notifications
export function NotifCount({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-hilunia-rose rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-hilunia-bg-dark px-1">
      {count > 99 ? '99+' : count}
    </span>
  )
}
