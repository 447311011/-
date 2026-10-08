'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Eye, Plus, Camera, Video, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '@/components/ui/Avatar'
import { timeAgo, cn } from '@/lib/utils'
import type { Moment } from '@/lib/types'

export default function MomentsPage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchMoments = async (p = 1) => {
    try {
      const res = await fetch(`/api/moments?page=${p}&limit=20`)
      if (res.ok) {
        const data = await res.json() as { moments: Moment[]; hasMore: boolean }
        if (p === 1) {
          setMoments(data.moments)
        } else {
          setMoments(prev => [...prev, ...data.moments])
        }
        setHasMore(data.hasMore)
      }
    } catch {
      toast.error('Impossible de charger les moments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchMoments()
  }, [])

  const toggleLike = async (momentId: string, isLiked: boolean) => {
    // Optimistic update
    setMoments(prev =>
      prev.map(m =>
        m.id === momentId
          ? {
              ...m,
              isLiked: !isLiked,
              likeCount: isLiked ? m.likeCount - 1 : m.likeCount + 1,
            }
          : m
      )
    )

    try {
      await fetch(`/api/moments/${momentId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })
    } catch {
      // Revert on error
      setMoments(prev =>
        prev.map(m =>
          m.id === momentId
            ? { ...m, isLiked, likeCount: isLiked ? m.likeCount + 1 : m.likeCount - 1 }
            : m
        )
      )
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-hilunia-border/50 px-4 py-3 flex items-center justify-between">
        <h1 className="font-display font-black text-xl text-white">Moments</h1>
        <button
          className="btn-primary text-sm py-2 px-4"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-4 h-4" />
          Publier
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-hilunia-violet animate-spin" />
        </div>
      ) : moments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-8">
          <Camera className="w-12 h-12 text-hilunia-text-muted" />
          <div>
            <h3 className="font-bold text-white mb-1">Aucun moment pour l&apos;instant</h3>
            <p className="text-sm text-hilunia-text-muted">Sois le premier à publier un moment !</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Camera className="w-4 h-4" />
            Publier un moment
          </button>
        </div>
      ) : (
        <div className="divide-y divide-hilunia-border/30">
          {moments.map((moment) => (
            <MomentItem
              key={moment.id}
              moment={moment}
              onLike={() => void toggleLike(moment.id, moment.isLiked ?? false)}
            />
          ))}
          {hasMore && (
            <div className="py-6 flex justify-center">
              <button
                className="btn-secondary text-sm"
                onClick={() => {
                  const nextPage = page + 1
                  setPage(nextPage)
                  void fetchMoments(nextPage)
                }}
              >
                Charger plus
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de création */}
      <AnimatePresence>
        {showCreate && (
          <CreateMomentModal
            onClose={() => setShowCreate(false)}
            onSuccess={(newMoment) => {
              setMoments(prev => [newMoment, ...prev])
              setShowCreate(false)
              toast.success('Moment publié ! 📸')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Composant item moment
function MomentItem({ moment, onLike }: { moment: Moment; onLike: () => void }) {
  const [showFullCaption, setShowFullCaption] = useState(false)
  const caption = moment.caption ?? ''
  const isLong = caption.length > 100

  return (
    <article className="py-4 px-4 animate-fade-in">
      {/* Auteur */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={moment.user.mainPhoto}
          name={moment.user.displayName}
          userId={moment.user.id}
          size="md"
          online={true}
          vipLevel={moment.user.vipLevel}
          verified={moment.user.selfieVerified}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm truncate">
              {moment.user.displayName}
            </span>
            {moment.user.selfieVerified && (
              <span className="text-[10px] bg-hilunia-violet/20 text-hilunia-violet px-1.5 py-0.5 rounded-full flex-shrink-0">
                ✓
              </span>
            )}
          </div>
          <span className="text-xs text-hilunia-text-muted">{timeAgo(moment.createdAt)}</span>
        </div>
      </div>

      {/* Média */}
      <div className="relative rounded-3xl overflow-hidden bg-hilunia-surface aspect-square mb-3">
        {moment.mediaType === 'IMAGE' ? (
          <Image
            src={moment.mediaUrl}
            alt={moment.caption ?? 'Moment'}
            fill
            className="object-cover"
          />
        ) : (
          <video
            src={moment.mediaUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-3">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={onLike}
          className="flex items-center gap-1.5 group"
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-colors',
              moment.isLiked
                ? 'text-hilunia-rose fill-hilunia-rose'
                : 'text-hilunia-text-muted group-hover:text-hilunia-rose'
            )}
          />
          <span className="text-sm text-hilunia-text-muted">{moment.likeCount}</span>
        </motion.button>

        <button className="flex items-center gap-1.5 group">
          <MessageCircle className="w-5 h-5 text-hilunia-text-muted group-hover:text-white transition-colors" />
          <span className="text-sm text-hilunia-text-muted">{moment.commentCount}</span>
        </button>

        <div className="ml-auto flex items-center gap-1 text-hilunia-text-dim">
          <Eye className="w-4 h-4" />
          <span className="text-xs">{moment.viewCount}</span>
        </div>
      </div>

      {/* Légende */}
      {caption && (
        <p className="text-sm text-white/90 leading-relaxed">
          {isLong && !showFullCaption ? caption.slice(0, 100) + '...' : caption}
          {isLong && (
            <button
              onClick={() => setShowFullCaption(!showFullCaption)}
              className="text-hilunia-violet ml-1 text-xs font-medium"
            >
              {showFullCaption ? 'Réduire' : 'Voir plus'}
            </button>
          )}
        </p>
      )}
    </article>
  )
}

// Modal de création de moment
function CreateMomentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (moment: Moment) => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    setMediaType(isVideo ? 'VIDEO' : 'IMAGE')

    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const handleSubmit = async () => {
    if (!preview || !fileInputRef.current?.files?.[0]) {
      toast.error('Sélectionne une photo ou vidéo')
      return
    }

    setLoading(true)
    try {
      // Upload du fichier
      const formData = new FormData()
      formData.append('file', fileInputRef.current.files[0])
      formData.append('type', 'moment')

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json() as { url?: string; error?: string }

      if (!uploadRes.ok || !uploadData.url) {
        toast.error(uploadData.error ?? 'Erreur upload')
        return
      }

      // Crée le moment
      const momentRes = await fetch('/api/moments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: uploadData.url,
          mediaType,
          caption: caption.trim() || undefined,
        }),
      })

      const momentData = await momentRes.json() as { moment?: Moment; error?: string }
      if (!momentRes.ok || !momentData.moment) {
        toast.error(momentData.error ?? 'Erreur création')
        return
      }

      onSuccess(momentData.moment)
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-hilunia-bg-dark/95 flex flex-col"
    >
      {/* Header modal */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-hilunia-border">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </button>
        <h2 className="font-bold text-white">Nouveau Moment</h2>
        <button
          className="btn-primary text-sm py-2 px-4"
          onClick={() => void handleSubmit()}
          disabled={loading || !preview}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publier'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Zone de sélection */}
        {!preview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square rounded-3xl border-2 border-dashed border-hilunia-border flex flex-col items-center justify-center gap-4 bg-hilunia-surface hover:border-hilunia-violet/60 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-hilunia flex items-center justify-center shadow-glow-violet">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">Ajouter une photo ou vidéo</p>
              <p className="text-sm text-hilunia-text-muted mt-1">JPG, PNG, MP4 · Max 10 MB</p>
            </div>
          </button>
        ) : (
          <div className="relative aspect-square rounded-3xl overflow-hidden">
            {mediaType === 'IMAGE' ? (
              <Image src={preview} alt="Aperçu" fill className="object-cover" />
            ) : (
              <video src={preview} className="w-full h-full object-cover" controls />
            )}
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Légende */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Ajoute une légende... (optionnel)"
          maxLength={500}
          rows={3}
          className="w-full bg-hilunia-surface border border-hilunia-border rounded-2xl px-4 py-3 text-white placeholder-hilunia-text-dim text-sm resize-none focus:outline-none focus:ring-2 focus:ring-hilunia-violet/50"
        />
        <p className="text-xs text-hilunia-text-dim text-right">{caption.length}/500</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </motion.div>
  )
}
