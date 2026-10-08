'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Compass, Camera, Mic2, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/accueil',
    icon: Compass,
    label: 'Accueil',
    activeIcon: Compass,
  },
  {
    href: '/moments',
    icon: Camera,
    label: 'Moments',
    activeIcon: Camera,
  },
  {
    href: '/salons',
    icon: Mic2,
    label: 'Salons',
    activeIcon: Mic2,
    isCenter: false,
  },
  {
    href: '/messages',
    icon: MessageCircle,
    label: 'Messages',
    activeIcon: MessageCircle,
  },
  {
    href: '/moi',
    icon: User,
    label: 'Moi',
    activeIcon: User,
  },
]

interface BottomNavProps {
  unreadMessages?: number
}

export default function BottomNav({ unreadMessages = 0 }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-hilunia-border/50 pb-safe">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            const Icon = isActive ? tab.activeIcon : tab.icon

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full no-tap group',
                  'transition-colors duration-200'
                )}
              >
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={cn(
                      'relative w-10 h-8 flex items-center justify-center rounded-2xl transition-colors duration-200',
                      isActive
                        ? 'bg-hilunia-violet/20'
                        : 'group-hover:bg-hilunia-surface'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-all duration-200',
                        isActive
                          ? 'text-hilunia-violet drop-shadow-[0_0_8px_rgba(124,92,255,0.6)]'
                          : 'text-hilunia-text-muted group-hover:text-white'
                      )}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                    {/* Badge messages non-lus */}
                    {tab.href === '/messages' && unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-hilunia-rose rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1 border border-hilunia-bg-dark">
                        {unreadMessages > 99 ? '99+' : unreadMessages}
                      </span>
                    )}
                  </motion.div>
                  {/* Indicateur actif */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-hilunia-violet"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors duration-200',
                    isActive ? 'text-hilunia-violet' : 'text-hilunia-text-dim'
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
