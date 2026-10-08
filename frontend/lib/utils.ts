import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInYears, formatDistanceToNow, format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calcule l'âge depuis la date de naissance
export function calculateAge(birthDate: Date | string): number {
  const date = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  return differenceInYears(new Date(), date)
}

// Vérifie si l'utilisateur a 18 ans ou plus
export function isAdult(birthDate: Date | string): boolean {
  return calculateAge(birthDate) >= 18
}

// Formate la date relative (il y a 2 minutes, etc.)
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: fr })
}

// Formate la date en format lisible
export function formatDate(date: Date | string, fmt = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: fr })
}

// Formate l'heure
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm')
}

// Calcule la distance entre deux coordonnées GPS (en km)
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function toRad(value: number): number {
  return (value * Math.PI) / 180
}

// Formate la distance
export function formatDistance(km: number): string {
  if (km < 1) return 'À proximité'
  if (km < 10) return `${km} km`
  if (km < 100) return `${Math.round(km / 5) * 5} km`
  return `${Math.round(km / 50) * 50} km`
}

// Génère les initiales depuis un nom
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Formate le montant de pièces
export function formatCoins(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}k`
  return amount.toString()
}

// Tronque le texte
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Vérifie si une URL est valide
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Génère une couleur depuis un ID utilisateur (pour les avatars)
export function userColor(userId: string): string {
  const colors = [
    '#7C5CFF', '#FF4FA3', '#FF7A6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98', '#F0E68C',
  ]
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Parse JSON safely
export function safeParseJSON<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

// Formate la taille de fichier
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Plateau d'XP par niveau
export function xpForLevel(level: number): number {
  return level * level * 100
}

// Calcule le niveau depuis l'XP
export function levelFromXp(xp: number): number {
  let level = 1
  while (xpForLevel(level + 1) <= xp) level++
  return level
}

// Pourcentage de progression vers le prochain niveau
export function levelProgress(xp: number): number {
  const level = levelFromXp(xp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  return Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Valide l'email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Formate le numéro de téléphone
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('00')) return '+' + cleaned.slice(2)
  return cleaned
}

// Mélange un tableau (Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
