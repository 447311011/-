'use client'

import Image from 'next/image'
import { cn, getInitials, userColor } from '@/lib/utils'
import { VIP_LEVELS, type VipLevel } from '@/lib/types'

interface AvatarProps {
  src?: string | null
  name?: string
  userId?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  online?: boolean
  vipLevel?: VipLevel
  verified?: boolean
  className?: string
  ring?: boolean
}

const sizes = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-28 h-28 text-2xl',
}

const onlineSizes = {
  xs: 'w-2 h-2 border',
  sm: 'w-2.5 h-2.5 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
  '2xl': 'w-5 h-5 border-2',
}

export default function Avatar({
  src,
  name = '?',
  userId,
  size = 'md',
  online,
  vipLevel,
  verified,
  className,
  ring = false,
}: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = userId ? userColor(userId) : '#7C5CFF'
  const vipInfo = vipLevel && vipLevel !== 'NONE' ? VIP_LEVELS[vipLevel] : null

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center font-bold',
          sizes[size],
          ring && 'ring-2 ring-hilunia-violet/60 ring-offset-1 ring-offset-hilunia-bg-dark',
          vipInfo && `ring-2 ring-offset-1 ring-offset-hilunia-bg-dark`,
          className
        )}
        style={vipInfo ? { ringColor: vipInfo.color } : undefined}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes={`${parseInt(sizes[size].split('w-')[1]) * 4}px`}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <span className="text-white font-bold leading-none">{initials}</span>
          </div>
        )}
      </div>

      {/* Indicateur en ligne */}
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-hilunia-bg-dark',
            onlineSizes[size],
            online ? 'bg-emerald-400' : 'bg-hilunia-text-dim'
          )}
        />
      )}

      {/* Badge VIP */}
      {vipInfo && size !== 'xs' && size !== 'sm' && (
        <div
          className="absolute -top-0.5 -right-0.5 rounded-full w-5 h-5 flex items-center justify-center text-[10px] border border-hilunia-bg-dark"
          style={{ backgroundColor: vipInfo.color }}
          title={`VIP ${vipInfo.label}`}
        >
          {vipInfo.icon}
        </div>
      )}

      {/* Badge vérifié */}
      {verified && !vipInfo && size !== 'xs' && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-hilunia-violet rounded-full flex items-center justify-center border border-hilunia-bg-dark">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Avatar groupe (plusieurs avatars superposés)
interface AvatarGroupProps {
  users: Array<{ id: string; name?: string; photo?: string | null }>
  max?: number
  size?: AvatarProps['size']
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const rest = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user) => (
        <Avatar
          key={user.id}
          src={user.photo}
          name={user.name ?? '?'}
          userId={user.id}
          size={size}
          className="border-2 border-hilunia-bg-dark"
        />
      ))}
      {rest > 0 && (
        <div
          className={cn(
            'rounded-full bg-hilunia-surface border-2 border-hilunia-bg-dark flex items-center justify-center text-xs font-bold text-hilunia-text-muted',
            sizes[size]
          )}
        >
          +{rest}
        </div>
      )}
    </div>
  )
}
