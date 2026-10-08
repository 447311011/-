'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginSchema, type LoginInput } from '@/lib/validations'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'Compte suspendu') {
          toast.error('Ton compte a été suspendu. Contacte le support.')
        } else {
          toast.error('Email ou mot de passe incorrect')
        }
        return
      }

      toast.success('Connecté ! Bienvenue sur Hilunia 🎉')
      router.push('/accueil')
      router.refresh()
    } catch {
      toast.error('Erreur de connexion. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="font-display font-black text-3xl text-white mb-2">
          Bon retour ! 👋
        </h1>
        <p className="text-hilunia-text-muted text-sm">
          Connecte-toi pour retrouver tes connexions
        </p>
      </div>

      <div className="card space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="ton@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-hilunia-violet hover:text-hilunia-violet-light transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
          >
            <span>Se connecter</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <div className="text-center text-sm text-hilunia-text-muted">
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="text-hilunia-violet hover:text-hilunia-violet-light font-semibold transition-colors"
        >
          S&apos;inscrire gratuitement
        </Link>
      </div>

      {/* Infos légales */}
      <p className="text-center text-xs text-hilunia-text-dim">
        En te connectant, tu acceptes nos{' '}
        <a href="#" className="underline hover:text-hilunia-text-muted">CGU</a>{' '}
        et notre{' '}
        <a href="#" className="underline hover:text-hilunia-text-muted">politique de confidentialité</a>
      </p>
    </motion.div>
  )
}
