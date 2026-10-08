'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Calendar, User, ChevronRight, ChevronLeft, Shield, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { calculateAge } from '@/lib/utils'

// Étapes d'inscription
const STEPS = [
  { id: 1, title: 'Ton email', subtitle: 'Pour sécuriser ton compte' },
  { id: 2, title: 'Ta date de naissance', subtitle: '18 ans minimum requis' },
  { id: 3, title: 'Mot de passe', subtitle: 'Au moins 8 caractères' },
  { id: 4, title: 'Conditions', subtitle: 'Dernière étape !' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [birthDateError, setBirthDateError] = useState('')
  const [dateValue, setDateValue] = useState('')

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const nextStep = async () => {
    let valid = false
    if (step === 1) valid = await trigger('email')
    else if (step === 2) {
      valid = await trigger('birthDate')
      if (dateValue) {
        const age = calculateAge(dateValue)
        if (age < 18) {
          setBirthDateError('Tu dois avoir au moins 18 ans pour t\'inscrire sur Hilunia.')
          return
        } else {
          setBirthDateError('')
        }
      }
    }
    else if (step === 3) valid = await trigger(['password', 'confirmPassword'])
    else if (step === 4) valid = await trigger('acceptTerms')

    if (valid) {
      setDirection(1)
      setStep(s => Math.min(s + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setDirection(-1)
    setStep(s => Math.max(s - 1, 1))
  }

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json() as { error?: string; welcomeCoins?: number }

      if (!res.ok) {
        toast.error(json.error ?? 'Erreur lors de l\'inscription')
        return
      }

      toast.success(`Bienvenue sur Hilunia ! 🎉 Tu reçois ${json.welcomeCoins} pièces de bienvenue !`)

      // Auto-connexion
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push('/accueil')
        router.refresh()
      } else {
        router.push('/login')
      }
    } catch {
      toast.error('Erreur réseau. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100
  const currentStepInfo = STEPS[step - 1]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-3xl text-white mb-1"
        >
          {step === 1 && 'Rejoins Hilunia ! ✨'}
          {step === 2 && 'Ton âge 🎂'}
          {step === 3 && 'Sécurise ton compte 🔒'}
          {step === 4 && 'Presque fini ! 🚀'}
        </motion.h1>
        <p className="text-hilunia-text-muted text-sm">
          {currentStepInfo.subtitle}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-hilunia-text-dim">
          <span>Étape {step} sur {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-hilunia-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-hilunia rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Formulaire */}
      <div className="card overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {/* Étape 1 : Email */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-hilunia-violet/10 border border-hilunia-violet/20">
                    <p className="text-xs text-hilunia-violet flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Ton email reste privé et n&apos;est jamais partagé avec d&apos;autres membres.
                    </p>
                  </div>
                  <Input
                    label="Adresse email"
                    type="email"
                    placeholder="ton@email.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    autoComplete="email"
                    autoFocus
                    {...register('email')}
                  />
                </div>
              )}

              {/* Étape 2 : Date de naissance */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-hilunia-rose/10 border border-hilunia-rose/20">
                    <p className="text-xs text-hilunia-rose-light flex items-center gap-2">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      Hilunia est réservé aux personnes de 18 ans et plus. Ta date de naissance est vérifiée mais non visible par les autres membres.
                    </p>
                  </div>
                  <Input
                    label="Date de naissance"
                    type="date"
                    leftIcon={<Calendar className="w-4 h-4" />}
                    error={errors.birthDate?.message || birthDateError}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    {...register('birthDate', {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        setDateValue(e.target.value)
                        if (e.target.value) {
                          const age = calculateAge(e.target.value)
                          if (age < 18) {
                            setBirthDateError('Tu dois avoir au moins 18 ans pour t\'inscrire sur Hilunia.')
                          } else {
                            setBirthDateError('')
                          }
                        }
                      },
                    })}
                  />
                  {dateValue && !birthDateError && calculateAge(dateValue) >= 18 && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      ✓ Tu as {calculateAge(dateValue)} ans — tu peux rejoindre Hilunia !
                    </p>
                  )}
                </div>
              )}

              {/* Étape 3 : Mot de passe */}
              {step === 3 && (
                <div className="space-y-4">
                  <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                    hint="8 caractères min., une majuscule, un chiffre"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Répète ton mot de passe"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.confirmPassword?.message}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                </div>
              )}

              {/* Étape 4 : Conditions */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Récap */}
                  <div className="p-4 rounded-2xl bg-hilunia-surface-2 border border-hilunia-border space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-hilunia-text-muted" />
                      <span className="text-sm text-white truncate">{getValues('email')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-hilunia-text-muted" />
                      <span className="text-sm text-white">
                        {getValues('birthDate')} ({calculateAge(getValues('birthDate'))} ans)
                      </span>
                    </div>
                  </div>

                  {/* Bonus bienvenue */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-hilunia-violet/10 to-hilunia-rose/10 border border-hilunia-violet/20">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-hilunia-violet flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">300 pièces offertes ! 🎁</p>
                        <p className="text-xs text-hilunia-text-muted">Cadeau de bienvenue sur Hilunia</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox CGU */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        className="sr-only"
                        {...register('acceptTerms')}
                      />
                      <div className="w-5 h-5 rounded-md bg-hilunia-surface border-2 border-hilunia-border group-hover:border-hilunia-violet transition-colors flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-sm bg-hilunia-violet opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-sm text-hilunia-text-muted leading-relaxed">
                      J&apos;ai lu et j&apos;accepte les{' '}
                      <a href="#" className="text-hilunia-violet underline hover:text-hilunia-violet-light">conditions d&apos;utilisation</a>
                      {' '}et la{' '}
                      <a href="#" className="text-hilunia-violet underline hover:text-hilunia-violet-light">politique de confidentialité</a>.
                      Je confirme avoir 18 ans ou plus.
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-xs text-red-400">⚠ {errors.acceptTerms.message}</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Boutons navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                className="flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            {step < STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                fullWidth
                size="lg"
              >
                <span>Continuer</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Créer mon compte</span>
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Lien connexion */}
      <div className="text-center text-sm text-hilunia-text-muted">
        Déjà inscrit(e) ?{' '}
        <Link href="/login" className="text-hilunia-violet hover:text-hilunia-violet-light font-semibold transition-colors">
          Se connecter
        </Link>
      </div>
    </div>
  )
}
