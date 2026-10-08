'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Loader2, Plus, X, Save, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { profileSchema } from '@/lib/validations'
import { INTERESTS } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { UserPrivate } from '@/lib/types'
import type { z } from 'zod'

type ProfileFormData = z.infer<typeof profileSchema>

const GENDER_OPTIONS = [
  { value: 'MALE', label: '♂ Homme' },
  { value: 'FEMALE', label: '♀ Femme' },
  { value: 'NON_BINARY', label: '⚧ Non-binaire' },
  { value: 'OTHER', label: 'Autre' },
]

const GOAL_OPTIONS = [
  { value: 'FRIENDSHIP', label: '🤝 Amitié' },
  { value: 'CASUAL', label: '😊 Rencontres' },
  { value: 'SERIOUS', label: '💑 Relation sérieuse' },
  { value: 'NETWORKING', label: '💼 Réseau' },
]

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photos, setPhotos] = useState<{ id: string; url: string; isMain: boolean }[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const watchedGender = watch('gender')
  const watchedInterestedIn = watch('interestedIn')
  const watchedGoal = watch('goal')
  const bio = watch('bio') ?? ''

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile')
        if (res.ok) {
          const data = await res.json() as { user: UserPrivate }
          const p = data.user.profile
          if (p) {
            setValue('displayName', p.displayName ?? '')
            setValue('gender', (p.gender ?? 'OTHER') as ProfileFormData['gender'])
            setValue('interestedIn', (p.interestedIn ?? 'BOTH') as ProfileFormData['interestedIn'])
            setValue('goal', (p.goal ?? 'CASUAL') as ProfileFormData['goal'])
            setValue('bio', p.bio ?? '')
            setValue('city', p.city ?? '')
            setValue('country', p.country ?? '')
            setValue('height', p.height ?? undefined)
            const interests = Array.isArray(p.interests) ? p.interests : []
            setSelectedInterests(interests)
            setValue('interests', interests)
            setPhotos(p.photos ?? [])
          }
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchProfile()
  }, [setValue])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      const next = prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 10 ? [...prev, interest] : prev
      setValue('interests', next)
      return next
    })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'profile')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json() as { url?: string; photoId?: string; error?: string }

      if (!res.ok || !data.url) {
        toast.error(data.error ?? 'Erreur upload')
        return
      }

      setPhotos(prev => [...prev, { id: data.photoId ?? Date.now().toString(), url: data.url!, isMain: prev.length === 0 }])
      toast.success('Photo ajoutée !')
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, interests: selectedInterests }),
      })

      const result = await res.json() as { error?: string; bonusEarned?: number }
      if (!res.ok) {
        toast.error(result.error ?? 'Erreur sauvegarde')
        return
      }

      if (result.bonusEarned) {
        toast.success(`Profil complété ! +${result.bonusEarned} 🪙`)
      } else {
        toast.success('Profil sauvegardé !')
      }

      router.push('/moi')
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-hilunia-violet animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-hilunia-border/50 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1.5 rounded-xl hover:bg-hilunia-surface">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-bold text-white">Modifier le profil</h1>
        <button
          onClick={() => void handleSubmit(onSubmit)()}
          disabled={saving}
          className="btn-primary text-sm py-2 px-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Sauver</>}
        </button>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Photos */}
        <section>
          <h2 className="text-sm font-bold text-white mb-3">Photos ({photos.length}/6)</h2>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={photo.url} alt="Photo" fill className="object-cover" />
                {photo.isMain && (
                  <div className="absolute bottom-1 left-1 bg-hilunia-violet text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    Principale
                  </div>
                )}
              </div>
            ))}
            {photos.length < 6 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="aspect-square rounded-2xl border-2 border-dashed border-hilunia-border flex items-center justify-center hover:border-hilunia-violet/60 transition-colors"
              >
                {uploadingPhoto
                  ? <Loader2 className="w-6 h-6 text-hilunia-violet animate-spin" />
                  : <Camera className="w-6 h-6 text-hilunia-text-dim" />
                }
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </section>

        {/* Infos de base */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-white">Informations</h2>

          <div>
            <label className="text-xs text-hilunia-text-muted mb-1.5 block">Prénom / Pseudo *</label>
            <input {...register('displayName')} className="input-field" placeholder="Ton prénom" maxLength={30} />
            {errors.displayName && <p className="text-xs text-red-400 mt-1">{errors.displayName.message}</p>}
          </div>

          <div>
            <label className="text-xs text-hilunia-text-muted mb-1.5 block">Bio</label>
            <textarea
              {...register('bio')}
              className="input-field resize-none"
              placeholder="Parle-toi en quelques mots..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-hilunia-text-dim text-right mt-0.5">{bio.length}/500</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-hilunia-text-muted mb-1.5 block">Ville</label>
              <input {...register('city')} className="input-field" placeholder="Paris" />
            </div>
            <div>
              <label className="text-xs text-hilunia-text-muted mb-1.5 block">Pays</label>
              <input {...register('country')} className="input-field" placeholder="France" />
            </div>
          </div>

          <div>
            <label className="text-xs text-hilunia-text-muted mb-1.5 block">Taille (cm)</label>
            <input type="number" {...register('height', { valueAsNumber: true })} className="input-field" placeholder="170" min={100} max={250} />
          </div>
        </section>

        {/* Genre */}
        <section>
          <h2 className="text-sm font-bold text-white mb-3">Je suis</h2>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('gender', opt.value as ProfileFormData['gender'])}
                className={cn(
                  'py-2.5 px-4 rounded-2xl border text-sm font-medium transition-all',
                  watchedGender === opt.value
                    ? 'bg-hilunia-violet/20 border-hilunia-violet text-hilunia-violet'
                    : 'bg-hilunia-surface border-hilunia-border text-hilunia-text-muted'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Cherche */}
        <section>
          <h2 className="text-sm font-bold text-white mb-3">Je cherche</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'FEMALE', label: '♀ Femmes' },
              { value: 'MALE', label: '♂ Hommes' },
              { value: 'BOTH', label: '⚤ Tout' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('interestedIn', opt.value as ProfileFormData['interestedIn'])}
                className={cn(
                  'py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all',
                  watchedInterestedIn === opt.value
                    ? 'bg-hilunia-rose/20 border-hilunia-rose text-hilunia-rose'
                    : 'bg-hilunia-surface border-hilunia-border text-hilunia-text-muted'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Objectif */}
        <section>
          <h2 className="text-sm font-bold text-white mb-3">Objectif</h2>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('goal', opt.value as ProfileFormData['goal'])}
                className={cn(
                  'py-2.5 px-4 rounded-2xl border text-sm font-medium transition-all',
                  watchedGoal === opt.value
                    ? 'bg-hilunia-coral/20 border-hilunia-coral text-hilunia-coral'
                    : 'bg-hilunia-surface border-hilunia-border text-hilunia-text-muted'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Centres d'intérêt */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Centres d&apos;intérêt</h2>
            <span className="text-xs text-hilunia-text-muted">{selectedInterests.length}/10</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => {
              const selected = selectedInterests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    'px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
                    selected
                      ? 'bg-hilunia-violet/20 border-hilunia-violet text-hilunia-violet'
                      : 'bg-hilunia-surface border-hilunia-border text-hilunia-text-muted',
                    !selected && selectedInterests.length >= 10 && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {selected && <Check className="inline w-3 h-3 mr-1" />}
                  {interest}
                </button>
              )
            })}
          </div>
        </section>

        {/* Bouton save en bas */}
        <button
          onClick={() => void handleSubmit(onSubmit)()}
          disabled={saving}
          className="w-full btn-primary py-3.5"
        >
          {saving
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <><Save className="w-5 h-5" /> Sauvegarder le profil</>
          }
        </button>
      </div>
    </div>
  )
}
