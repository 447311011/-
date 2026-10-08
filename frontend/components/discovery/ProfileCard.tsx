'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import {
  MapPin, Heart, X, Star, ChevronDown, ChevronUp,
  Shield, Globe, Ruler
} from 'lucide-react'
import { cn, formatDistance } from '@/lib/utils'
import { VIP_LEVELS, type ProfileCardData } from '@/lib/types'
import Badge, { VerifiedBadge, VipBadge, OnlineBadge } from '@/components/ui/Badge'

interface ProfileCardProps {
  profile: ProfileCardData
  onLike?: () => void
  onPass?: () => void
  onSuperLike?: () => void
  isTop?: boolean
  style?: React.CSSProperties
}

const goalLabels: Record<string, string> = {
  FRIENDSHIP: '🤝 Amitié',
  CASUAL: '😊 Rencontres',
  SERIOUS: '💑 Relation sérieuse',
  NETWORKING: '💼 Réseau',
}

const genderLabels: Record<string, string> = {
  MALE: '♂ Homme',
  FEMALE: '♀ Femme',
  NON_BINARY: '⚧ Non-binaire',
  OTHER: 'Autre',
}

export default function ProfileCard({
  profile,
  onLike,
  onPass,
  onSuperLike,
  isTop = false,
  style,
}: ProfileCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 150], [-20, 20])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0])
  const cardOpacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const dragEndHandler = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setSwipeDir('right')
      onLike?.()
    } else if (info.offset.x < -100) {
      setSwipeDir('left')
      onPass?.()
    }
  }

  const photos = profile.photos.length > 0 ? profile.photos : ['/images/placeholder-avatar.jpg']
  const vipInfo = VIP_LEVELS[profile.vipLevel] ?? VIP_LEVELS.NONE

  const nextPhoto = () => setPhotoIndex(i => (i + 1) % photos.length)
  const prevPhoto = () => setPhotoIndex(i => (i - 1 + photos.length) % photos.length)

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity: cardOpacity, ...style }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={dragEndHandler}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="relative h-full rounded-4xl overflow-hidden shadow-hilunia-lg border border-hilunia-border/30">
        {/* Photos */}
        <div className="absolute inset-0">
          <Image
            src={photos[photoIndex]}
            alt={profile.displayName}
            fill
            className="object-cover"
            priority={isTop}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 card-overlay" />
        </div>

        {/* Photo navigation */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
          {photos.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1 rounded-full transition-all duration-300',
                i === photoIndex ? 'bg-white' : 'bg-white/30'
              )}
            />
          ))}
        </div>

        {/* Tap areas for photo navigation */}
        {photos.length > 1 && (
          <>
            <button
              className="absolute left-0 top-0 w-1/3 h-full z-10 opacity-0"
              onClick={prevPhoto}
            />
            <button
              className="absolute right-0 top-0 w-2/3 h-full z-10 opacity-0"
              onClick={nextPhoto}
            />
          </>
        )}

        {/* Like / Nope overlays */}
        <motion.div
          className="absolute top-12 left-6 z-20 px-4 py-2 rounded-xl border-4 border-emerald-400 rotate-[-20deg]"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-emerald-400 font-black text-2xl">LIKE</span>
        </motion.div>
        <motion.div
          className="absolute top-12 right-6 z-20 px-4 py-2 rounded-xl border-4 border-red-400 rotate-[20deg]"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-red-400 font-black text-2xl">NOPE</span>
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.isOnline && <OnlineBadge isOnline={profile.isOnline} />}
            {profile.selfieVerified && <VerifiedBadge />}
            {profile.vipLevel !== 'NONE' && <VipBadge level={profile.vipLevel} />}
          </div>

          {/* Nom & âge */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display font-black text-2xl text-white leading-none">
                {profile.displayName}, {profile.age}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                {profile.city && (
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.city}
                    {profile.distanceKm !== undefined && (
                      <span className="text-white/60"> · {formatDistance(profile.distanceKm)}</span>
                    )}
                  </span>
                )}
              </div>
              {profile.goal && (
                <span className="text-white/70 text-xs">{goalLabels[profile.goal] ?? profile.goal}</span>
              )}
            </div>

            {/* Bouton expand */}
            <button
              className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/20"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
            >
              {expanded
                ? <ChevronDown className="w-4 h-4 text-white" />
                : <ChevronUp className="w-4 h-4 text-white" />
              }
            </button>
          </div>

          {/* Bio et détails (expandable) */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              {profile.bio && (
                <p className="text-white/90 text-sm leading-relaxed">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {profile.height && (
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <Ruler className="w-3 h-3" />
                    <span>{profile.height} cm</span>
                  </div>
                )}
              </div>

              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.slice(0, 5).map(interest => (
                    <span
                      key={interest}
                      className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Boutons d'action (Like / Nope / Super Like)
interface ActionButtonsProps {
  onPass: () => void
  onLike: () => void
  onSuperLike: () => void
  coins: number
  loading?: boolean
}

export function SwipeActions({ onPass, onLike, onSuperLike, coins, loading }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Passer */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPass}
        disabled={loading}
        className="w-14 h-14 rounded-full glass border border-hilunia-border flex items-center justify-center shadow-card hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
      >
        <X className="w-6 h-6 text-red-400" />
      </motion.button>

      {/* Super Like */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSuperLike}
        disabled={loading || coins < 50}
        className={cn(
          'w-12 h-12 rounded-full glass border flex items-center justify-center shadow-card transition-colors',
          coins >= 50
            ? 'border-yellow-500/40 hover:bg-yellow-500/10'
            : 'border-hilunia-border opacity-50'
        )}
        title={coins < 50 ? 'Pas assez de pièces (50 requis)' : 'Super Like (50 🪙)'}
      >
        <Star className={cn('w-5 h-5', coins >= 50 ? 'text-yellow-400' : 'text-hilunia-text-dim')} />
      </motion.button>

      {/* Like */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        disabled={loading}
        className="w-16 h-16 rounded-full bg-gradient-hilunia flex items-center justify-center shadow-glow-violet"
      >
        <Heart className="w-7 h-7 text-white fill-white" />
      </motion.button>
    </div>
  )
}
