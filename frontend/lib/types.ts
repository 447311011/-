// ============================================================
// Types Hilunia
// ============================================================

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER'
export type InterestedIn = 'MALE' | 'FEMALE' | 'BOTH' | 'ALL'
export type RelationshipGoal = 'FRIENDSHIP' | 'CASUAL' | 'SERIOUS' | 'NETWORKING'
export type VipLevel = 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'LEGEND'
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIFT' | 'VOICE_NOTE' | 'STICKER'
export type RoomRole = 'HOST' | 'CO_HOST' | 'SPEAKER' | 'LISTENER'
export type ReportReason = 'FAKE_PROFILE' | 'SPAM' | 'HARASSMENT' | 'SCAM' | 'INAPPROPRIATE' | 'OTHER'

export interface UserPublic {
  id: string
  displayName: string
  age: number
  gender: Gender
  city?: string
  country?: string
  countryCode?: string
  bio?: string
  photos: string[]
  mainPhoto?: string
  isOnline: boolean
  lastSeenAt: string
  vipLevel: VipLevel
  selfieVerified: boolean
  level: number
  interests: string[]
  goal?: RelationshipGoal
  height?: number
  distanceKm?: number
}

export interface UserPrivate extends UserPublic {
  email: string
  phone?: string
  goldCoins: number
  diamonds: number
  gameTokens: number
  emailVerified: boolean
  bonusProfileDone: boolean
  bonusSelfieDone: boolean
  bonusFirstMoment: boolean
  bonusFirstMatch: boolean
}

export interface ProfileCardData {
  id: string
  userId: string
  displayName: string
  age: number
  city?: string
  country?: string
  photos: string[]
  mainPhoto?: string
  bio?: string
  height?: number
  goal?: string
  interests: string[]
  isOnline: boolean
  vipLevel: VipLevel
  selfieVerified: boolean
  distanceKm?: number
  commonInterests?: string[]
}

export interface Moment {
  id: string
  userId: string
  user: {
    id: string
    displayName: string
    mainPhoto?: string
    vipLevel: VipLevel
    selfieVerified: boolean
  }
  mediaUrl: string
  mediaType: 'IMAGE' | 'VIDEO'
  caption?: string
  likeCount: number
  commentCount: number
  viewCount: number
  isLiked?: boolean
  createdAt: string
  expiresAt?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  type: MessageType
  mediaUrl?: string
  isRead: boolean
  readAt?: string
  createdAt: string
  replyTo?: Message
}

export interface Conversation {
  id: string
  matchId?: string
  otherUser: UserPublic
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatRoom {
  id: string
  hostId: string
  host: UserPublic
  name: string
  description?: string
  category: string
  language: string
  coverUrl?: string
  isPrivate: boolean
  maxMembers: number
  memberCount: number
  isActive: boolean
  createdAt: string
}

export interface Gift {
  id: string
  name: string
  emoji: string
  coinsCost: number
  category: 'ROMANCE' | 'FRIENDSHIP' | 'FUN' | 'LUXURY'
  animationUrl?: string
}

export const GIFTS: Gift[] = [
  { id: 'rose', name: 'Rose', emoji: '🌹', coinsCost: 10, category: 'ROMANCE' },
  { id: 'heart', name: 'Cœur', emoji: '❤️', coinsCost: 20, category: 'ROMANCE' },
  { id: 'kiss', name: 'Bisou', emoji: '💋', coinsCost: 30, category: 'ROMANCE' },
  { id: 'bouquet', name: 'Bouquet', emoji: '💐', coinsCost: 50, category: 'ROMANCE' },
  { id: 'ring', name: 'Bague', emoji: '💍', coinsCost: 200, category: 'ROMANCE' },
  { id: 'hug', name: 'Câlin', emoji: '🤗', coinsCost: 15, category: 'FRIENDSHIP' },
  { id: 'star', name: 'Étoile', emoji: '⭐', coinsCost: 25, category: 'FRIENDSHIP' },
  { id: 'rainbow', name: 'Arc-en-ciel', emoji: '🌈', coinsCost: 40, category: 'FRIENDSHIP' },
  { id: 'fire', name: 'Feu', emoji: '🔥', coinsCost: 35, category: 'FUN' },
  { id: 'rocket', name: 'Fusée', emoji: '🚀', coinsCost: 60, category: 'FUN' },
  { id: 'party', name: 'Fête', emoji: '🎉', coinsCost: 45, category: 'FUN' },
  { id: 'crown', name: 'Couronne', emoji: '👑', coinsCost: 150, category: 'LUXURY' },
  { id: 'diamond', name: 'Diamant', emoji: '💎', coinsCost: 300, category: 'LUXURY' },
  { id: 'castle', name: 'Château', emoji: '🏰', coinsCost: 500, category: 'LUXURY' },
]

export const VIP_LEVELS = {
  NONE: { color: '#9B8FC4', label: 'Standard', icon: '⬜' },
  BRONZE: { color: '#CD7F32', label: 'Bronze', icon: '🥉' },
  SILVER: { color: '#C0C0C0', label: 'Silver', icon: '🥈' },
  GOLD: { color: '#FFD700', label: 'Gold', icon: '🥇' },
  DIAMOND: { color: '#B9F2FF', label: 'Diamond', icon: '💎' },
  LEGEND: { color: '#FF4FA3', label: 'Legend', icon: '👑' },
} as const

export const INTERESTS = [
  '🎵 Musique', '🎬 Films', '📚 Lecture', '✈️ Voyages', '🍕 Gastronomie',
  '💪 Fitness', '🎮 Jeux vidéo', '🎨 Art', '📸 Photo', '🌿 Nature',
  '🐾 Animaux', '⚽ Sport', '🎭 Théâtre', '💃 Danse', '🧘 Méditation',
  '🍳 Cuisine', '🎸 Guitare', '🏄 Surf', '🎯 Tir à l\'arc', '🧩 Puzzles',
  '🌐 Tech', '💼 Business', '🎤 Chant', '🏋️ Musculation', '🎻 Violon',
]

export const COIN_COSTS = {
  SUPER_LIKE: 50,
  REVEAL_CONTACT: 100,
  BOOST_PROFILE: 200,
  BOOST_MOMENT: 50,
  SEND_GIFT_BASE: 10,
  MESSAGE_AFTER_LIMIT: 5,
  VOICE_ROOM_GIFT: 20,
}

export const COIN_REWARDS = {
  WELCOME: 300,
  PROFILE_COMPLETE: 100,
  SELFIE_VERIFY: 200,
  FIRST_MOMENT: 50,
  FIRST_MATCH: 100,
  DAILY_LOGIN: 30,
  DAILY_MOMENT: 20,
  TASK_COMPLETE: 50,
}
