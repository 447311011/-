'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Settings, Edit3, Shield, Star, Coins, LogOut, ChevronRight,
  Heart, MessageCircle, Camera, Loader2, CheckCircle2, AlertCircle,
  Bell, HelpCircle, Globe
} from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '@/components/ui/Avatar'
import { VipBadge, VerifiedBadge } from '@/components/ui/Badge'
import { calculateAge, cn, formatCoins, levelFromXp } from '@/lib/utils'
import { VIP_LEVELS, COIN_REWARDS } from '@/lib/types'
import type { UserPrivate } from '@/lib/types'

export default function MoiPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserPrivate | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimingBonus, setClaimingBonus] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile')
        if (res.ok) {
          const data = await res.json() as { user: UserPrivate }
          setProfile(data.user)
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchProfile()
  }, [])

  const claimDailyBonus = async () => {
    setClaimingBonus(true)
    try {
      const res = await fetch('/api/coins', { method: 'POST' })
      const data = await res.json() as { earned?: number; error?: string; nextIn?: number }
      if (res.ok) {
        toast.success(`+${data.earned} 🪙 Bonus quotidien !`)
        setProfile(prev => prev ? { ...prev, goldCoins: prev.goldCoins + (data.earned ?? 0) } : prev)
      } else {
        toast.error(data.error ?? 'Erreur')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setClaimingBonus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-hilunia-violet animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  const age = profile.profile?.birthDate ? calculateAge(new Date(profile.profile.birthDate)) : null
  const xp = profile.xp ?? 0
  const level = levelFromXp(xp)
  const vipInfo = VIP_LEVELS[profile.vipLevel] ?? VIP_LEVELS.NONE
  const isProfileComplete = profile.profile?.isComplete ?? false
  const isVerified = profile.selfieVerified ?? false

  const progressItems = [
    { label: 'Profil complet', done: isProfileComplete, coins: COIN_REWARDS.PROFILE_COMPLETE, icon: Edit3 },
    { label: 'Vérification selfie', done: isVerified, coins: COIN_REWARDS.SELFIE_VERIFY, icon: Shield },
    { label: 'Premier moment', done: profile.bonusFirstMoment ?? false, coins: COIN_REWARDS.FIRST_MOMENT, icon: Camera },
    { label: 'Premier match', done: profile.bonusFirstMatch ?? false, coins: COIN_REWARDS.FIRST_MATCH, icon: Heart },
  ]

  const completedCount = progressItems.filter(p => p.done).length
  const progressPercent = (completedCount / progressItems.length) * 100

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-hilunia-border/50 px-4 py-3 flex items-center justify-between">
        <h1 className="font-display font-black text-xl text-white">Mon Profil</h1>
        <Link
          href="/moi/settings"
          className="p-2 rounded-xl hover:bg-hilunia-surface transition-colors"
        >
          <Settings className="w-5 h-5 text-hilunia-text-muted" />
        </Link>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Carte profil principale */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar
                src={profile.profile?.mainPhoto ?? null}
                name={profile.profile?.displayName ?? 'Moi'}
                userId={profile.id}
                size="2xl"
                online={true}
                vipLevel={profile.vipLevel}
                verified={isVerified}
              />
              <Link
                href="/moi/edit"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-hilunia-violet flex items-center justify-center shadow-glow-violet"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-black text-xl text-white">
                  {profile.profile?.displayName ?? 'Ton nom'}
                  {age !== null && `, ${age}`}
                </h2>
                {isVerified && <VerifiedBadge />}
              </div>

              {profile.profile?.city && (
                <p className="text-sm text-hilunia-text-muted mt-0.5">{profile.profile.city}</p>
              )}

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <VipBadge level={profile.vipLevel} />
                <span className="text-xs bg-hilunia-surface border border-hilunia-border text-hilunia-text-muted px-2 py-0.5 rounded-full">
                  Niv. {level}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.profile?.bio ? (
            <p className="text-sm text-white/80 mt-4 leading-relaxed">{profile.profile.bio}</p>
          ) : (
            <Link href="/moi/edit" className="block mt-4">
              <p className="text-sm text-hilunia-text-dim italic">+ Ajoute une bio pour attirer plus de monde</p>
            </Link>
          )}

          {/* Photos */}
          {profile.profile?.photos && profile.profile.photos.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {profile.profile.photos.slice(0, 6).map((photo) => (
                <div key={photo.id} className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                  <Image src={photo.url} alt="Photo" width={64} height={64} className="object-cover w-full h-full" />
                </div>
              ))}
              <Link href="/moi/edit" className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-hilunia-border flex items-center justify-center">
                <Camera className="w-5 h-5 text-hilunia-text-dim" />
              </Link>
            </div>
          )}
        </div>

        {/* Portefeuille */}
        <div className="card p-4">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            Mon portefeuille
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-hilunia-surface rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-white">{formatCoins(profile.goldCoins)}</p>
              <p className="text-[10px] text-hilunia-text-muted mt-0.5">🪙 Or</p>
            </div>
            <div className="bg-hilunia-surface rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-white">{formatCoins(profile.gameTokens ?? 0)}</p>
              <p className="text-[10px] text-hilunia-text-muted mt-0.5">🎮 Tokens</p>
            </div>
            <div className="bg-hilunia-surface rounded-2xl p-3 text-center">
              <p className="text-xl font-black text-white">{formatCoins(profile.diamonds ?? 0)}</p>
              <p className="text-[10px] text-hilunia-text-muted mt-0.5">💎 Diamants</p>
            </div>
          </div>

          <button
            onClick={() => void claimDailyBonus()}
            disabled={claimingBonus}
            className="w-full mt-3 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
          >
            {claimingBonus
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Star className="w-4 h-4 text-yellow-400" />
            }
            Bonus quotidien (+{COIN_REWARDS.DAILY_LOGIN} 🪙)
          </button>
        </div>

        {/* Progression */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Progression</h3>
            <span className="text-xs text-hilunia-text-muted">{completedCount}/{progressItems.length}</span>
          </div>

          <div className="w-full h-2 rounded-full bg-hilunia-surface mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-hilunia rounded-full"
            />
          </div>

          <div className="space-y-3">
            {progressItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  item.done ? 'bg-emerald-500/20' : 'bg-hilunia-surface'
                )}>
                  {item.done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <item.icon className="w-4 h-4 text-hilunia-text-dim" />
                  }
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-medium', item.done ? 'text-white/60 line-through' : 'text-white')}>
                    {item.label}
                  </p>
                </div>
                {!item.done && (
                  <span className="text-xs text-yellow-400 font-bold">+{item.coins} 🪙</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* VIP */}
        {profile.vipLevel === 'NONE' && (
          <Link href="/boutique">
            <div className="card p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👑</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">Passe au VIP</h3>
                  <p className="text-xs text-hilunia-text-muted mt-0.5">Apparais en premier, Super Likes illimités...</p>
                </div>
                <ChevronRight className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </Link>
        )}

        {/* Vérification */}
        {!isVerified && (
          <Link href="/moi/verify" className="block">
            <div className="card p-4 bg-gradient-to-br from-hilunia-violet/10 to-hilunia-rose/5 border-hilunia-violet/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-hilunia-violet/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-hilunia-violet" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">Vérifier mon profil</h3>
                  <p className="text-xs text-hilunia-text-muted mt-0.5">Selfie • Gagne +{COIN_REWARDS.SELFIE_VERIFY} 🪙</p>
                </div>
                <span className="text-xs font-bold text-hilunia-violet">+{COIN_REWARDS.SELFIE_VERIFY} 🪙</span>
              </div>
            </div>
          </Link>
        )}

        {/* Menu */}
        <div className="card overflow-hidden">
          {[
            { icon: Edit3, label: 'Modifier mon profil', href: '/moi/edit' },
            { icon: Shield, label: 'Sécurité & Confidentialité', href: '/moi/security' },
            { icon: Bell, label: 'Notifications', href: '/moi/notifications' },
            { icon: Globe, label: 'Langue', href: '/moi/language' },
            { icon: HelpCircle, label: 'Aide & Support', href: '/moi/help' },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 hover:bg-hilunia-surface/50 transition-colors',
                i > 0 && 'border-t border-hilunia-border/30'
              )}
            >
              <item.icon className="w-4 h-4 text-hilunia-text-muted" />
              <span className="flex-1 text-sm text-white">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-hilunia-text-dim" />
            </Link>
          ))}
        </div>

        {/* Déconnexion */}
        <button
          onClick={() => void signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>

        <p className="text-center text-xs text-hilunia-text-dim">Hilunia v1.0.0</p>
      </div>
    </div>
  )
}
