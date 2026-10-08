'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2, Coins, Loader2, RefreshCw, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import ProfileCard, { SwipeActions } from '@/components/discovery/ProfileCard'
import type { ProfileCardData } from '@/lib/types'

export default function AccueilPage() {
  const [profiles, setProfiles] = useState<ProfileCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [coins, setCoins] = useState(300)
  const [matchAnimation, setMatchAnimation] = useState(false)
  const [matchedUser, setMatchedUser] = useState<ProfileCardData | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/discovery?limit=10')
      if (res.ok) {
        const data = await res.json() as { profiles: ProfileCardData[] }
        setProfiles(data.profiles)
      }
    } catch {
      toast.error('Impossible de charger les profils')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProfiles()
  }, [fetchProfiles])

  const handleAction = async (type: 'LIKE' | 'PASS' | 'SUPER_LIKE') => {
    if (profiles.length === 0 || actionLoading) return
    const current = profiles[0]

    setActionLoading(true)
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: current.userId, type }),
      })

      const data = await res.json() as { matched?: boolean; error?: string }

      if (!res.ok) {
        toast.error(data.error ?? 'Erreur')
        return
      }

      if (data.matched) {
        setMatchedUser(current)
        setMatchAnimation(true)
        setTimeout(() => setMatchAnimation(false), 3000)
        toast.success(`🎉 Match avec ${current.displayName} !`)
      }

      // Retire le profil du stack
      setProfiles(prev => prev.slice(1))

      // Recharge si presque vide
      if (profiles.length <= 3) {
        void fetchProfiles()
      }

      // Débit Super Like
      if (type === 'SUPER_LIKE') {
        setCoins(c => c - 50)
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-2">
        <div>
          <h1 className="font-display font-black text-2xl text-gradient">HILUNIA</h1>
          <p className="text-xs text-hilunia-text-muted">Découvre des profils</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Pièces */}
          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full border border-hilunia-border">
            <span className="text-base">🪙</span>
            <span className="text-sm font-bold text-white">{coins.toLocaleString()}</span>
          </div>
          {/* Filtres */}
          <button className="w-10 h-10 rounded-2xl glass border border-hilunia-border flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-hilunia-text-muted" />
          </button>
        </div>
      </div>

      {/* Zone des cards */}
      <div className="flex-1 px-4 py-2">
        {loading ? (
          <div className="h-[520px] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-hilunia flex items-center justify-center animate-pulse-glow">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
            <p className="text-hilunia-text-muted text-sm">Recherche de profils...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="h-[520px] flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-hilunia-surface border border-hilunia-border flex items-center justify-center">
              <Heart className="w-10 h-10 text-hilunia-text-muted" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white mb-2">Plus de profils disponibles</h3>
              <p className="text-sm text-hilunia-text-muted">
                Tu as vu tous les profils dans ta zone. Élargis tes filtres ou reviens plus tard !
              </p>
            </div>
            <button
              onClick={() => void fetchProfiles()}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        ) : (
          <div className="relative h-[520px] max-w-sm mx-auto">
            <AnimatePresence>
              {profiles.slice(0, 3).map((profile, index) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isTop={index === 0}
                  onLike={() => void handleAction('LIKE')}
                  onPass={() => void handleAction('PASS')}
                  onSuperLike={() => void handleAction('SUPER_LIKE')}
                  style={{
                    zIndex: 3 - index,
                    scale: 1 - index * 0.03,
                    y: index * 8,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      {!loading && profiles.length > 0 && (
        <div className="px-4 pb-4">
          <SwipeActions
            onPass={() => void handleAction('PASS')}
            onLike={() => void handleAction('LIKE')}
            onSuperLike={() => void handleAction('SUPER_LIKE')}
            coins={coins}
            loading={actionLoading}
          />
        </div>
      )}

      {/* Animation Match */}
      <AnimatePresence>
        {matchAnimation && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-hilunia-bg-dark/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center px-8"
            >
              <div className="text-8xl mb-4 animate-bounce-soft">💫</div>
              <h2 className="font-display font-black text-5xl text-gradient mb-2">
                C&apos;est un Match !
              </h2>
              <p className="text-hilunia-text-muted mb-6">
                Toi et {matchedUser.displayName} vous vous êtes likés !
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  className="btn-primary"
                  onClick={() => setMatchAnimation(false)}
                >
                  💬 Envoyer un message
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setMatchAnimation(false)}
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
