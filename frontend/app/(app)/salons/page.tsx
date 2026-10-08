'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic2, Users, Globe, Plus, Loader2, Radio, X, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface Room {
  id: string
  name: string
  description: string | null
  category: string
  language: string
  isPrivate: boolean
  maxMembers: number
  memberCount: number
  host: {
    id: string
    displayName: string
    mainPhoto: string | null
  }
}

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: '🌍' },
  { id: 'GENERAL', label: 'Général', icon: '💬' },
  { id: 'DATING', label: 'Rencontres', icon: '💕' },
  { id: 'MUSIC', label: 'Musique', icon: '🎵' },
  { id: 'GAMES', label: 'Jeux', icon: '🎮' },
  { id: 'LANGUAGE', label: 'Langues', icon: '📚' },
  { id: 'VIP', label: 'VIP', icon: '👑' },
]

const LANGUAGES = [
  { id: 'all', label: 'Toutes' },
  { id: 'fr', label: '🇫🇷 FR' },
  { id: 'en', label: '🇬🇧 EN' },
  { id: 'es', label: '🇪🇸 ES' },
  { id: 'pt', label: '🇧🇷 PT' },
  { id: 'ar', label: '🇸🇦 AR' },
]

export default function SalonsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [language, setLanguage] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  const fetchRooms = async () => {
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (language !== 'all') params.set('language', language)

      const res = await fetch(`/api/salons?${params}`)
      if (res.ok) {
        const data = await res.json() as { rooms: Room[] }
        setRooms(data.rooms)
      }
    } catch {
      toast.error('Impossible de charger les salons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    void fetchRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, language])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-hilunia-border/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-hilunia-violet" />
            <h1 className="font-display font-black text-xl text-white">Salons</h1>
          </div>
          <button
            className="btn-primary text-sm py-2 px-3"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-4 h-4" />
            Créer
          </button>
        </div>

        {/* Filtres catégorie */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                category === cat.id
                  ? 'bg-gradient-hilunia text-white shadow-glow-violet'
                  : 'bg-hilunia-surface border border-hilunia-border text-hilunia-text-muted'
              )}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Filtres langue */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                language === lang.id
                  ? 'bg-hilunia-violet/20 border border-hilunia-violet text-hilunia-violet'
                  : 'bg-hilunia-surface border border-hilunia-border text-hilunia-text-dim'
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des salons */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-hilunia-violet animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-8">
          <Mic2 className="w-12 h-12 text-hilunia-text-muted" />
          <div>
            <h3 className="font-bold text-white mb-1">Aucun salon actif</h3>
            <p className="text-sm text-hilunia-text-muted">Crée le premier salon !</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4" />
            Créer un salon
          </button>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 gap-3">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal création */}
      <AnimatePresence>
        {showCreate && (
          <CreateRoomModal
            onClose={() => setShowCreate(false)}
            onSuccess={(room) => {
              setRooms(prev => [room, ...prev])
              setShowCreate(false)
              toast.success('Salon créé ! 🎙️')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function RoomCard({ room }: { room: Room }) {
  const isFull = room.memberCount >= room.maxMembers
  const fillPercent = Math.min((room.memberCount / room.maxMembers) * 100, 100)

  const categoryColors: Record<string, string> = {
    DATING: 'text-hilunia-rose',
    MUSIC: 'text-yellow-400',
    GAMES: 'text-emerald-400',
    LANGUAGE: 'text-blue-400',
    VIP: 'text-yellow-500',
    GENERAL: 'text-hilunia-text-muted',
  }

  return (
    <div className={cn(
      'card p-4 transition-all active:scale-98',
      isFull && 'opacity-60'
    )}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-hilunia flex items-center justify-center flex-shrink-0 shadow-glow-violet">
          <Mic2 className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-white text-sm truncate">{room.name}</h3>
            {room.isPrivate && <Lock className="w-3 h-3 text-hilunia-text-dim flex-shrink-0" />}
          </div>

          {room.description && (
            <p className="text-xs text-hilunia-text-muted mb-2 line-clamp-1">{room.description}</p>
          )}

          <div className="flex items-center gap-3">
            <span className={cn('text-xs font-medium', categoryColors[room.category] ?? 'text-hilunia-text-muted')}>
              {room.category}
            </span>
            <span className="text-xs text-hilunia-text-dim flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {room.language.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            disabled={isFull}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              isFull
                ? 'bg-hilunia-surface text-hilunia-text-dim'
                : 'bg-gradient-hilunia text-white shadow-glow-violet'
            )}
          >
            {isFull ? 'Plein' : 'Rejoindre'}
          </button>

          <span className="text-xs text-hilunia-text-muted flex items-center gap-1">
            <Users className="w-3 h-3" />
            {room.memberCount}/{room.maxMembers}
          </span>
        </div>
      </div>

      {/* Hôte */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-hilunia-border/30">
        <Avatar
          src={room.host.mainPhoto}
          name={room.host.displayName}
          userId={room.host.id}
          size="xs"
        />
        <span className="text-xs text-hilunia-text-muted">
          Hôte : <span className="text-white">{room.host.displayName}</span>
        </span>

        {/* Barre d'occupation */}
        <div className="ml-auto w-20 h-1.5 rounded-full bg-hilunia-surface overflow-hidden">
          <div
            className="h-full bg-gradient-hilunia rounded-full transition-all"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function CreateRoomModal({ onClose, onSuccess }: {
  onClose: () => void
  onSuccess: (room: Room) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [language, setLanguage] = useState('fr')
  const [maxMembers, setMaxMembers] = useState(20)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Donne un nom à ton salon')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, category, language, maxMembers }),
      })

      const data = await res.json() as { room?: Room; error?: string }
      if (!res.ok || !data.room) {
        toast.error(data.error ?? 'Erreur création')
        return
      }

      onSuccess(data.room)
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
      <div className="flex items-center justify-between px-4 py-4 border-b border-hilunia-border">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </button>
        <h2 className="font-bold text-white">Créer un salon</h2>
        <button
          className="btn-primary text-sm py-2 px-4"
          onClick={() => void handleCreate()}
          disabled={loading || !name.trim()}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Nom */}
        <div>
          <label className="text-xs text-hilunia-text-muted mb-1.5 block">Nom du salon *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Soirée DJ, On parle de tout..."
            maxLength={60}
            className="input-field"
          />
          <p className="text-xs text-hilunia-text-dim text-right mt-1">{name.length}/60</p>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-hilunia-text-muted mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="De quoi parle-t-on ici ?"
            maxLength={200}
            rows={2}
            className="input-field resize-none"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="text-xs text-hilunia-text-muted mb-2 block">Catégorie</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'py-2 px-3 rounded-xl text-xs font-semibold border transition-all',
                  category === cat.id
                    ? 'bg-hilunia-violet/20 border-hilunia-violet text-hilunia-violet'
                    : 'bg-hilunia-surface border-hilunia-border text-hilunia-text-muted'
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Langue */}
        <div>
          <label className="text-xs text-hilunia-text-muted mb-2 block">Langue</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.filter(l => l.id !== 'all').map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                  language === lang.id
                    ? 'bg-hilunia-violet/20 border-hilunia-violet text-hilunia-violet'
                    : 'bg-hilunia-surface border-hilunia-border text-hilunia-text-muted'
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Max membres */}
        <div>
          <label className="text-xs text-hilunia-text-muted mb-2 block">
            Membres max : <span className="text-white font-bold">{maxMembers}</span>
          </label>
          <input
            type="range"
            min={2}
            max={50}
            value={maxMembers}
            onChange={e => setMaxMembers(Number(e.target.value))}
            className="w-full accent-hilunia-violet"
          />
          <div className="flex justify-between text-xs text-hilunia-text-dim mt-1">
            <span>2</span>
            <span>50</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
