import { z } from 'zod'
import { isAdult } from './utils'

// Schéma d'inscription
export const registerSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  confirmPassword: z.string(),
  birthDate: z
    .string()
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Date invalide')
    .refine((val) => {
      return isAdult(val)
    }, 'Tu dois avoir 18 ans ou plus pour t\'inscrire sur Hilunia'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Tu dois accepter les conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

// Schéma de connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase().trim(),
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().optional(),
})

// Schéma de profil (étape 2 après inscription)
export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Au moins 2 caractères')
    .max(30, 'Maximum 30 caractères')
    .trim(),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'], {
    errorMap: () => ({ message: 'Genre requis' }),
  }),
  interestedIn: z.enum(['MALE', 'FEMALE', 'BOTH', 'ALL']).optional(),
  goal: z.enum(['FRIENDSHIP', 'CASUAL', 'SERIOUS', 'NETWORKING']).optional(),
  bio: z
    .string()
    .max(500, 'Maximum 500 caractères')
    .optional()
    .or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  height: z
    .number()
    .min(100, 'Taille minimale: 100 cm')
    .max(250, 'Taille maximale: 250 cm')
    .optional()
    .or(z.literal(0)),
  interests: z.array(z.string()).max(10, 'Maximum 10 intérêts').optional(),
  languages: z.array(z.string()).optional(),
})

// Schéma de message
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message vide')
    .max(2000, 'Message trop long (max 2000 caractères)')
    .trim(),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'GIFT', 'VOICE_NOTE']).optional(),
  mediaUrl: z.string().url().optional(),
  replyToId: z.string().optional(),
})

// Schéma de Moment
export const momentSchema = z.object({
  caption: z
    .string()
    .max(500, 'Maximum 500 caractères')
    .optional()
    .or(z.literal('')),
  mediaUrl: z.string().url('URL média invalide'),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  expiresIn: z
    .number()
    .int()
    .min(1)
    .max(72) // heures, max 3 jours
    .optional(),
})

// Schéma de signalement
export const reportSchema = z.object({
  reason: z.enum(['FAKE_PROFILE', 'SPAM', 'HARASSMENT', 'SCAM', 'INAPPROPRIATE', 'OTHER']),
  description: z.string().max(1000).optional().or(z.literal('')),
})

// Schéma de salon vocal
export const roomSchema = z.object({
  name: z
    .string()
    .min(3, 'Au moins 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .trim(),
  description: z.string().max(200).optional().or(z.literal('')),
  category: z.enum(['SOCIAL', 'MUSIC', 'GAMES', 'DATING', 'LEARNING']),
  language: z.string().min(2).max(5),
  isPrivate: z.boolean().optional(),
  maxMembers: z.number().int().min(2).max(50).optional(),
})

// Schéma de réinitialisation de mot de passe
export const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase().trim(),
})

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type MomentInput = z.infer<typeof momentSchema>
export type ReportInput = z.infer<typeof reportSchema>
export type RoomInput = z.infer<typeof roomSchema>
