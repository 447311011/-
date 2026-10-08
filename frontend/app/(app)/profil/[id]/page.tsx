'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Heart, MessageCircle, Flag, MoreVertical, Loader2, Shield, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '@/components/ui/Avatar'
import { VerifiedBadge, VipBadge } from '@/components/ui/Badge'
import { calculateAge, cn } from '@/lib/utils'
import type { UserPublic } from '@/lib/types'

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<UserPublic | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [liking, setLiking] = useState(false)
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        if (res.ok) {
          const data = await res.json() as { user: UserPublic }
          setUser(data.user)
        } else {
          toast.error('Profil introuvable')
          router.back()
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchUser()
  }, [id, router])

  const handleLike = async () => {
    setLiking(true)
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: id, type: 'LIKE' }),
      })
      const data = await res.json() as { matched?: boolean; error?: string }
      if (data.matched) {
        toast.success(`🎉 Match avec ${user?.displayName} !`)
      } else {
        toast.success('Like envoyé ! 💜')
      }
    } catch {
      toast.error('Erreur')
    } finally {
      setLiking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-hilunia-violet animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const photos = user.photos?.length ? user.photos : []
  const age = user.birthDate ? calculateAge(new Date(user.birthDate)) : null
  const interests = Array.isArray(user.interests) ? user.interests : []

  const goalLabels: Record<string, string> = {
    FRIENDSHIP: '🤝 Amitié',
    CASUAL: '😊 Rencontres',
    SERIOUS: '💑 Relation sérieuse',
    NETWORKING: '💼 Réseau',
  }

  return (
    <div className="min-h-screen">
      {/* Photos header */}
      <div className="relative h-[55vh] bg-hilunia-surface">
        {photos.length > 0 ? (
          <Image
            src={photos[photoIndex]}
            alt={user.displayName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Avatar src={null} name={user.displayName} userId={user.id} size="2xl" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-hilunia-bg-dark" />

        {/* Navigation */}
        {photos.length > 1 && (
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-3">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className={cn(
                  'flex-1 h-1 rounded-full transition-all',
                  i === photoIndex ? 'bg-white' : 'bg-white/30'
                )}
              />
            ))}
          </div>
        )}

        {/* Tap areas */}
        {photos.length > 1 && (
          <>
            <button className="absolute left-0 top-0 w-1/3 h-full opacity-0" onClick={() => setPhotoIndex(i => Math.max(0, i - 1))} />
            <button className="absolute right-0 top-0 w-2/3 h-full opacity-0" onClick={() => setPhotoIndex(i => Math.min(photos.length - 1, i + 1))} />
          </>
        )}

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* More */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile info */}
      <div className="px-4 py-4 space-y-4">
        {/* Nom & badges */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display font-black text-3xl text-white">
              {user.displayName}{age !== null && `, ${age}`}
            </h1>
            {user.selfieVerified && <VerifiedBadge />}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <VipBadge level={user.vipLevel} />
            {user.isOnline && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                En ligne
              </span>
            )}
          </div>

          {user.city && (
            <div className="flex items-center gap-1 mt-2 text-sm text-hilunia-text-muted">
              <MapPin className="w-4 h-4" />
              <span>{user.city}{user.country ? `, ${user.country}` : ''}</span>
            </div>
          )}

          {user.goal && (
            <span className="inline-block mt-2 text-xs bg-hilunia-surface border border-hilunia-border text-hilunia-text-muted px-2 py-0.5 rounded-full">
              {goalLabels[user.goal] ?? user.goal}
            </span>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="card p-4">
            <p className="text-sm text-white/90 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Infos */}
        {user.height && (
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📏</span>
              <div>
                <p className="text-xs text-hilunia-text-muted">Taille</p>
                <p className="text-sm font-semibold text-white">{user.height} cm</p>
              </div>
            </div>
          </div>
        )}

        {/* Centres d'intérêt */}
        {interests.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Centres d&apos;intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-hilunia-violet/10 border border-hilunia-violet/30 text-hilunia-violet"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={() => void handleLike()}
            disabled={liking}
            className="flex-1 btn-primary py-4 text-base"
          >
            {liking
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <><Heart className="w-5 h-5 fill-white" /> Liker</>
            }
          </button>
          <button className="flex-1 btn-secondary py-4 text-base">
            <MessageCircle className="w-5 h-5" />
            Message
          </button>
        </div>
      </div>

      {/* Actions sheet */}
      <AnimatePresence>
        {showActions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setShowActions(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-hilunia-surface-2 rounded-t-3xl p-4 border-t border-hilunia-border"
            >
              <div className="w-10 h-1 rounded-full bg-hilunia-border mx-auto mb-4" />
              <button
                onClick={() => {
                  setShowActions(false)
                  toast.success('Utilisateur signalé')
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Flag className="w-5 h-5" />
                Signaler ce profil
              </button>
              <button
                onClick={() => {
                  setShowActions(false)
                  toast.success('Utilisateur bloqué')
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-hilunia-text-muted hover:bg-hilunia-surface transition-colors"
              >
                <Shield className="w-5 h-5" />
                Bloquer cet utilisateur
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
